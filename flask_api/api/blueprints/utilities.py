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
