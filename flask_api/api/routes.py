from api import app, db, ma
from flask import Flask, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
import json
import requests
import redis
import jwt
import uuid
from flask_cors import cross_origin
from functools import wraps
from api.models.player import Player, PlayerSchema
from api.models.lineup import Lineup, LineupSchema, FullLineupSchema
from api.models.user import User
import csv
from .date_services import parseDate, getCurrentWeek
from .redis_service import RedisService
from pandas import read_csv
from sqlalchemy import desc
from sqlalchemy import func
from pymongo import MongoClient
from pprint import pprint
import certifi
from bson import json_util
from bson.objectid import ObjectId
from .ownership_service import OwnershipService
from .SportsDataAdapter import SportsDataAdapter
from .DraftKingsAdapter import DraftKingsAdapter

# to start backend: $ npm run start-backend
# starts the flask api and redis server

redis_client = redis.Redis(host='localhost', port=6379, db=0)
redis_service = RedisService(host='localhost', port=6379, db=0)


def token_required(f):
	"""
		Decorator for handling required json web tokens.
	"""
	@wraps(f)
	def decorated(*args, **kwargs):
		token = None
		if 'x-access-token' in request.headers:
			token = request.headers['x-access-token'].replace('"', '')
		if not token:
			print('no token')
			return jsonify({ 'Error': 'Token is missing.' }), 401
		try:
			data = jwt.decode(token, app.config['SECRET_KEY'], algorithms='HS256')
			current_user = db.session.query(User).filter(User.public_id == data['public_id']).first()
		except:
			print('token invalid')
			return jsonify({ 'Error': 'Token is invalid.' }), 401
		return f(current_user, *args, **kwargs)
	return decorated


@app.route('/test', methods=['GET'])
def get_test():
	return jsonify({ 'Message': 'Test GET succeeded!' })

@app.route('/redis/ping', methods=['GET'])
def ping_redis():
	result = redis_service.ping_cache()
	return jsonify({ "message": result }), 200

@app.route('/redis/fail', methods=['GET'])
def fail_cache():
	result = redis_service.fail_cache()
	return jsonify({ "message": result }), 200
	

@app.route('/players', methods=['GET'])
def get_players():

	year = request.args.get('year')
	week = request.args.get('week')

	players = redis_service.get_players(year, week)
	if not players:
		players = redis_service.set_players(year, week)

	return jsonify({ 'players': players }), 200


@app.route('/players/<id>', methods=['DELETE'])
def delete_player(id: int):
	player = db.session.query(Player).filter(Player.id == id).first()
	if not player:
		return jsonify({ 'Error': 'No player found with specified id.' })
	
	db.session.delete(player)
	db.session.commit()

	return jsonify({ 'Message': 'Player successfully deleted!' })


@app.route('/players/<id>', methods=['PUT'])
def edit_player(id: int):
	player = db.session.query(Player).filter(Player.id == id).first()
	if not player:
		return jsonify({ 'Error': 'No player with specified id.' })
	
	data = request.get_json()
	if data["name"]:
		player.name = data["name"]
	if data["position"]:
		player.position = data["position"]
	if data["team"]:
		player.team = data["team"]
	db.session.commit()

	return jsonify({ 'Message': 'Player information successfully updated!' })


@app.route('/lineups', defaults={'id': None}, methods=['GET'])
@app.route('/lineups/<id>', methods=['GET'])
@token_required
def get_lineup(current_user: User, id: int):
	if not id:
		lineups = db.session.query(Lineup).all()
		if not len(lineups):
			return jsonify({ 'Error': 'No lineups in database!' })

		schema = LineupSchema(many=True)
		return jsonify({ 'lineups': schema.dump(lineups) })

	lineup = db.session.query(Lineup).filter(Lineup.id == id).first()
	if not lineup:
		return jsonify({ 'Error': 'No lineup with specified id.' })

	l = LineupSchema().dump(lineup)
	return jsonify(LineupSchema().dump(lineup))


