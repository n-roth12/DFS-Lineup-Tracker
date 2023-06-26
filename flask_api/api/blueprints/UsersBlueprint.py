from flask import Blueprint, jsonify, request
from api import app, bcrypt
import json
import jwt
import uuid
from datetime import datetime, timezone, timedelta
from bson import json_util

from .utilities import token_required
from ..controllers.MongoController import MongoController

users_blueprint = Blueprint('users_blueprint', __name__, url_prefix='/users')
mongoController = MongoController()

@users_blueprint.route('/refresh', methods=['POST'])
def handle_refresh_token():
	if not 'refresh_token' in request.cookies:
		return "", 401
	refresh_token = request.cookies.get('refresh_token')
	try:
		public_id = jwt.decode(refresh_token, app.config['SECRET_KEY'], algorithms='HS256')
		attempted_user = mongoController.getUserByPublicId(public_id.get('public_id'))
		access_token = jwt.encode(
			{ 'public_id': attempted_user["public_id"] , 
				"exp": datetime.now(tz=timezone.utc) + timedelta(seconds=20) }, 
				app.config['SECRET_KEY'], 
				algorithm='HS256'
			)
		mongoController.update_refresh_token(attempted_user["username"], refresh_token)
		res = jsonify({ "token": access_token })
		res.set_cookie("refresh_token", refresh_token, secure=False) # set to True for prod
		return res

	except Exception:
		return jsonify({ 'Error': 'Invalid refresh token' }), 403

@users_blueprint.route('/logout', methods=['POST'])
def logout_user():
	if not 'refresh_token' in request.cookies:
		return "", 401
	refresh_token = request.cookies.get('refresh_token')
	try:
		public_id = jwt.decode(refresh_token, app.config['SECRET_KEY'], algorithms='HS256')
		attempted_user = mongoController.getUserByPublicId(public_id.get('public_id'))
		mongoController.update_refresh_token(attempted_user["username"], '')
		res = jsonify()
		res.delete_cookie("refresh_token")
		return res

	except Exception:
		return jsonify({ 'Error': 'Invalid refresh token' }), 403

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

@users_blueprint.route('/login', methods=['POST'])
def login_user():
	data = json.loads(request.data)

	attempted_user = mongoController.getUserByUsername(data["username"])
	if attempted_user:
		if bcrypt.check_password_hash(attempted_user["password_hash"], data["password"]):
			refresh_token = jwt.encode(
				{ 'public_id': attempted_user["public_id"] , 
					"exp": datetime.now(tz=timezone.utc) + timedelta(seconds=60) }, 
				app.config['SECRET_KEY'], 
				algorithm='HS256'
			)
			access_token = jwt.encode(
				{ 'public_id': attempted_user["public_id"] , 
					"exp": datetime.now(tz=timezone.utc) + timedelta(seconds=20) }, 
				app.config['SECRET_KEY'], 
				algorithm='HS256'
			)

			mongoController.update_refresh_token(attempted_user["username"], refresh_token)
			res = jsonify({ "token": access_token })
			res.set_cookie("refresh_token", refresh_token, secure=False) # set to True for prod
			return res

		return jsonify({"Error": "Incorrect password"}), 403

	return jsonify({"Error": "User not found"}), 400

@users_blueprint.route('/lineups', methods=['GET'])
@token_required
def get_user_lineups(current_user):
	lineups = mongoController.get_user_lineups(current_user["public_id"])

	return jsonify(json.loads(json_util.dumps(lineups))), 200

@users_blueprint.route('/lineups/draftGroup', methods=['GET'])
@token_required
def get_draftgroup_lineups(current_user):
	draftGroupId = request.args.get("draftGroup")
	lineups = mongoController.getUserLineupsByDraftGroup(draftGroupId, current_user["public_id"])

	return jsonify(json.loads(json_util.dumps(lineups))), 200

@users_blueprint.route('/feedback', methods=["POST"])
def submit_feedback():
	data = json.loads(request.data)

	return jsonify({ "feedback": data["feedback"] }), 200