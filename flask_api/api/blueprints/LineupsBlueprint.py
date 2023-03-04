from flask import Blueprint, jsonify, request, send_file, Response
import json
import uuid
import redis
from pandas import read_csv
import csv
from io import StringIO
import datetime
from bson import json_util
import random

from .utilities import token_required
from ..date_services import parseDate
from ..controllers.MongoController import MongoController
from ..controllers.LineupOptimizerController import LineupOptimizerController
from ..controllers.LineupOptimizerControllerModule import allowed_positions
from ..controllers.LineupOptimizerControllerModule.Lineup import Lineup
from ..controllers.LineupOptimizerControllerModule.LineupOptimizer import LineupOptimizer

lineups_blueprint = Blueprint('lineups_blueprint', __name__, url_prefix='/lineups')
redis_client = redis.Redis(host='localhost', port=6379, db=0)
MongoController = MongoController()
LineupOptimizerController = LineupOptimizerController()

@lineups_blueprint.route('/favorite', methods=['POST'])
@token_required
def add_to_favorites(current_user):
	data = json.loads(request.data)
	MongoController.add_player_to_lineup_favorites(lineupId=data["lineupId"], player=data["player"], userId=current_user["public_id"])

	return jsonify({ "Message": "Success" }), 200

@lineups_blueprint.route('/hidden', methods=['POST'])
@token_required
def add_to_hidden(current_user):
	data = json.loads(request.data)
	MongoController.add_player_to_lineup_hidden(lineupId=data["lineupId"], player=data["player"], userId=current_user["public_id"])

	return jsonify({ "Message": "Success" }), 200

@lineups_blueprint.route('/updateLineup', methods=['POST'])
@token_required
def create_lineup_new(current_user):
	data = json.loads(request.data)
	data["userPublicId"] = current_user["public_id"]
	data["lastUpdate"] = datetime.datetime.now()
	
	MongoController.updateLineup(data)

	return jsonify({ "message": "Success" }), 200


@lineups_blueprint.route('/createEmptyLineup', methods=['POST'])
@token_required
def create_emptpy_lineup(current_user):
	data = json.loads(request.data)

	# user is not logged in, so we will not save their lineup to the database
	if not current_user:
		return jsonify({ "lineupId": None }), 200
	
	data["userPublicId"] = current_user["public_id"]
	data["lineupId"] = str(uuid.uuid4()).replace("-", "").replace("%7D", "")
	data["lastUpdate"] = datetime.datetime.now()
	data["draftGroupId"] = str(data["draftGroupId"])
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

	return jsonify({ "lineupId": data["lineupId"] }), 200


@lineups_blueprint.route('/delete', methods=['POST'])
@token_required
def delete_lineups(current_user):
	lineup_ids = json.loads(request.data)["lineups"]
	MongoController.batchDeleteLineups(current_user["public_id"], lineup_ids)

	return jsonify(lineup_ids), 200

@lineups_blueprint.route('/addTag', methods=["POST"])
@token_required
def add_tag_to_lineup(current_user):
	body = json.loads(request.data)
	lineup_id = body["lineupId"]
	tag = body["tag"]

	MongoController.add_tag_to_lineup(user_id=current_user["public_id"], lineup_id=lineup_id, tag=tag)

	return jsonify({ "Message": "Succes" }), 200

@lineups_blueprint.route('/setTags', methods=["POST"])
@token_required
def set_lineup_tags(current_user):
	body = json.loads(request.data)
	lineup_id = body.get("lineupId")
	tags = body.get("tags")
	print(tags)

	MongoController.set_lineup_tags(user_id=current_user["public_id"], lineup_id=lineup_id, tags=tags)

	return jsonify({ "Message": "Success" }), 200