@app.route('/lineups', methods=['POST'])
@token_required
def create_lineup(current_user: User):
	data = json.loads(request.data)
	print(data)
	try:
		year = int(data['year'])
		week = int(data['week'])
	except ValueError:
		return jsonify({ 'Error': 'Year and week must be integers.' }), 400
	if year not in range(2012, 2022):
		return jsonify({ 'Error': 'Not valid year' }), 400
	if week not in range(0, 18):
		return jsonify({ 'Error': 'Not valid week' }), 400
	new_lineup = Lineup(user_public_id=current_user.public_id, 
						week=week,
						year=year, 
						bet=data["bet"] if data["bet"] else 0, 
						winnings=data["winnings"] if data["winnings"] else 0)
	db.session.add(new_lineup)
	db.session.commit()

	return jsonify(LineupSchema().dump(new_lineup)), 200


@app.route('/pos_points', methods=['POST'])
@token_required
def temp(current_user: User):
	data = json.loads(request.data)
	result = {'QB': 0, 'RB': 0, 'WR': 0, 'TE': 0, 'DST': 0}
	for key, item in data.items():
		if item:
			if item['stats'].get('fanduel_points'):
				result[item['position']] += item['stats']['fanduel_points']
			else:
				result[item['position']] += item['stats']['fantasy_points']
	return result, 200


@app.route('/teaminfo', methods=['GET'])
@token_required
def team_info(current_user: User):
	year = request.args.get('year')
	week = request.args.get('week')
	if not year or not week:
		return jsonify({ 'Error': 'Year or week not specified.' }), 400

	teams_info = redis_service.get_teams_info(year, week)
	if not teams_info:
		teams_info = redis_service.set_teams_info(year, week)

	return jsonify(teams_info), 200


@app.route('/lineups/<id>', methods=['PUT'])
@token_required
def edit_lineup(current_user: User, id: int):
	key = f'lineup_data_{id}'

	redis_client.delete(key)

	lineup = db.session.query(Lineup).filter(Lineup.id == id).first()
	if not lineup:
		return jsonify({ 'Error': 'No lineup with specified id.' })
	
	data = json.loads(request.data)
	del data["percentile"]
	lineup.update(data)
	db.session.commit()

	return jsonify({ 'updated_lineup': LineupSchema().dump(lineup) })


@app.route('/lineups/<id>', methods=['DELETE'])
def delete_lineup(id: int):
	lineup = db.session.query(Lineup).filter(Lineup.id == id).first()
	if not lineup:
		return jsonify({ 'Error': 'No lineup found with specified id.' })
	
	db.session.delete(lineup)
	db.session.commit()
	return jsonify({ 'Message': 'Lineup successfully deleted!' })


@app.route('/users', methods=['GET'])
@token_required
def get_user(current_user: User):
	"""
		This function retrieves the lineups for a User.
	"""
	user_lineups = db.session.query(Lineup) \
					.filter(Lineup.user_public_id == current_user.public_id) \
					.order_by(Lineup.year.desc(), Lineup.week.desc()).all()

	whole_response = []
	for user_lineup in user_lineups:
		response = {}
		response["id"] = user_lineup.id
		response["week"] = user_lineup.week
		response["year"] = user_lineup.year
		response["points"] =user_lineup.points
		response["bet"] = user_lineup.bet
		response["winnings"] = user_lineup.winnings
		response["position"] = user_lineup.position
		response["entries"] = user_lineup.entries
		response["percentile"] = user_lineup.percentile

		whole_response.append(response)

	return jsonify(whole_response), 200


@app.route('/lineup_data/<lineup_id>', methods=['GET'])
def get_lineup_data(lineup_id: int):
	key = f'lineup_data_{lineup_id}'
	lineup_data_from_cache = redis_client.get(key)
	if lineup_data_from_cache is None:

		body_data = requests.get(f'{app.config["BASE_URL"]}/lineups/{lineup_id}').json()
		res = requests.post(f'{app.config["FFB_API_URL"]}api/playergamestats', 
							json=body_data)
		lineup_data_from_api = res.json()


		redis_client.set(key, json.dumps(lineup_data_from_api))
		lineup_data_from_cache = redis_client.get(key)

	result = json.loads(lineup_data_from_cache)

	return jsonify({ 'lineup_data': result }), 200


