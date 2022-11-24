from flask import Blueprint, jsonify, request, send_file, Response
from api import app, db
import json
import uuid
import redis
from pandas import read_csv
import csv
from io import StringIO
import datetime

from ..routes import token_required
from ..models.user import User
from ..models.lineup import Lineup, LineupSchema
from ..date_services import parseDate
from ..controllers.MongoController import MongoController

lineups_blueprint = Blueprint('lineups_blueprint', __name__, url_prefix='/lineups')

redis_client = redis.Redis(host='localhost', port=6379, db=0)

MongoController = MongoController()


@lineups_blueprint.route('/', defaults={'id': None}, methods=['GET'])
@app.route('/lineups/<id>', methods=['GET'])
@token_required
def get_lineup(current_user: User, id: int):
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
	return jsonify(LineupSchema().dump(lineup))


@lineups_blueprint.route('/', methods=['POST'])
@token_required
def create_lineup(current_user: User):
	data = json.loads(request.data)
	try:
		year = int(data['year'])
		week = int(data['week'])
	except ValueError:
		return jsonify({ 'Error': 'Year and week must be integers.' }), 400
	if year not in range(2012, 2022):
		return jsonify({ 'Error': 'Not valid year' }), 400
	if week not in range(0, 18):
		return jsonify({ 'Error': 'Not valid week' }), 400
	new_lineup = Lineup(user_public_id=current_user.public_id, 
						week=week,
						year=year, 
						bet=data["bet"] if data["bet"] else 0, 
						winnings=data["winnings"] if data["winnings"] else 0)
	db.session.add(new_lineup)
	db.session.commit()

	return jsonify(LineupSchema().dump(new_lineup)), 200


@lineups_blueprint.route('/createLineup', methods=['POST'])
@token_required
def create_lineup_new(current_user: User):
	data = json.loads(request.data)
	data["user_public_id"] = current_user.public_id
	data["last_update"] = datetime.datetime.now()
	
	MongoController.updateLineup(data)

	return jsonify({ "message": "Success" }), 200


@lineups_blueprint.route('/createEmptyLineup', methods=['POST'])
@token_required
def create_emptpy_lineup(current_user: User):
	data = json.loads(request.data)
	data["user_public_id"] = current_user.public_id
	data["draft-group"] = str(data["draft-group"])
	data["lineup-id"] = str(uuid.uuid4()).replace("-", "").replace("%7D", "")
	data["last_update"] = datetime.datetime.now()
	data["lineup"] = {
		"qb": None,
		"wr1": None,
		"wr2": None,
		"wr3": None,
		"rb1": None,
		"rb2": None,
		"te": None,
		"flex": None,
		"dst": None
  	}

	MongoController.createLineup(data)

	return jsonify({ "lineupId": data["lineup-id"] }), 200


@lineups_blueprint.route('/<id>', methods=['PUT'])
@token_required
def edit_lineup(current_user: User, id: int):
	key = f'lineup_data_{id}'

	redis_client.delete(key)

	lineup = db.session.query(Lineup).filter(Lineup.id == id).first()
	if not lineup:
		return jsonify({ 'Error': 'No lineup with specified id.' })
	
	data = json.loads(request.data)
	del data["percentile"]
	lineup.update(data)
	db.session.commit()

	return jsonify({ 'updated_lineup': LineupSchema().dump(lineup) })


@lineups_blueprint.route('/<id>', methods=['DELETE'])
def delete_lineup(id: int):
	lineup = db.session.query(Lineup).filter(Lineup.id == id).first()
	if not lineup:
		return jsonify({ 'Error': 'No lineup found with specified id.' })
	
	db.session.delete(lineup)
	db.session.commit()
	return jsonify({ 'Message': 'Lineup successfully deleted!' })


# TODO check if it is a bestball lineup, maybe allow filtering or dont show it
@lineups_blueprint.route('/upload', methods=['POST'])
@token_required
def upload_file(current_user: User):
	file = request.files["myFile"]
	if not file.filename:
		return jsonify({ 'Error': 'Missing file!' }), 400

	csv_file = read_csv(file, header=0, index_col=False, 
		usecols = ['Entry Id', 'Sport', 'Date', 'Title', 'SalaryCap', 
			'Score', 'Position', 'Entries', 'Entry ($)', 'Winnings ($)'])

	already_exists = 0
	for index, row in csv_file.iterrows():
		if row['Sport'] == 'nfl' and row['Score'] == row['Score']:
			lineup_exists = db.session.query(Lineup).filter(Lineup.user_public_id == current_user.public_id,
															Lineup.entry_id == row['Entry Id']).first()
			if not lineup_exists:
				parsed_week = parseDate(row['Date'])
				if parsed_week == -1:
					continue
				new_lineup = Lineup()
				year = int(row['Date'].split("/")[0])
				new_lineup.year = year if year > 8 else year - 1
				new_lineup.week = parsed_week
				new_lineup.points = float(row['Score'])
				new_lineup.bet = float(row['Entry ($)'])
				new_lineup.winnings = float(row['Winnings ($)'])
				new_lineup.user_public_id = current_user.public_id
				new_lineup.entry_id = row['Entry Id']
				new_lineup.tournament_name = row['Title']
				new_lineup.site = 'Fanduel'
				new_lineup.imported = True
				new_lineup.position = row['Position']
				new_lineup.entries = row['Entries']
				db.session.add(new_lineup)
				db.session.commit()
			else:
				already_exists += 1

	return jsonify(already_exists), 200


@lineups_blueprint.route('/export', methods=['POST'])
@token_required
def export_lineups(current_user: User):
	data = json.loads(request.data)
	
	file = StringIO()
	writer = csv.writer(file)
	writer.writerow(["QB", "RB", "RB", "WR", "WR", "WR", "TE", "FLEX", "DST"])
	for entry in data:
		lineup = entry["lineup"]
		writer.writerow([lineup["qb"]["draftableId"] if lineup.get("qb") else None,
			lineup["rb1"]["draftableId"] if lineup.get("rb1") else None,
			lineup["rb2"]["draftableId"] if lineup.get("rb2") else None,
			lineup["wr1"]["draftableId"] if lineup.get("wr1") else None,
			lineup["wr2"]["draftableId"] if lineup.get("wr2") else None,
			lineup["wr3"]["draftableId"] if lineup.get("wr3") else None,
			lineup["te"]["draftableId"] if lineup.get("te") else None,
			lineup["flex"]["draftableId"] if lineup.get("flex") else None,
			lineup["dst"]["draftableId"] if lineup.get("dst") else None,
		])
		
	return Response(
		file.getvalue(),
		mimetype="text/csv",
		headers={"Content-disposition": "attachment; filename=myplot.csv"})
