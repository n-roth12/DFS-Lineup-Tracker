from api import app, db, ma
from flask import Flask, request, jsonify
import json
import requests
from flask_cors import cross_origin
from api.models.player import Player, PlayerSchema
from api.models.lineup import Lineup, LineupSchema, FullLineupSchema
# from api.models.statline import StatLine, StatLineSchema


@app.route('/test', methods=['GET'])
def get_test():
	return jsonify({ 'Message': 'Test GET succeeded!' })


@app.route('/players', defaults={'id': None}, methods=['GET'])
@app.route('/players/<id>', methods=['GET'])
def get_players(id):
	if id:
		player = db.session.query(Player).filter(Player.id == id).first()
		if not player:
			return jsonify({ 'Error': 'No player with specified id.' })
		return jsonify(PlayerSchema().dump(player)), 200
	
	players = db.session.query(Player).all()
	if not len(players):
		return jsonify({ 'Error': 'No players in database!' })

	schema = PlayerSchema(many=True)
	return jsonify({ 'players': schema.dump(players) }), 200
	

@app.route('/players', methods=['POST'])
def add_player():
	data = json.loads(request.data)
	if not data:
		return jsonify({ 'Error': 'Request body does not contain necessary data.' })

	new_player = Player(name=data['name'], position=data['position'], team=data['team'])
	db.session.add(new_player)
	db.session.commit()

	return jsonify({ 'Message': 'New player successfully addded!' })


@app.route('/players/<id>', methods=['DELETE'])
def delete_player(id):
	player = db.session.query(Player).filter(Player.id == id).first()
	if not player:
		return jsonify({ 'Error': 'No player found with specified id.' })
	
	db.session.delete(player)
	db.session.commit()

	return jsonify({ 'Message': 'Player successfully deleted!' })


@app.route('/players/<id>', methods=['PUT'])
def edit_player(id):
	player = db.session.query(Player).filter(Player.id == id).first()
	if not player:
		return jsonify({ 'Error': 'No player with specified id.' })
	
	data = request.get_json()
	if data["name"]:
		player.name = data["name"]
	if data["position"]:
		player.position = data["position"]
	if data["team"]:
		player.team = data["team"]
	db.session.commit()

	return jsonify({ 'Message': 'Player information successfully updated!' })


@app.route('/lineups', defaults={'id': None}, methods=['GET'])
@app.route('/lineups/<id>', methods=['GET'])
def get_lineup(id):
	if not id:
		lineups = db.session.query(Lineup).all()
		if not len(lineups):
			return jsonify({ 'Error': 'No lineups in database!' })

		schema = LineupSchema(many=True)
		return jsonify({ 'lineups': schema.dump(lineups) })

	lineup = db.session.query(Lineup).filter(Lineup.id == id).first()
	if not lineup:
		return jsonify({ 'Error': 'No lineup with specified id.' })

	l = LineupSchema().dump(lineup)
	response = {}
	for key, value in l.items():
		if value != None:
			data = requests.get(f'https://ffbapi.herokuapp.com/api/v1/stats/{value}')
			response[key] = data

	# response = {}
	# response["id"] = l["id"]
	# response["week"] = l["week"]
	# response["year"] = l["year"]
	# for key, value in l.items():
	# 	if key != "id" and key != "week" and key != "year":
	# 		if value is None:
	# 			response[key] = None
	# 		else:
	# 			p = db.session.query(Player).filter(Player.id == value).first()
	# 			response[key] = PlayerSchema().dump(p)

	return jsonify(LineupSchema().dump(lineup))


@app.route('/lineups', methods=['POST'])
def create_lineup():
	data = json.loads(request.data)
	new_lineup = Lineup(user_id=data["user_id"], week=data["week"], 
		year=data["year"], bet=data["bet"], winnings=data["winnings"])
	db.session.add(new_lineup)
	db.session.commit()

	return jsonify(LineupSchema().dump(new_lineup))

#### TODO make the put request return the lineup so i dont have to do an additional get request


@app.route('/lineups/<id>', methods=['PUT'])
def edit_lineup(id):
	lineup = db.session.query(Lineup).filter(Lineup.id == id).first()
	if not lineup:
		return jsonify({ 'Error': 'No lineup with specified id.' })
	
	data = json.loads(request.data)
	lineup.update(data)
	db.session.commit()

	return jsonify({ 'updated_lineup': LineupSchema().dump(lineup) })


@app.route('/lineups/<id>', methods=['DELETE'])
def delete_lineup(id):
	lineup = db.session.query(Lineup).filter(Lineup.id == id).first()
	if not lineup:
		return jsonify({ 'Error': 'No lineup found with specified id.' })
	
	db.session.delete(lineup)
	db.session.commit()
	return jsonify({ 'Message': 'Lineup successfully deleted!' })


@app.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
	user_lineups = db.session.query(Lineup) \
		.filter(Lineup.user_id == user_id) \
		.order_by(Lineup.year.desc(), Lineup.week.desc()).all()

	if not len(user_lineups):
		return jsonify({ 'Error': 'No lineups for specified user.' })

	whole_response = []
	for user_lineup in user_lineups:
		l = LineupSchema().dump(user_lineup)
		response = {}
		response["id"] = l["id"]
		response["week"] = l["week"]
		response["year"] = l["year"]
		response["points"] = l["points"]
		response["bet"] = l["bet"]
		response["winnings"] = l["winnings"]

		for key, value in l.items():
			if key != "id" and key != "week" and key != "year" and key != "points" and key != "bet" and key != "winnings":
				if value is None:
					response[key] = None
				else:
					p = db.session.query(Player).filter(Player.id == value).first()
					response[key] = PlayerSchema().dump(p)
		whole_response.append(response)
	return jsonify(whole_response)