@app.route('/users/register', methods=['POST'])
def register_user():
	data = json.loads(request.data)

	user_exists = db.session.query(User.id).filter(User.username == data['username']).first()
	if user_exists:
		return jsonify({ 'Error': 'Username is already in use.' }), 409

	user_to_create = User(public_id=str(uuid.uuid4()) ,username=data['username'], password=data['password'])
	db.session.add(user_to_create)
	db.session.commit()
	token = jwt.encode({ 'public_id': user_to_create.public_id }, app.config['SECRET_KEY'], algorithm='HS256')

	return jsonify({ 'token': token }), 200


@app.route('/users/login', methods=['POST'])
def login_user():
	"""
		Logs in a User.
		Returns a JSON web token in order to authorize further requests from the User.
	"""
	data = json.loads(request.data)

	attempted_user = db.session.query(User).filter(User.username == data['username']).first()

	if attempted_user and attempted_user.check_password_correction(attempted_password=data['password']):
		token = jwt.encode({ 'public_id': attempted_user.public_id }, app.config['SECRET_KEY'], algorithm='HS256')
		return jsonify({ 'token': token })
	else:
		return jsonify({ 'Error': 'Unable to login.' }), 403


# TODO check if it is a bestball lineup, maybe allow filtering or dont show it
@app.route('/lineups/upload', methods=['POST'])
@token_required
def upload_file(current_user: User):
	file = request.files["myFile"]
	if not file.filename:
		return jsonify({ 'Error': 'Missing file!' }), 400

	csv_file = read_csv(file, header=0, index_col=False, 
		usecols = ['Entry Id', 'Sport', 'Date', 'Title', 'SalaryCap', 
			'Score', 'Position', 'Entries', 'Entry ($)', 'Winnings ($)'])

	already_exists = 0
	for index, row in csv_file.iterrows():
		if row['Sport'] == 'nfl' and row['Score'] == row['Score']:
			lineup_exists = db.session.query(Lineup).filter(Lineup.user_public_id == current_user.public_id,
															Lineup.entry_id == row['Entry Id']).first()
			if not lineup_exists:
				parsed_week = parseDate(row['Date'])
				if parsed_week == -1:
					continue
				new_lineup = Lineup()
				year = int(row['Date'].split("/")[0])
				new_lineup.year = year if year > 8 else year - 1
				new_lineup.week = parsed_week
				new_lineup.points = float(row['Score'])
				new_lineup.bet = float(row['Entry ($)'])
				new_lineup.winnings = float(row['Winnings ($)'])
				new_lineup.user_public_id = current_user.public_id
				new_lineup.entry_id = row['Entry Id']
				new_lineup.tournament_name = row['Title']
				new_lineup.site = 'Fanduel'
				new_lineup.imported = True
				new_lineup.position = row['Position']
				new_lineup.entries = row['Entries']
				db.session.add(new_lineup)
				db.session.commit()
			else:
				already_exists += 1

	return jsonify(already_exists), 200


@app.route('/upcoming/slates_new', methods=["GET"])
@token_required
def upcoming_slates(current_user: User):
	client = MongoClient(f'{app.config["MONGODB_URI"]}', tlsCAFile=certifi.where())
	db = client["DFSDatabase"]
	collection = db["draftGroups"]
	cursor = collection.find({})
	slates = sorted([group["draftGroup"] for group in cursor], key=lambda x: len(x["games"]), reverse=True)

	return jsonify(slates), 200


@app.route('/upcoming/draftGroup', methods=["GET"])
@token_required
def upcoming_draftGroups(current_user: User):
	draftGroupId = request.args.get("draftGroup")
	print(draftGroupId)
	client = MongoClient(f'{app.config["MONGODB_URI"]}', tlsCAFile=certifi.where())
	db = client["DFSDatabase"]
	collection = db["draftGroups"]
	cursor = collection.find({})
	draftGroup = [x for x in cursor if str(x["draftGroup"]["draftGroupId"]) == str(draftGroupId)][0]

	# return jsonify(draftGroup), 200
	return jsonify(json.loads(json_util.dumps(draftGroup))), 200


