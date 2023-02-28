from functools import wraps
from flask import request, jsonify
import jwt

from api import app
from ..controllers.MongoController import MongoController

mongoController = MongoController()

def token_required(f):
	"""
		Decorator for handling required json web tokens.
	"""
	@wraps(f)
	def decorated(*args, **kwargs):
		token = None
		if 'x-access-token' in request.headers:
			token = request.headers['x-access-token'].replace('"', '')
			print(token)
		if not token or token == "undefined":
			print('no token')
			return f(None, *args, **kwargs)
		try:
			data = jwt.decode(token, app.config['SECRET_KEY'], algorithms='HS256')
			current_user = mongoController.getUserByPublicId(data["public_id"])
		except:
			print('token invalid')
			return jsonify({ 'Error': 'Token is invalid.' }), 401
		return f(current_user, *args, **kwargs)
	return decorated


stat_col_conversions = {
	"PASS ATT": ["passing_completions", "passing_attempts"],
	"PASS YDS": "passing_yards",
	"PASS TD": "passing_touchdowns", 
	"RUSH YDS": "rushing_yards",
	"REC": "receptions",
	"REC YDS": "recieving_yards",
	"RUSH TD": "rushing_touchdowns",
	"REC TDS": "recieving_touchdowns",
	"2PT": "passing_2point_conversions",
	"REC 2PT": "recieving_2point_conversions",
	"RUSH 2PT": "rushing_2point_conversions",
	"FUM": "fumbles_lost",
	"INT": "passing_interceptions", 
}

def generate_stats_display(stats):
	result = []
	for key, value in stat_col_conversions.items():
		if len(value) == 2:
			if stats[value[1]] > 0:
				result.append({
					"key": key,
					"value": f'{stats[value[0]]}/{stats[value[1]]}'
				})
		elif stats[value] and stats[value] > 0:
			result.append({
				"key": key,
				"value": stats[value]
			})
	
	return result