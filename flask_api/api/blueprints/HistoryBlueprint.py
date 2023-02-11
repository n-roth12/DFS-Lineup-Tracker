from flask import jsonify, Blueprint, request
from api import app
import json
import requests

from .utilities import token_required
from ..controllers.RedisController import RedisController
from ..controllers.MongoController import MongoController

history_blueprint = Blueprint('history_blueprint', __name__, url_prefix='/history')
RedisController = RedisController()
MongoController = MongoController()


@history_blueprint.route('/search/week', methods=['GET'])
def research_search():
	year = request.args.get('year')
	week = request.args.get('week')

	if (not year or not week):
		return jsonify({ 'Error': 'Missing year or week!' }), 400

	try:
		year = int(year)
		week = int(week)
	except ValueError:
		return jsonify({ 'Error': 'Year and week must be integers!' }), 400

	players_from_cache = RedisController.get_players(year, week)

	if players_from_cache is None:
		players_from_cache = RedisController.set_players(year, week)

	players = players_from_cache

	games = RedisController.get_games(year, week)

	if games is None:
		games = RedisController.set_games(year, week)

	return jsonify({ 'players': players, 'games': games}), 200


@history_blueprint.route('/search/year', methods=['GET'])
def research_year():
	year = request.args.get('year')
	if not year:
		return jsonify({ 'Error': 'Year not specified.' }), 400

	players = RedisController.get_year(year)

	if players == None:
		players = RedisController.set_year(year)

	return jsonify({ 'players': players, 'games': [] }), 200


@history_blueprint.route('/search/top_searches', methods=['GET'])
def top_searches():
	players = ['Jonathan Taylor', 
		'Justin Jefferson', 
		'Joe Mixon',
		'Joe Burrow']
	return jsonify({ 'names': players }), 200


@history_blueprint.route('/player', methods=['GET'])
def research_player():
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

@history_blueprint.route('/draftGroups/test', methods=["POST"])
def test_draftGroups():
	data = json.loads(request.data)
	draftGroupId = data.get("draftGroupId")
	if not draftGroupId:
		return jsonify({ "Error": "Missing draft group id" }), 400

	draftables = MongoController.getDraftablesByDraftGroupId(draftGroupId)
	print(draftables)

	return jsonify({ "Message": "Success" }), 200

@history_blueprint.route('/draftGroupsByWeek', methods=["GET"])
def get_draftGroups_by_week():
	year = request.args.get("year")
	week = request.args.get("week")

	if not year or not week:
		return jsonify({ "Error": "Missing year or week" }), 400


@history_blueprint.route('/draftGroupsByDateRange', methods=["GET"])
def get_draftGroups_by_date_range():
	startTime = request.args.get("startTime")
	endTime = request.args.get("endTime")

	if not startTime or not endTime:
		return jsonify({ "Error": "Missing startTime or endTime" }), 400

	
	