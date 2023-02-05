from api import app
from flask import request, jsonify
import json
import requests
import redis
import jwt
from functools import wraps
from sqlalchemy import func
from pymongo import MongoClient
import certifi
from bson import json_util
from .blueprints.utilities import token_required
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

@app.route('/pos_points', methods=['POST'])
@token_required
def temp(current_user):
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
def team_info(current_user):
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


@app.route('/nfl/teams', methods=['GET'])
@token_required
def nfl_teams(current_user):
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

	