@lineups_blueprint.route('/recommendedTags', methods=["GET"])
@token_required
def get_recommended_tags(current_user):

	temp = [
		{
			"category": "Punt",
			"value": "TE"
		},
		{
			"category": "Punt",
			"value": "DEF"
		},
		{
			"category": "Punt",
			"value": None
		},
		{
			"category": "Contest",
			"value": "GPP"
		},
		{
			"category": "Contest",
			"value": "H2H"
		},
		{
			"category": "Contest",
			"value": "Cash"
		},
		{
			"category": "Entries",
			"value": 150
		},
		{
			"category": "Max Entries",
			"value": 1
		},
		{
			"category": "Stack",
			"value": None
		},
		{
			"category": "Stack",
			"value": "Skinny Stack"
		},
		{
			"category": "Stack",
			"value": "3x1"
		},
		{
			"category": "Stack",
			"value": "3x2"
		},
		{
			"category": "Stack",
			"value": "4x1"
		},
		{
			"category": "Stack",
			"value": "4x2"
		},
		{
			"category": "Stack",
			"value": "2x2"
		},
		{
			"category": "Stack",
			"value": "Onslaught"
		},
		{
			"category": "Build",
			"value": "Balanced"
		}
	]

	return jsonify(temp), 200


# # TODO check if it is a bestball lineup, maybe allow filtering or dont show it
# @lineups_blueprint.route('/upload', methods=['POST'])
# @token_required
# def upload_file(current_user: User):
# 	file = request.files["myFile"]
# 	if not file.filename:
# 		return jsonify({ 'Error': 'Missing file!' }), 400

# 	csv_file = read_csv(file, header=0, index_col=False, 
# 		usecols = ['Entry Id', 'Sport', 'Date', 'Title', 'SalaryCap', 
# 			'Score', 'Position', 'Entries', 'Entry ($)', 'Winnings ($)'])

# 	already_exists = 0
# 	for index, row in csv_file.iterrows():
# 		if row['Sport'] == 'nfl' and row['Score'] == row['Score']:
# 			lineup_exists = db.session.query(Lineup).filter(Lineup.user_public_id == current_user.public_id,
# 															Lineup.entry_id == row['Entry Id']).first()
# 			if not lineup_exists:
# 				parsed_week = parseDate(row['Date'])
# 				if parsed_week == -1:
# 					continue
# 				new_lineup = Lineup()
# 				year = int(row['Date'].split("/")[0])
# 				new_lineup.year = year if year > 8 else year - 1
# 				new_lineup.week = parsed_week
# 				new_lineup.points = float(row['Score'])
# 				new_lineup.bet = float(row['Entry ($)'])
# 				new_lineup.winnings = float(row['Winnings ($)'])
# 				new_lineup.user_public_id = current_user.public_id
# 				new_lineup.entry_id = row['Entry Id']
# 				new_lineup.tournament_name = row['Title']
# 				new_lineup.site = 'Fanduel'
# 				new_lineup.imported = True
# 				new_lineup.position = row['Position']
# 				new_lineup.entries = row['Entries']
# 				db.session.add(new_lineup)
# 				db.session.commit()
# 			else:
# 				already_exists += 1

# 	return jsonify(already_exists), 200


@lineups_blueprint.route('/export', methods=['POST'])
@token_required
def export_lineups(current_user):
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


@lineups_blueprint.route('/lineup', methods=['GET'])
@token_required
def get_singe_lineup(current_user):
	lineupId = request.args.get("lineupId")
	lineup = MongoController.getLineupById(lineupId, current_user["public_id"])

	return jsonify(json.loads(json_util.dumps(lineup))), 200


