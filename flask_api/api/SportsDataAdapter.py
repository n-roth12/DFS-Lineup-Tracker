import requests

class SportsDataAdapter:

    def getUpcomingDfsSlateOwnershipProjections():
        key = 'd658a35b50074aaa9824096f7af63bdc'
        try:
            data = requests.get(f'https://api.sportsdata.io/v3/nfl/projections/json/UpcomingDfsSlateOwnershipProjections?key={key}').json()
            draftKingsData = filter(lambda x: x["Operator"] == "DraftKings", data)
            return draftKingsData
        except:
            print(f"Error retrieving SportsData upcoming ownership projections")
            return []


    def getPlayerGameProjectionsByWeek(year: int, week: int):
        key = 'd658a35b50074aaa9824096f7af63bdc'
        try:
            data = requests.get(f'https://api.sportsdata.io/v3/nfl/projections/json/PlayerGameProjectionStatsByWeek/{year}/{week}?key={key}')
            return data
        except:
            print(f"Error retrieving SportsData projections for {year} week {week}")
            return []