@app.route('/upcoming/games', methods=['GET'])
@token_required
def upcoming_games(current_user: User):
	
	key = f'games_week_year'
	games_from_cache = redis_client.get(key)
	games_from_cache = None

	if games_from_cache is None:
		data = requests.get(f'{app.config["FFB_API_URL"]}/api/upcoming_games').json()
		games_from_api = data['games']

		redis_client.set(key, json.dumps(games_from_api))

		return jsonify({'games': games_from_api}), 200

	return jsonify({'games': json.loads(games_from_cache)}), 200


@app.route('/upcoming/players', methods=['GET'])
@token_required
def upcoming_players(current_user: User):
	args = request.args
	draft_group_id = args["draftGroup"]
	
	client = MongoClient(f'{app.config["MONGODB_URI"]}', tlsCAFile=certifi.where())
	db = client["DFSDatabase"]
	collection = db["draftables"]
	result = collection.find_one({ "draft_group_id": int(draft_group_id) })

	return jsonify(result["draftables"]), 200


@app.route('/upcoming/ownership', methods=["GET"])
@token_required
def upcoming_projections(current_user: User):

	return jsonify(OwnershipService.getOwnershipProjections()), 200


# @app.route('/fetchDraftkingsData', methods=['POST'])
# def get_data():
# 	db = client['test_db']
# 	collection = db['test_collection']

# 	# mydict = { "name": "John", "position": "Justin Jefferson", "team": "Vikings" }
# 	# x = collection.insert_one(mydict)
# 	# print(x.inserted_id)

# 	# mylist = [
# 	# 	{ 
# 	# 		"_id": 1, "name": "Dalvin Cook", "position": "RB", "team": "Vikings",
# 	# 		"name": "Deebo Samuel", "position": "WR", "team": "49ers"
# 	# 	}
# 	# ]

# 	# x = collection.insert_many(mylist)
# 	# print(x.inserted_ids)

# 	for x in collection.find():
# 		print(x)


# 	return 'test', 200

@app.route('/ownership', methods=["POST"])
def set_projections():

	print("Scraping ownership projections...")
	projections = OwnershipService.scrape_ownership()
	print(projections)
	
	client = MongoClient(f'{app.config["MONGODB_URI"]}', tlsCAFile=certifi.where())
	db = client["DFSOwnershipProjections"]
	collection = db["projections"]
	collection.insert_one(json.loads(json_util.dumps(projections)))
	print("Finished scraping ownership projections.")

	return jsonify(projections), 200
	



@app.route("/test/scrape1", methods=["POST"])
def test():
	print("Scraping upcoming draft groups...")
	draft_groups = fetch_draftkings_draft_groups()
	print("Finished scraping upcoming draft groups!")

	print("Scraping upcoming draftables...")
	for draft_group in draft_groups:
		fetch_draftkings_draft_group_data(draft_group["draftGroup"]["draftGroupId"])
		print(f"Finished draft group {draft_group['draftGroup']['draftGroupId']}.")

	print("Finished scraping upcoming draftables!")

	return "success", 200


def fetch_draftkings_draft_groups():
	draftKingsDraftGroups = DraftKingsAdapter.getDraftKingsDraftGoups()
	
	client = MongoClient(f'{app.config["MONGODB_URI"]}', tlsCAFile=certifi.where())
	db = client["DFSDatabase"]
	collection = db["draftGroups"]
	collection.insert_many(draftKingsDraftGroups)

	return draftKingsDraftGroups


def fetch_draftkings_draft_group_data(draft_group_id: str):
	players = DraftKingsAdapter.getDraftKingsDraftablesByDraftGroupId(draft_group_id)
	players = { "draftables": players, "draft_group_id": draft_group_id }

	client = MongoClient(f'{app.config["MONGODB_URI"]}', tlsCAFile=certifi.where())
	db = client["DFSDatabase"]
	collection = db["draftables"]
	collection.insert_one(players)

	return "success", 200


