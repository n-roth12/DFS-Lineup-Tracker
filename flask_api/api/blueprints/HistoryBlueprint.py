from flask import jsonify, Blueprint, request
from api import app
import json
from flask_cors import cross_origin
import requests

from .utilities import token_required, generate_stats_display
from ..controllers.RedisController import RedisController
from ..controllers.MongoController import MongoController
from ..controllers.FFBApiController import FFBApiController
from ..controllers.rules.scoring_config import get_score

history_blueprint = Blueprint('history_blueprint', __name__, url_prefix='/history')
RedisController = RedisController()
MongoController = MongoController()
FFBApiController = FFBApiController()

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


@history_blueprint.route('/playergamestats', methods=["GET"])
def get_draftGroup_playergamestats():
	draft_group_id = request.args.get("draftGroup")

	draftables = MongoController.getDraftablesByDraftGroupId(draftGroupId=int(draft_group_id))

	result = FFBApiController.get_draftables_playergamestats(draftables=draftables["draftables"], 
		week=draftables["week"], year=draftables["year"])

	for player in result:
		try: 
			player["statsDisplay"] = generate_stats_display(player["stats"]["stats"])
			player["fantasy_points"] = get_score(draftables["site"], player["stats"]["stats"])
		except KeyError:
			pass

	return jsonify(result), 200

@history_blueprint.route('/updateDraftgroups', methods=['POST'])
def update_draftgroups():
	draft_groups = MongoController.getDraftGroupsAll()

	count = 0
	for draft_group in draft_groups:
		if draft_group.get("year") and draft_group.get("week"):
			if draft_group["year"] <= 2022 and draft_group["week"] < 18:
				draft_group["state"] = "complete"
			count += 1

	return jsonify({ "Count": count }), 200

# @history_blueprint.route('/updateDraftables', methods=['POST'])
# def update_draftables():
# 	draftables = MongoController.getDraftablesAll()

# 	count1 = 0
# 	count2 = 0
# 	for draftable in draftables:
# 		if draftable.get("year") and draftable.get("week"):
# 			if draftable["year"] <= 2022 and draftable["week"] < 18:
# 				MongoController.updateDraftablesStatusByDraftGroupId(draftGroupId=draftable["draftGroupId"], status="complete")
# 				count1 += 1
# 			else:
# 				MongoController.updateDraftablesStatusByDraftGroupId(draftGroupId=draftable["draftGroupId"], status="upcoming")
# 				count2 += 1

# 	return jsonify({ "complete": count1, "upcoming": count2 }), 200

# @history_blueprint.route('deleteEmptyDraftables', methods=['POST'])
# def remove_empty_draftables():
# 	draftables = MongoController.getDraftablesAll()

# 	count = 0
# 	for draftable in draftables:
# 		if len(draftable["draftables"]) < 1:
# 			MongoController.deleteDraftableByDraftGroupId(draftable["draftGroupId"])
# 			count += 1

# 	return jsonify({ "Count": count }), 200
