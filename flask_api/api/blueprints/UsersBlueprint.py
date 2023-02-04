from flask import Blueprint, jsonify, request
from api import app, bcrypt
import json
import jwt
import uuid
from bson import json_util

from ..models.user import User
from ..routes import token_required
from ..controllers.MongoController import MongoController

users_blueprint = Blueprint('users_blueprint', __name__, url_prefix='/users')
mongoController = MongoController()

@users_blueprint.route('/register', methods=['POST'])
def register_user():
	data = json.loads(request.data)

	user = mongoController.getUserByUsername(data["username"])
	if user:
		return jsonify({ 'Error': 'Username is already in use.' }), 409

	user_to_create = User(public_id=str(uuid.uuid4()), username=data['username'], password=data['password'])
	mongoController.createUser({
		"public_id": user_to_create.public_id,
		"username": user_to_create.username,
		"password_hash": user_to_create.password_hash
	})
	token = jwt.encode({ 'public_id': user_to_create.public_id }, app.config['SECRET_KEY'], algorithm='HS256')

	return jsonify({ 'token': token }), 200


@users_blueprint.route('/login', methods=['POST'])
def login_user():
	data = json.loads(request.data)

	attempted_user = mongoController.getUserByUsername(data["username"])
	return jsonify({ "user": attempted_user["username"] }), 200

	# if attempted_user:
	# 	if bcrypt.check_password_hash(attempted_user["password_hash"], data["password"]):
	# 		token = jwt.encode({ 'public_id': attempted_user["public_id"] }, app.config['SECRET_KEY'], algorithm='HS256')
	# 		print(token)
	# 		return jsonify({ 'token': token })
	# else:
	# 	return jsonify({ 'Error': 'Unable to login.' }), 403


@users_blueprint.route('/lineups', methods=['GET'])
@token_required
def get_user_lineups(current_user: User):
	lineups = mongoController.get_user_lineups(current_user.public_id)

	return jsonify(json.loads(json_util.dumps(lineups))), 200


@users_blueprint.route('/lineups/draftGroup', methods=['GET'])
@token_required
def get_draftgroup_lineups(current_user: User):
	draftGroupId = request.args.get("draftGroup")
	lineups = mongoController.getUserLineupsByDraftGroup(draftGroupId, current_user.public_id)

	return jsonify(json.loads(json_util.dumps(lineups))), 200