from flask import jsonify, Blueprint
from api import app
import requests
from sqlalchemy import func
from .utilities import token_required

research_blueprint = Blueprint('research_blueprint', __name__, url_prefix='/research')

@research_blueprint.route('/players/temp', methods=['GET'])
@token_required
def get_temp(current_user):
	players = requests.get(f'{app.config["FFB_API_URL"]}/api/players?limit=10').json()
	print(players)
	return jsonify(players), 200