@app.route('/upcoming/slates', methods=['GET'])
@token_required
def get_slates(current_user: User):

	key = f'current_slates'
	slates_from_cache = redis_client.get(key)
	if slates_from_cache is None:
		client = MongoClient(f'{app.config["MONGODB_URI"]}', tlsCAFile=certifi.where())
		db = client["DFSDatabase"]
		collection = db["draftGroups"]
		result = []
		
		for item in collection.find():
			result.append(json.loads(json_util.dumps(item)))

		redis_client.set(key, json.dumps(result))
		slates = result
	else:
		slates = json.loads(slates_from_cache)
	
	return jsonify(slates), 200


@app.route('/upcoming/suggestions/generateLineup/<slateId>', methods=['GET'])
def get_recommendation(slateId: str):
	client = MongoClient(f'{app.config["MONGODB_URI"]}', tlsCAFile=certifi.where())
	db = client["DFSDatabase"]
	collection = db["draftGroups"]
	draft_group = collection.find_one({"_id": ObjectId(slateId)})
	
	# create a random lineup
	lineup = {}

	return 'Success', 200

@app.route('/lineups_new', methods=['GET'])
@token_required
def get_draftgroup_lineups(current_user: User):
	draft_group = request.args.get("draftGroup")
	
	client = MongoClient(f'{app.config["MONGODB_URI"]}', tlsCAFile=certifi.where())
	db = client["DFSDatabase"]
	collection = db["lineups"]
	cursor = collection.find({"draft-group": draft_group})
	lineups = [lineup for lineup in cursor]

	return jsonify(json.loads(json_util.dumps(lineups))), 200

@app.route('/lineup_new', methods=['GET'])
@token_required
def get_singe_lineup(current_user: User):
	lineupId = request.args.get("lineupId")

	client = MongoClient(f'{app.config["MONGODB_URI"]}', tlsCAFile=certifi.where())
	db = client["DFSDatabase"]
	collection = db["lineups"]
	lineup = collection.find_one({"lineup-id": lineupId})

	return jsonify(json.loads(json_util.dumps(lineup))), 200


@app.route('/lineups/createLineup', methods=['POST'])
@token_required
def create_lineup_new(current_user: User):
	data = json.loads(request.data)
	data["user_public_id"] = current_user.public_id

	client = MongoClient(f'{app.config["MONGODB_URI"]}', tlsCAFile=certifi.where())
	db = client["DFSDatabase"]
	collection = db["lineups"]
	collection.replace_one({"draft-group": data["draft-group"], "lineup-id": data["lineup-id"]}, data, upsert=True)

	return jsonify({ "message": "Success" }), 200


@app.route('/lineups/createEmptyLineup', methods=['POST'])
@token_required
def create_emptpy_lineup(current_user: User):
	data = json.loads(request.data)
	data["user_public_id"] = current_user.public_id
	data["draft-group"] = str(data["draft-group"])
	data["lineup-id"] = str(uuid.uuid4()).replace("-", "").replace("%7D", "")
	data["lineup"] = {
		"qb": None,
		"wr1": None,
		"wr2": None,
		"wr3": None,
		"rb1": None,
		"rb2": None,
		"te": None,
		"flex": None,
		"dst": None
  	}

	client = MongoClient(f'{app.config["MONGODB_URI"]}', tlsCAFile=certifi.where())
	db = client["DFSDatabase"]
	collection = db["lineups"]
	collection.insert_one(data)

	return jsonify({ "lineupId": data["lineup-id"] }), 200


