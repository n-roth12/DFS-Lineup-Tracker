from flask import Blueprint, jsonify, request
from api import app, bcrypt
from flask_cors import cross_origin
import json
import jwt
import uuid
from bson import json_util

from .utilities import token_required
from ..controllers.MongoController import MongoController

users_blueprint = Blueprint('users_blueprint', __name__, url_prefix='/users')
mongoController = MongoController()

@cross_origin()
@users_blueprint.route('/register', methods=['POST'])
def register_user():
	data = json.loads(request.data)

	user = mongoController.getUserByUsername(data["username"])
	if user:
		return jsonify({ 'Error': 'Username is already in use.' }), 409

	public_id = str(uuid.uuid4())
	password_hash = bcrypt.generate_password_hash(data["password"]).decode('utf-8')
	mongoController.createUser({
		"public_id": public_id,
		"username": data["username"],
		"password_hash": password_hash
	})
	token = jwt.encode({ 'public_id': public_id }, app.config['SECRET_KEY'], algorithm='HS256')

	return jsonify({ 'token': token }), 200

@cross_origin()
@users_blueprint.route('/login', methods=['POST'])
def login_user():
	data = json.loads(request.data)

	attempted_user = mongoController.getUserByUsername(data["username"])
	if attempted_user:
		if bcrypt.check_password_hash(attempted_user["password_hash"], data["password"]):
			print(attempted_user["username"])
			token = jwt.encode({ 'public_id': attempted_user["public_id"] }, app.config['SECRET_KEY'], algorithm='HS256')
			return jsonify({ "token": token }), 200

		return jsonify({"Error": "Incorrect password"}), 403

	return jsonify({"Error": "User not found"}), 404

@cross_origin(allow_headers="x-access-token")
@users_blueprint.route('/lineups', methods=['GET'])
@token_required
def get_user_lineups(current_user):
	lineups = mongoController.get_user_lineups(current_user["public_id"])

	return jsonify(json.loads(json_util.dumps(lineups))), 200

@cross_origin()
@users_blueprint.route('/lineups/draftGroup', methods=['GET'])
@token_required
def get_draftgroup_lineups(current_user):
	draftGroupId = request.args.get("draftGroup")
	lineups = mongoController.getUserLineupsByDraftGroup(draftGroupId, current_user["public_id"])

	return jsonify(json.loads(json_util.dumps(lineups))), 200

@cross_origin()
@users_blueprint.route('/feedback', methods=["POST"])
def submit_feedback():
	data = json.loads(request.data)

	return jsonify({ "feedback": data["feedback"] }), 200