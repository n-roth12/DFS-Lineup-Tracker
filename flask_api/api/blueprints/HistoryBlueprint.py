from flask import jsonify, Blueprint, request
from api import app
import json
import requests

from ..routes import token_required
from ..models.user import User
from ..controllers.RedisController import RedisController

history_blueprint = Blueprint('history_blueprint', __name__, url_prefix='/history')
RedisController = RedisController()

@history_blueprint.route('/search/week', methods=['GET'])
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

	players_from_cache = RedisController.get_players(year, week)

	if players_from_cache is None:
		players_from_cache = RedisController.set_players(year, week)

	players = players_from_cache

	games = RedisController.get_games(year, week)

	if games is None:
		games = RedisController.set_games(year, week)

	return jsonify({ 'players': players, 'games': games}), 200


@history_blueprint.route('/search/year', methods=['GET'])
@token_required
def research_year(current_user: User):
	year = request.args.get('year')
	if not year:
		return jsonify({ 'Error': 'Year not specified.' }), 400

	players = RedisController.get_year(year)

	if players == None:
		players = RedisController.set_year(year)

	return jsonify({ 'players': players, 'games': [] }), 200


@history_blueprint.route('/search/top_searches', methods=['GET'])
@token_required
def top_searches(current_user: User):
	players = ['Jonathan Taylor', 
		'Justin Jefferson', 
		'Joe Mixon',
		'Joe Burrow']
	return jsonify({ 'names': players }), 200


@history_blueprint.route('/player', methods=['GET'])
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
