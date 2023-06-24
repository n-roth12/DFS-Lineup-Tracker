from flask import jsonify, Blueprint, request
from api import app
from pymongo import MongoClient
import certifi
import json
from bson import json_util
import requests

from .utilities import token_required
from ..ownership_service import OwnershipService
from ..controllers.MongoController import MongoController
from ..controllers.RedisController import RedisController
from ..controllers.DraftKingsController import DraftKingsController
from ..controllers.YahooController import YahooController

upcoming_blueprint = Blueprint('upcoming_blueprint', __name__, url_prefix='/upcoming')

mongoController = MongoController()
redisController = RedisController()
draftKingsController = DraftKingsController()
ownershipService = OwnershipService()
yahooController = YahooController()

@upcoming_blueprint.route('/slates_new', methods=["GET"])
def upcoming_slates():

	year = request.args.get("year")
	week = request.args.get("week")
	
	# temporarily overriding week and year so that we can show something in beta
	year = 2022
	week = 18

	if year and week:
		draft_groups = mongoController.get_draft_groups_by_year_and_week(year=int(year), week=int(week))
		return jsonify(draft_groups), 200

	draft_groups = redisController.get_draft_groups()
	if not draft_groups:
		print("cache hit")
		draft_groups = redisController.set_draft_groups()
	else:
		print("cache miss")

	return jsonify(draft_groups), 200

@upcoming_blueprint.route('/draftGroup', methods=["GET"])
@token_required
def upcoming_draftGroups(current_user):
	draftGroupId = request.args.get("draftGroup")
	client = MongoClient(f'{app.config["MONGODB_URI"]}', tlsCAFile=certifi.where())
	db = client["DFSDatabase"]
	collection = db["draftGroups"]
	draftGroup = collection.find_one({"draftGroupId": int(draftGroupId)})

	return jsonify(json.loads(json_util.dumps(draftGroup))), 200

# @upcoming_blueprint.route('/games', methods=['GET'])
# @token_required
# def upcoming_games(current_user):
	
# 	key = f'games_week_year'
# 	games_from_cache = redis_client.get(key)
# 	games_from_cache = None

# 	if games_from_cache is None:
# 		data = requests.get(f'{app.config["FFB_API_URL"]}/api/upcoming_games').json()
# 		games_from_api = data['games']

# 		redis_client.set(key, json.dumps(games_from_api))

# 		return jsonify({'games': games_from_api}), 200

# 	return jsonify({'games': json.loads(games_from_cache)}), 200

@upcoming_blueprint.route('/players', methods=['GET'])
@token_required
def upcoming_players(current_user):
	draft_group_id = request.args.get("draftGroup")
	draftables = mongoController.getDraftablesByDraftGroupId(draft_group_id)
	
	return jsonify(draftables["draftables"]), 200

@upcoming_blueprint.route('/ownership', methods=["GET"])
@token_required
def upcoming_projections(current_user):
	projections = ownershipService.getOwnershipProjections()

	return jsonify(projections), 200

# @upcoming_blueprint.route('/slates', methods=['GET'])
# @token_required
# def get_slates(current_user):

# 	key = f'current_slates'
# 	slates_from_cache = redis_client.get(key)
# 	if slates_from_cache is None:
# 		client = MongoClient(f'{app.config["MONGODB_URI"]}', tlsCAFile=certifi.where())
# 		db = client["DFSDatabase"]
# 		collection = db["draftGroups"]
# 		result = []
		
# 		for item in collection.find():
# 			result.append(json.loads(json_util.dumps(item)))

# 		redis_client.set(key, json.dumps(result))
# 		slates = result
# 	else:
# 		slates = json.loads(slates_from_cache)
	
# 	return jsonify(slates), 200

@upcoming_blueprint.route('/draftables', methods=['GET'])
def get_draftables():
	draftGroupId = request.args.get("draftGroupId")
	if not draftGroupId:
		return jsonify({ "Message": "error" }), 400
	draftables = mongoController.getDraftablesByDraftGroupId(draftGroupId)

	return jsonify(draftables["draftables"]), 200

@upcoming_blueprint.route('/ownership', methods=["POST"])
def set_projections():

	print("Scraping ownership projections...")
	projections = ownershipService.scrape_ownership()
	print("Finished scraping ownership projections.")

	mongoController.addProjections(projections)

	return jsonify(projections), 200

# this is the code in lambda_function of DraftKingsController lambda function
@upcoming_blueprint.route('/draftkings_draftgroups_and_draftables', methods=["POST"])
def draftkings_upcoming():
	draftGroupIds = draftKingsController.getDraftKingsDraftGroupIds()
	draftGroups = []
	draftGroupsDraftables = []
	for draftGroupId in draftGroupIds:
		draftGroup = draftKingsController.getDraftKingsDraftGroupById(draftGroupId)
		draftGroup["site"] = "draftkings"
		draftGroups.append(draftGroup)
	
		draftGroupDraftables = draftKingsController.getDraftKingsDraftablesByDraftGroupId(draftGroupId)
		draftGroupsDraftables.append({"draftGroupId" : draftGroupId, 
			"draftables": draftGroupDraftables, "site": "draftkings"})

	mongoController.addDraftGroups(draftGroups)
	mongoController.addDraftables(draftGroupsDraftables)

	return jsonify({"draft_groups": len(draftGroups), "draftables": len(draftGroupsDraftables)}), 200


# this is the code in the lambda_function of YahooController lambda function
@upcoming_blueprint.route('/yahoo_draftgroups_and_draftables', methods=['POST'])
def yahoo_upcoming():
	draftGroups = yahooController.getYahooUpcomingSeries()    # this doesn't contain contestIds, so we have to get
	draftGroupsDraftables = []								  # upcoming contests and pair with the seriesIds
	upcomingContests = yahooController.getYahooUpcomingContests()

	for contest in upcomingContests:
		draftables = yahooController.getYahooDraftablesByDraftGroupId(contest["id"])
		draftables["draftGroupId"] = contest["seriesId"]
		draftGroupsDraftables.append(draftables)
	
	mongoController.addDraftGroups(draftGroups)
	mongoController.addDraftables(draftGroupsDraftables)

	return jsonify({"draft_groups": len(draftGroups), "draftables": len(draftGroupsDraftables)}), 200

@upcoming_blueprint.route('/fanduel/test', methods=["POST"])
def fanduel_upcoming():
	res = requests.get('https://api.fanduel.com/fixture-lists/88351/players?content_sources=NUMBERFIRE,ROTOWIRE,ROTOGRINDERS')
	print(res)
	return jsonify({"message": "success" }), 200 