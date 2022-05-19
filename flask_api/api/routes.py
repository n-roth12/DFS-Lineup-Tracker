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
from .date_services import parseDate
from pandas import read_csv
from sqlalchemy import desc

# to start backend: $ npm run start-backend
# starts the flask api and redis server

redis_client = redis.Redis(host='localhost', port=6379, db=0)

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


@app.route('/players', methods=['GET'])
def get_players():

	year = request.args.get('year')
	week = request.args.get('week')

	key = f'players_{year}_{week}'
	players_from_cache = redis_client.get(key)

	if players_from_cache is None:
		res = requests.get(f'{app.config["FFB_API_URL"]}api/top?year={year}&week={week}')
		players_from_api = res.json()
		res2 = requests.get(f'{app.config["FFB_API_URL"]}api/top?year={year}&week={week}&pos=dst')
		defenses_from_api = res2.json()
		players_from_api.extend(defenses_from_api)
		redis_client.set(key, json.dumps(players_from_api))
		players_from_cache = redis_client.get(key)

	players = json.loads(players_from_cache)
	return jsonify({ 'players': players }), 200
	

@app.route('/players', methods=['POST'])
def add_player():
	data = json.loads(request.data)
	if not data:
		return jsonify({ 'Error': 'Request body does not contain necessary data.' })

	new_player = Player(name=data['name'], position=data['position'], team=data['team'])
	db.session.add(new_player)
	db.session.commit()

	return jsonify({ 'Message': 'New player successfully addded!' })


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
	print(l)
	return jsonify(LineupSchema().dump(lineup))


@app.route('/player_counts', methods=['GET'])
def get_player_counts():
	lineups = db.session.query(Lineup).all()

	player_counts_dict = {}

	for lineup in lineups:
		data = json.loads(get_lineup_data(lineup.id)[0].data)
		print(data)
	

	return jsonify({ 'Message': 'Success' })


@app.route('/lineups', methods=['POST'])
@token_required
def create_lineup(current_user: User):
	data = json.loads(request.data)
	try:
		year = int(data['year'])
		week = int(data['week'])
	except ValueError:
		return jsonify({ 'Error': 'Year and week must be integers.' }), 400
	if year not in range(2012, 2021):
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
	key = f'team_info_{year}_{week}'
	team_info_from_cache = redis_client.get(key)
	if team_info_from_cache is None:
		res = requests.get(f'{app.config["FFB_API_URL"]}api/teamstats?year={year}&week={week}')
		data = res.json()
		result = []
		for team, players in data.items():
			if len(players):
				team_result = {'team': team}
				point_total = sum([player['stats']['fantasy_points'] for player in players])
				team_result['points'] = point_total
				result.append(team_result)
		result = sorted(result, key=lambda x: x['points'], reverse=True)
		redis_client.set(key, json.dumps(result))
		return jsonify(result), 200

	return jsonify(json.loads(team_info_from_cache)), 200


@app.route('/lineups/<id>', methods=['PUT'])
@token_required
def edit_lineup(current_user: User, id: int):
	key = f'lineup_data_{id}'

	redis_client.delete(key)

	lineup = db.session.query(Lineup).filter(Lineup.id == id).first()
	if not lineup:
		return jsonify({ 'Error': 'No lineup with specified id.' })
	
	data = json.loads(request.data)
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
	"""
		Registers a User.
		Returns a JSON web token in order to authorize further requests from the User.
	"""
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


@app.route('/upcoming', methods=['GET'])
@token_required
def upcoming(current_user: User):
	
	key = f'games_week_year'
	games_from_cache = redis_client.get(key)

	if games_from_cache is None:
		data = requests.get(f'{app.config["FFB_API_URL"]}/api/teamstats?week=18&year=2021').json()
		games = []

		for team, team_data in data.items():
			if len(team_data):
				game = team_data[0]['stats']['game']
				if game not in games:
					games.append(game)
		redis_client.set(key, json.dumps(games))

		return jsonify(games), 200

	return jsonify(json.loads(games_from_cache)), 200

