@lineups_blueprint.route('/generate', methods=['POST'])
@token_required
def generate_lineup(current_user):
	data = json.loads(request.data)
	draftGroupId = data.get("draftGroupId")
	gameStack = data.get("gameStack")
	teamStack = data.get("teamStack")
	gameStackPlayerCount = data.get("gameStackPlayerCount")
	existing_lineup = data.get("existingLineup") if data.get("existingLineup") else []
	replace_entire_lineup = data.get("replaceEntireLineup")
	chosen_flex_positions = data.get("eligibleFlexPositions")

	if replace_entire_lineup == "full":
		existing_lineup = []

	draftables = MongoController.getDraftablesByDraftGroupId(draftGroupId)

	eligible_flex_positions = []
	for flex_position in chosen_flex_positions:
		if flex_position not in ["RB", "WR", "TE"]:
			return jsonify({ "Error": "Invalid flex position choice." }), 400
		eligible_flex_positions.append(flex_position)
	if len(eligible_flex_positions) < 1:
		return jsonify({ "Error": "Invalid flex position choice." }), 400

	lineup_positions = ["QB", "RB1", "RB2", "WR1", "WR2", "WR3", "TE", "FLEX", "DST"]
	salaryCap = 600000

	result = LineupOptimizerController.generate_optimized_lineup(existing_lineup, lineup_positions, eligible_flex_positions, 
        salaryCap, draftables)

	return jsonify({ "lineup": result }), 200
 
@lineups_blueprint.route('/generate_test', methods=["POST"])
def generate_lineup_test():
	data = json.loads(request.data)
	draftGroupId = data.get("draftGroupId")
	if not draftGroupId:
		return jsonify({ "Error": "Missing Required Paramerter: DraftGroupId" }), 400
	try:
		draftGroupId = int(draftGroupId)
	except ValueError as e:
		return jsonify({ "Error": "Invalid Value for DraftGroupId" }), 400
		
	stackTeams = data.get("stackTeams")
	stackPlayerCount = data.get("gameStackPlayerCount")
	puntPositions = data.get("puntPositions")
	site = "draftkings"

	existing_lineup_data = data.get("existingLineup")
	if existing_lineup_data:
		existing_lineup = {lineup_slot : existing_lineup_data.get(lineup_slot) if existing_lineup_data.get(lineup_slot) \
			else {} for lineup_slot in allowed_positions.lineup_slots.get(site)}

	replace_entire_lineup = data.get("replaceEntireLineup")
	if replace_entire_lineup and replace_entire_lineup == True:
		replace_entire_lineup = False
		existing_lineup = {lineup_slot : {} for lineup_slot in allowed_positions.lineup_slots.get(site)}

	excluded_flex_positions = data.get("excludedFlexPositions")

	draftables = MongoController.getDraftablesByDraftGroupId(draftGroupId).get("draftables")
	lineup_slots = allowed_positions.lineup_slots.get(site)
	salary_cap = allowed_positions.salary_caps.get(site)

	lineup = Lineup(lineup=existing_lineup, site=site)
	optimizer = LineupOptimizer(draftables=draftables, lineup_positions=lineup_slots, \
		stack_number_of_players=stackPlayerCount, stack_teams=stackTeams, punt_positions=puntPositions, \
		excluded_flex_positions=excluded_flex_positions, salary_cap=salary_cap, site=site)

	generated_lineup = optimizer.generate_optimized_lineup(lineup)
	return jsonify(generated_lineup.lineup), 200


# converts from the format:
# ["QB", "RB", "RB", "WR", "WR", "WR", "TE", "FLEX", "DST"]
# to =>
# ["QB", "RB1", "RB2", "WR1", "WR2", "WR3", "TE", "FLEX", "DST"]
# this should be an interview question
# would be quicker to write and easier to understand with a hash map,
# but not as efficient
def convert_lineup_positions(positions_list):
	result = []
	if len(positions_list) < 1:
		return result

	prev = positions_list.pop(0)
	prev_count = 0
	for i in range(len(positions_list)):
		temp = positions_list.pop(0)
		if temp != prev:
			result.append(prev + (str(prev_count + 1) if prev_count > 0  else ""))
			prev_count = 0
		else:
			prev_count += 1
			result.append(prev + str(prev_count))
		prev = temp

	result.append(prev + (str(prev_count + 1) if prev_count > 0 else ""))
	
	return result


