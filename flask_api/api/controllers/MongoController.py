from pymongo import MongoClient
import certifi

from api import app

class MongoController:

    def __init__(self) -> None:
        self.client = MongoClient(f'{app.config["MONGODB_URI"]}', tlsCAFile=certifi.where())
        self.db = self.client["DFSDatabase"]
        self.lineups_collection = self.db["lineups"]


    def createLineup(self, data):	
        self.lineups_collection.insert_one(data)


    def updateLineup(self, data):
        self.lineups_collection.replace_one({"draft-group": data["draft-group"], "lineup-id": data["lineup-id"]}, data, upsert=True)


    def get_user_lineups(self, userPublicId):
        cursor = self.lineups_collection.find({"user_public_id": userPublicId})
        lineups = [lineup for lineup in cursor]
        return lineups