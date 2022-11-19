from flask import jsonify, Blueprint, request
from api import app
from pymongo import MongoClient
import certifi
import json
from bson import json_util
import redis
import requests

from ..routes import token_required
from ..models.user import User
from ..ownership_service import OwnershipService
from ..controllers.MongoController import MongoController

redis_client = redis.Redis(host='localhost', port=6379, db=0)
MongoController = MongoController()
OwnershipService = OwnershipService()

upcoming_blueprint = Blueprint('upcoming_blueprint', __name__, url_prefix='/upcoming')

@upcoming_blueprint.route('/slates_new', methods=["GET"])
@token_required
def upcoming_slates(current_user: User):
	client = MongoClient(f'{app.config["MONGODB_URI"]}', tlsCAFile=certifi.where())
	db = client["DFSDatabase"]
	collection = db["draftGroups"]
	cursor = collection.find({})
	slates = sorted([group["draftGroup"] for group in cursor], key=lambda x: len(x["games"]), reverse=True)

	return jsonify(slates), 200


@upcoming_blueprint.route('/draftGroup', methods=["GET"])
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


@upcoming_blueprint.route('/games', methods=['GET'])
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


@upcoming_blueprint.route('/players', methods=['GET'])
@token_required
def upcoming_players(current_user: User):
	args = request.args
	draft_group_id = args["draftGroup"]
	
	client = MongoClient(f'{app.config["MONGODB_URI"]}', tlsCAFile=certifi.where())
	db = client["DFSDatabase"]
	collection = db["draftables"]
	result = collection.find_one({ "draft_group_id": int(draft_group_id) })

	return jsonify(result["draftables"]), 200


@upcoming_blueprint.route('/ownership', methods=["GET"])
@token_required
def upcoming_projections(current_user: User):
	projections = OwnershipService.getOwnershipProjections()

	return jsonify(projections), 200


@upcoming_blueprint.route('/slates', methods=['GET'])
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


@upcoming_blueprint.route('/ownership', methods=["POST"])
def set_projections():

	print("Scraping ownership projections...")
	projections = OwnershipService.scrape_ownership()
	print("Finished scraping ownership projections.")

	MongoController.addProjections(projections)

	return jsonify(projections), 200