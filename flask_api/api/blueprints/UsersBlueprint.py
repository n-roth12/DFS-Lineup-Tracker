from flask import Blueprint, jsonify, request
from api import db, app
import json
import jwt
import uuid

from ..models.user import User
from ..models.lineup import Lineup
from ..routes import token_required


users_blueprint = Blueprint('users_blueprint', __name__, url_prefix='/users')

@users_blueprint.route('/register', methods=['POST'])
def register_user():
	data = json.loads(request.data)

	user_exists = db.session.query(User.id).filter(User.username == data['username']).first()
	# users_table = dynamodb.Table("Users")
	# username = data['username']
	# # user_exists = users_table.get_item(Key={':username': data['username']})
	# user_exists = users_table.get_item(Key={'username': username})
	if user_exists:
		return jsonify({ 'Error': 'Username is already in use.' }), 409

	user_to_create = User(public_id=str(uuid.uuid4()), username=data['username'], password=data['password'])
	db.session.add(user_to_create)
	db.session.commit()
	token = jwt.encode({ 'public_id': user_to_create.public_id }, app.config['SECRET_KEY'], algorithm='HS256')
	# hashed_password = bcrypt.generate_password_hash(data["password"]).decode('utf-8')
	# users_table.put_item(Item={ "username": data["username"], "hashed_password": hashed_password })
	# token = jwt.encode({ "username": data["username"] }, app.config['SECRET_KEY'], algorithm="HS256")

	return jsonify({ 'token': token }), 200


@users_blueprint.route('/login', methods=['POST'])
def login_user():
	data = json.loads(request.data)

	attempted_user = db.session.query(User).filter(User.username == data['username']).first()

	if attempted_user and attempted_user.check_password_correction(attempted_password=data['password']):
		token = jwt.encode({ 'public_id': attempted_user.public_id }, app.config['SECRET_KEY'], algorithm='HS256')
		return jsonify({ 'token': token })
	else:
		return jsonify({ 'Error': 'Unable to login.' }), 403


@users_blueprint.route('/', methods=['GET'])
@token_required
def get_user(current_user: User):
	user_lineups = db.session.query(Lineup) \
					.filter(Lineup.user_public_id == current_user.public_id) \
					.order_by(Lineup.year.desc(), Lineup.week.desc()).all()

	whole_response = []
	for user_lineup in user_lineups:
		response = {}
		response["id"] = user_lineup.id
		response["week"] = user_lineup.week
		response["year"] = user_lineup.year
		response["points"] =user_lineup.points
		response["bet"] = user_lineup.bet
		response["winnings"] = user_lineup.winnings
		response["position"] = user_lineup.position
		response["entries"] = user_lineup.entries
		response["percentile"] = user_lineup.percentile

		whole_response.append(response)

	return jsonify(whole_response), 200