@app.route('/history/search/week', methods=['GET'])
@token_required
def research_search(current_user: User):
	year = request.args.get('year')
	week = request.args.get('week')

	if (not year or not week):
		return jsonify({ 'Error': 'Missing year or week!' }), 400

	try:
		year = int(year)
		week = int(week)
	except ValueError:
		return jsonify({ 'Error': 'Year and week must be integers!' }), 400

	key1 = f'players_{year}_{week}'
	players_from_cache = redis_client.get(key1)

	if players_from_cache is None:
		res = requests.get(f'{app.config["FFB_API_URL"]}api/top?year={year}&week={week}')
		players_from_api = res.json()
		qbs_res = requests.get(f'{app.config["FFB_API_URL"]}api/top?year={year}&week={week}&pos=QB')
		qbs_from_api = qbs_res.json()
		rbs_res = requests.get(f'{app.config["FFB_API_URL"]}api/top?year={year}&week={week}&pos=RB')
		rbs_from_api = rbs_res.json()
		wrs_res = requests.get(f'{app.config["FFB_API_URL"]}api/top?year={year}&week={week}&pos=WR')
		wrs_from_api = wrs_res.json()
		tes_res = requests.get(f'{app.config["FFB_API_URL"]}api/top?year={year}&week={week}&pos=TE')
		tes_from_api = tes_res.json()
		def_res = requests.get(f'{app.config["FFB_API_URL"]}api/top?year={year}&week={week}&pos=dst')
		defenses_from_api = def_res.json()

		result = {
			"All": players_from_api, 
			"QB": qbs_from_api,
			"RB": rbs_from_api,
			"WR": wrs_from_api,
			"TE": tes_from_api,
			"DST": defenses_from_api 
		}

		redis_client.set(key1, json.dumps(result))
		players_from_cache = redis_client.get(key1)

	players = json.loads(players_from_cache)

	key2 = f'games_{year}_{week}'
	games_from_cache = redis_client.get(key2)

	if games_from_cache is None:
		data = requests.get(f'{app.config["FFB_API_URL"]}/api/teamstats?week={week}&year={year}').json()
		games = []

		for team, team_data in data.items():
			if len(team_data):
				game = team_data[0]['stats']['game']
				if game not in games:
					games.append(game)
		redis_client.set(key2, json.dumps(games))
		games_from_cache = redis_client.get(key2)

	games = json.loads(games_from_cache)

	return jsonify({ 'players': players, 'games': games}), 200


@app.route('/history/search/year', methods=['GET'])
@token_required
def research_year(current_user: User):
	year = request.args.get('year')
	if not year:
		return jsonify({ 'Error': 'Year not specified.' }), 400

	key = f'players_{year}'
	players_from_cache = redis_client.get(key)
	if players_from_cache == None:
		res = requests.get(f'{app.config["FFB_API_URL"]}api/top?year={year}')
		players_from_api = res.json()
		qbs_res = requests.get(f'{app.config["FFB_API_URL"]}api/top?year={year}&pos=QB')
		qbs_from_api = qbs_res.json()
		rbs_res = requests.get(f'{app.config["FFB_API_URL"]}api/top?year={year}&pos=RB')
		rbs_from_api = rbs_res.json()
		wrs_res = requests.get(f'{app.config["FFB_API_URL"]}api/top?year={year}&pos=WR')
		wrs_from_api = wrs_res.json()
		tes_res = requests.get(f'{app.config["FFB_API_URL"]}api/top?year={year}&pos=TE')
		tes_from_api = tes_res.json()
		def_res = requests.get(f'{app.config["FFB_API_URL"]}api/top?year={year}&pos=dst')
		defenses_from_api = def_res.json()		

		result = {
			"All": players_from_api, 
			"QB": qbs_from_api,
			"RB": rbs_from_api,
			"WR": wrs_from_api,
			"TE": tes_from_api,
			"DST": defenses_from_api 
		}

		redis_client.set(key, json.dumps(result))
		players_from_cache = redis_client.get(key)

	players = json.loads(players_from_cache)

	return jsonify({ 'players': players, 'games': [] }), 200


@app.route('/history/search/top_searches', methods=['GET'])
@token_required
def top_searches(current_user: User):
	players = ['Jonathan Taylor', 
		'Justin Jefferson', 
		'Joe Mixon',
		'Joe Burrow']
	return jsonify({ 'names': players }), 200


