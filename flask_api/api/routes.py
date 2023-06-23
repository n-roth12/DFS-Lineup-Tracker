from api import app
from flask import request, jsonify
import json
import requests
import jwt
from functools import wraps
from sqlalchemy import func
from pymongo import MongoClient
import certifi
from bson import json_util
from .blueprints.utilities import token_required
from .date_services import getCurrentWeek, getWeek, parseDate, parseDraftGroupDateString
from .controllers.DraftKingsController import DraftKingsController
from .controllers.RedisController import RedisController
from .controllers.MongoController import MongoController
from .controllers.YahooController import YahooController

# to start backend: $ npm run start-backend
# starts the flask api and redis server

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

@app.route('/current/week', methods=['GET'])
def get_current_week():
	result = getCurrentWeek()
	return jsonify(result), 200

@app.route('/getWeekByDate', methods=['GET'])
def get_week_by_date():
	date = request.args.get("date")
	if not date:
		return jsonify({ "Error": "Missing or incorrect date format" }), 400

	result = parseDraftGroupDateString(date)

	return jsonify({"date": result}), 200

@app.route("/temp/addDate", methods=["POST"])
def temp_add_date():
	draftGroups = MongoController.getDraftGroupsAll()

	for draftGroup in draftGroups:
		week_info = parseDraftGroupDateString(draftGroup["startTime"])
		MongoController.add_week_and_year_to_draftGroup_and_draftables(draftGroupId=draftGroup["draftGroupId"], \
			week=week_info["week"], year=week_info["year"])

	return "success", 200

@app.route("/temp/addDateLineup", methods=["POST"])
def temp_add_date_2():
	lineups = MongoController.getLineupsAll()

	for lineup in lineups:
		week_info = parseDraftGroupDateString(lineup["startTime"])
		MongoController.add_week_and_year_to_lineup(lineupId=lineup["lineupId"], \
			week=week_info["week"], year=week_info["year"])

	return "success", 200

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

	
