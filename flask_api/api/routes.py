from api import app, db
from flask import request, jsonify
import json
import requests
import redis
import jwt
from functools import wraps
from api.models.user import User
from sqlalchemy import func
from pymongo import MongoClient
import certifi
from bson import json_util
from .date_services import getCurrentWeek
from .controllers.DraftKingsController import DraftKingsController
from .controllers.RedisController import RedisController
from .controllers.MongoController import MongoController
from .controllers.YahooController import YahooController

# to start backend: $ npm run start-backend
# starts the flask api and redis server

redis_client = redis.Redis(host='localhost', port=6379, db=0)
RedisController = RedisController()
MongoController = MongoController()
YahooController = YahooController()

# dynamodb = boto3.resource('dynamodb',
#                           aws_access_key_id="anything",
#                           aws_secret_access_key="anything",
#                           region_name="us-west-2",
#                           endpoint_url="http://localhost:8000")


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

	players = RedisController.get_players(year, week)
	if not players:
		players = RedisController.set_players(year, week)

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

	teams_info = RedisController.get_teams_info(year, week)
	if not teams_info:
		teams_info = RedisController.set_teams_info(year, week)

	return jsonify(teams_info), 200


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


@app.route('/current/week', methods=['GET'])
def get_current_week():
	result = getCurrentWeek()
	return jsonify(result), 200

@app.route('/draftkings_slates', methods=['GET'])
def get_slates():
	result = DraftKingsController.getDraftKingsSlates()
	return jsonify(result)

@app.route('/cache/flush', methods=['POST'])
def flush_cache():
	RedisController.flush_cache()
	return "success", 200

@app.route('/delete/lineups', methods=['POST'])
def delete_all_lineups():
	MongoController.deleteAllLineups()
	return "success", 200

@app.route('/delete/draftgroups', methods=['POST'])
def delete_all_draftgroups():
	MongoController.deleteAllDraftGroups()
	return "success", 200

@app.route('/delete/draftables', methods=['POST'])
def delete_all_draftables():
	MongoController.deleteAllDraftables()
	return "success", 200

	
