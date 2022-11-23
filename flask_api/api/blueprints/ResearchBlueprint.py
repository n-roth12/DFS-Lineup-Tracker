from flask import jsonify, Blueprint
from api import app, db
import redis
import requests
from sqlalchemy import func

from ..routes import token_required
from ..models.user import User
from ..models.lineup import Lineup, LineupSchema

research_blueprint = Blueprint('research_blueprint', __name__, url_prefix='/research')


@research_blueprint.route('/lineups/count', methods=['GET'])
@token_required
def get_lineup_count(current_user: User):
	lineups_count = db.session.query(Lineup) \
				.filter(Lineup.user_public_id == current_user.public_id) \
				.count()
	return jsonify({ 'count': lineups_count }), 200


@research_blueprint.route('/lineups/max', methods=['GET'])
@token_required
def get_lineup_max(current_user: User):
	max_score = db.session.query(func.max(Lineup.points)) \
		.filter(Lineup.user_public_id == current_user.public_id) \
		.scalar()
	if not max_score:
		return jsonify({ 'Error': 'No lineup max.' }), 400
	max_lineup = db.session.query(Lineup) \
		.filter(Lineup.points == max_score,
			Lineup.user_public_id == current_user.public_id) \
		.first()
	return jsonify({ 'max': LineupSchema().dump(max_lineup) }), 200


@research_blueprint.route('/lineups/highest', methods=['GET'])
@token_required
def get_highest_lineup(current_user: User):
	max_winnings = db.session.query(func.max(Lineup.winnings - Lineup.bet)) \
		.filter(Lineup.user_public_id == current_user.public_id) \
		.scalar()
	if max_winnings:
		return jsonify({ 'highest': max_winnings }), 200
	else:
		return jsonify({ 'Error': 'No lineup max.' }), 400


@research_blueprint.route('/lineups/percentile', methods=['GET'])
@token_required
def get_highest_percentile(current_user: User):
	highest_percentile = db.session.query(Lineup) \
		.filter(Lineup.user_public_id == current_user.public_id) \
		.all()
	print([p.percentile for p in highest_percentile])
	if not highest_percentile:
		return jsonify({ 'Error': 'No percentile max.' }), 400
	return 'Success', 200


@research_blueprint.route('/players/temp', methods=['GET'])
@token_required
def get_temp(current_user: User):
	players = requests.get(f'{app.config["FFB_API_URL"]}/api/players?limit=10').json()
	print(players)
	return jsonify(players), 200

