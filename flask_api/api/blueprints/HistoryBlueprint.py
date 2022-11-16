from flask import jsonify, Blueprint, request
from api import app
import json
import redis
import requests

from ..routes import token_required
from ..models.user import User

redis_client = redis.Redis(host='localhost', port=6379, db=0)

history_blueprint = Blueprint('history_blueprint', __name__, url_prefix='/history')

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


@history_blueprint.route('/search/year', methods=['GET'])
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
