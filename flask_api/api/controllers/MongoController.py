from pymongo import MongoClient
import certifi
import json
from bson import json_util
import datetime

from api import app

class MongoController:

    def __init__(self) -> None:
        self.client = MongoClient(f'{app.config["MONGODB_URI"]}', tlsCAFile=certifi.where())
        self.db = self.client["DFSDatabase"]
        self.lineups_collection = self.db["lineups"]
        self.db2 = self.client["DFSOwnershipProjections"]
        self.projections_collection = self.db2["projections"]
        self.draftgroups_collection = self.db["draftGroups"]
        self.draftables_collection = self.db["draftables"]

    def createLineup(self, data):	
        self.lineups_collection.insert_one(data)

    def updateLineup(self, data):
        self.lineups_collection.replace_one({"draft-group": data["draft-group"], "lineup-id": data["lineup-id"]}, data, upsert=True)

    def getUserLineupsByDraftGroup(self, draftGroupId, userId):
        cursor = self.lineups_collection.find({"draft-group": draftGroupId, "user_public_id": userId})
        lineups = [lineup for lineup in cursor]
        return lineups

    def get_user_lineups(self, userPublicId):
        cursor = self.lineups_collection.find({"user_public_id": userPublicId})
        lineups = [lineup for lineup in cursor]
        return lineups

    def batchDeleteLineups(self, userPublicId, lineupIds):
        for lineupId in lineupIds:
            self.lineups_collection.delete_one({ "user_public_id": userPublicId, "lineup-id": lineupId })

    def addProjections(self, data):
        projections = {"players": data, "last-update": str(datetime.date.today())}
        self.projections_collection.insert_one(json.loads(json_util.dumps(projections)))

    def addDraftGroups(self, data):
        self.draftgroups_collection.insert_many(data)

    def getDraftGroupsAll(self):
        cursor = self.draftgroups_collection.find({})
        # TODO: change this to add the whole response, instead of group["draftGroup"], change logic in
        draftgroups = sorted([group for group in cursor], key=lambda x: len(x["games"]), reverse=True)
        for draftGroup in draftgroups:
            del(draftGroup["_id"])
        return draftgroups

    def addDraftables(self, data):
        self.draftables_collection.insert_many(data)

    def getDraftablesByDraftGroupId(self, draftGroupId):
        draftables = self.draftables_collection.find_one({ "draftGroupId": int(draftGroupId)})
        return draftables

    def deleteAllLineups(self):
        self.lineups_collection.delete_many({})

    def deleteAllDraftGroups(self):
        self.draftgroups_collection.delete_many({})

    def deleteAllDraftables(self):
        self.draftables_collection.delete_many({})