@app.route('/history/player', methods=['GET'])
@token_required
def research_player(current_user: User):
	name = request.args.get('name')
	year = request.args.get('year')
	if not year:
		years = range(2012, 2022)
		last_pos = "None"

		name_fixed = name.replace(' ', '_')
		result = []
		for year in years:
			res = requests.get(f'{app.config["FFB_API_URL"]}/api/stats?name={name_fixed}&year={year}')
			if res.status_code == 200:

				year_data = res.json()
				last_pos = year_data['position']
				result.append({'year': year, 'stats': year_data['stats'] })

		if not len(result):
			return jsonify({ 'Error': 'No data found.' }), 400

		return jsonify({ 'name': ' '.join(word[0].upper() + word[1:] for word in name.split(' ')), 
			'position': last_pos, 'stats': result}), 200

	name_fixed = name.replace(' ', '_')
	result = []
	res = requests.get(f'{app.config["FFB_API_URL"]}/api/performances?name={name_fixed}&year={year}')
	if res.status_code != 200:
		return jsonify({ 'Error': 'No data found.' }), 400

	year_data = res.json()

	return jsonify(year_data), 200


@app.route('/nfl/teams', methods=['GET'])
@token_required
def nfl_teams(current_user: User):
	teams_from_cache = redis_client.get('nfl_teams')
	if teams_from_cache is None:
		teams = requests.get(f'{app.config["FFB_API_URL"]}/api/nfl/teams').json()
		sorted_teams = sorted(teams['teams'])
		redis_client.set('nfl_teams', json.dumps(sorted_teams))
		teams_from_cache = sorted_teams
	else:
		teams_from_cache = json.loads(teams_from_cache)

	return jsonify(teams_from_cache), 200


@app.route('/research/lineups/count', methods=['GET'])
@token_required
def get_lineup_count(current_user: User):
	lineups_count = db.session.query(Lineup) \
				.filter(Lineup.user_public_id == current_user.public_id) \
				.count()
	return jsonify({ 'count': lineups_count }), 200


@app.route('/research/lineups/max', methods=['GET'])
@token_required
def get_lineup_max(current_user: User):
	max_score = db.session.query(func.max(Lineup.points)) \
		.filter(Lineup.user_public_id == current_user.public_id) \
		.scalar()
	if not max_score:
		return jsonify({ 'Error': 'No lineup max.' }), 400
	max_lineup = db.session.query(Lineup) \
		.filter(Lineup.points == max_score,
			Lineup.user_public_id == current_user.public_id) \
		.first()
	return jsonify({ 'max': LineupSchema().dump(max_lineup) }), 200

@app.route('/research/lineups/highest', methods=['GET'])
@token_required
def get_highest_lineup(current_user: User):
	max_winnings = db.session.query(func.max(Lineup.winnings - Lineup.bet)) \
		.filter(Lineup.user_public_id == current_user.public_id) \
		.scalar()
	if max_winnings:
		return jsonify({ 'highest': max_winnings }), 200
	else:
		return jsonify({ 'Error': 'No lineup max.' }), 400

@app.route('/research/lineups/percentile', methods=['GET'])
@token_required
def get_highest_percentile(current_user: User):
	highest_percentile = db.session.query(Lineup) \
		.filter(Lineup.user_public_id == current_user.public_id) \
		.all()
	print([p.percentile for p in highest_percentile])
	if not highest_percentile:
		return jsonify({ 'Error': 'No percentile max.' }), 400
	return 'Success', 200

@app.route('/research/players/temp', methods=['GET'])
@token_required
def get_temp(current_user: User):
	players = requests.get(f'{app.config["FFB_API_URL"]}/api/players?limit=10').json()
	print(players)
	return jsonify(players), 200



@app.route('/current/week', methods=['GET'])
def get_current_week():
	result = getCurrentWeek()
	return jsonify(result), 200


@app.route('/getUpcomingDfsSlateOwnershipProjections', methods=['GET'])
def getUpcomingDfsSlateOwnershipProjections():
	result = SportsDataAdapter.getUpcomingDfsSlateOwnershipProjections()
	return jsonify(result), 200
