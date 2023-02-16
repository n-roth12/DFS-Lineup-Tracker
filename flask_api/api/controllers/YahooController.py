import requests
import datetime
from ..date_services import parseDraftGroupDateString

class YahooController:

    def __init__(self):
        self.none = ""

    def getYahooDraftablesByDraftGroupId(self, draftGroupId: int):
        draftables = requests.get(f'https://dfyql-ro.sports.yahoo.com/v2/contestPlayers?lang=en-US&region=US&device=desktop&contestId={draftGroupId}').json()

        return self.convertYahooDraftables(draftables)

    def getYahooUpcomingContests(self):
        series_ids = set()
        result = []
        res = requests.get('https://dfyql-ro.sports.yahoo.com/v2/contestsFilteredWeb?lang=en-US&region=US&device=desktop&sport=nfl&entryFeeMin=0&entryFeeMax=10500&sortAsc=false&slateTypes=SINGLE_GAME&slateTypes=MULTI_GAME')
        for contest in res.json()['contests']['result']:
            if contest["seriesId"] not in series_ids:
                series_ids.add(contest["seriesId"])

                result.append(contest)
        return result

    def getYahooDraftablesByContestId(self, contestId):
        try:
            res = requests.get(f'https://dfyql-ro.sports.yahoo.com/v2/contestPlayers?lang=en-US&region=US&device=desktop&contestId={contestId}').json()
            return res["players"]["result"]
        except Exception as e:
            print("Error retrieving yahoo players for contest")
            print(e)
            return 

    def getYahooUpcomingSeries(self):
        res = requests.get('https://dfyql-ro.sports.yahoo.com/v2/contestSeries?lang=en-US&region=US&device=desktop&sport=nfl&entryFeeMin=0&entryFeeMax=10500&sortAsc=false&slateTypes=SINGLE_GAME&slateTypes=MULTI_GAME').json()
        nfl_games = {}
        result = []
        games_dict = res["games"]["result"]
        for key in games_dict.keys():
            if key.startswith("nfl"):
                nfl_games[key] = games_dict[key]["game"]
        
        data = [x for x in res["sports"]["result"] if x["sportCode"] == "nfl"]
        series = data[0]["series"]
        
        for serie in series:
            games = []
            for game_code in serie["gameCodeList"]:
                games.append(nfl_games[game_code])

            converted_draft_group = self.convertYahooDraftGroup(serie, nfl_games)
            result.append(converted_draft_group)

        return result


    def convertYahooPlayer(self, player):
        result = {}
        result["team"] = player["teamAbbr"]
        result["position"] = player["primaryPosition"]
        result["fppg"] = player["fantasyPointsPerGame"]
        result["displayName"] = f'{player["firstName"]} {player["lastName"]}'
        result["firstName"] = player["firstName"]
        result["lastName"] = player["lastName"]
        result["oprk"] = ""
        result["playerSiteId"] = player["code"]
        result["salary"] = player["salary"]
        result["status"] = player["status"] if player["status"] != "N/A" else ""
        result["projPoints"] = player["projectedPoints"]
        result["playerImageSmall"] = player["imageUrl"]
        result["playerImageLarge"] = player["largeImageUrl"]
        result["number"] = player["number"]
        result["site"] = "yahoo"

        if player["game"]:
            result["game"] = {
                "gameId": player["game"]["gameId"],
                "homeTeam": player["game"]["homeTeam"]["abbr"],
                "awayTeam": player["game"]["awayTeam"]["abbr"],
                "startTime": player["game"]["startTime"],
            }
        
        result["opponent"] = result["game"]["homeTeam"] if result["team"] != result["game"]["homeTeam"] else result["game"]["awayTeam"]
        
        return result


    def convertYahooDraftables(self, draftables):
        convertedDraftables = []

        for player in draftables["players"]["result"]:
            convertedDraftables.append(self.convertYahooPlayer(player))

        return {"draftables": convertedDraftables, "site": "yahoo"}
    

    def convertYahooDraftGroup(self, draftGroup, nfl_games):
        data = {}
        data["site"] = "yahoo"
        data["draftGroupId"] = draftGroup["series"]["id"]
        data["startTime"] = datetime.datetime.utcfromtimestamp(draftGroup["series"]["startTime"] / 1000.0).strftime("%Y-%m-%dT%H:%M:%S")
        data["endTime"] = datetime.datetime.utcfromtimestamp(draftGroup["series"]["endTime"] / 1000.0).strftime("%Y-%m-%dT%H:%M:%S")
        data["startTimeSuffix"] = "Main" if draftGroup["series"]["mainSeries"] == True else draftGroup["series"]["seriesType"]
        data["salaryCap"] = draftGroup["series"]["salaryCapOverride"] if draftGroup["series"]["salaryCapOverride"] != None else 200
        week_info = parseDraftGroupDateString(data["startTime"])
        data["week"] = week_info["week"]
        data["year"] = week_info["year"]

        games = []
        for game_code in draftGroup["gameCodeList"]:
            game_data = nfl_games[game_code]
            games.append({
                "awayTeam": game_data["awayTeam"]["abbr"],
                "homeTeam": game_data["homeTeam"]["abbr"],
                "gameId": game_data["id"],
                "startTime": datetime.datetime.utcfromtimestamp(game_data["startTime"] / 1000.0).strftime("%Y-%m-%dT%H:%M:%S")
            })

        data["games"] = games

        return data
