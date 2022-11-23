import requests

from .MongoController import MongoController

MongoController = MongoController()

class SportsDataController:
    
    def __init__(self):
        self.key = 'd658a35b50074aaa9824096f7af63bdc'

    def getUpcomingDfsSlateOwnershipProjections(self):
        try:
            data = requests.get(f'https://api.sportsdata.io/v3/nfl/projections/json/UpcomingDfsSlateOwnershipProjections?key={self.key}').json()
            draftKingsData = filter(lambda x: x["Operator"] == "DraftKings", data)
            return draftKingsData
        except:
            print(f"Error retrieving SportsData upcoming ownership projections")
            return []


    def getPlayerGameProjectionsByWeek(self, year: int, week: int):
        try:
            data = requests.get(f'https://api.sportsdata.io/v3/nfl/projections/json/PlayerGameProjectionStatsByWeek/{year}/{week}?key={self.key}')
            return data
        except:
            print(f"Error retrieving SportsData projections for {year} week {week}")
            return []

    def getSlatesByWeek(self, year: int, week: int):
        try:
            data = requests.get(f'https://api.sportsdata.io/v3/nfl/projections/json/DfsSlatesByWeek/{year}/{week}?key={self.key}')
            return data
        except Exception as e:
            print(f'Error retreiving SportsData slates for {year} week {week}')
            print(e)
            return []


