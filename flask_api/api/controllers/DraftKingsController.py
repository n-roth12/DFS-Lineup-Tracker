import requests
import datetime
import time
from calendar import timegm

class DraftKingsController:

    def __init__(self):
        self.none = ""


    def fetchDraftKingsDraftGoups(self):
        result = []
        draftGroupIds = self.getDraftKingsDraftGroupIds()
        for draftGroupId in draftGroupIds:
            try:
                draftGroupRes = requests.get(f'https://api.draftkings.com/draftgroups/v1/{draftGroupId}')
                result.append(draftGroupRes.json())
            except:
                print(f"Error fetching draft group: {draftGroupId}")
        return result


    def getDraftKingsDraftGroupIds(self):
        try:
            res = requests.get("https://www.draftkings.com/lobby/getcontests?sport=nfl&format=json")
            contests = res.json()["Contests"]
            draft_group_ids = {contest["dg"] for contest in contests if not ('Madden' in contest['gameType'] or 'Showdown' in contest['gameType'] or 'Best Ball' in contest['gameType'] or 'Snake' in contest['gameType'])}
            return draft_group_ids
        except:
            print("Error fetching DraftKings draft group ids.")
            return []

    
    def getDraftKingsSlates(self):
        try:
            res = requests.get("https://www.draftkings.com/lobby/getcontests?sport=nfl&format=json")
            contests = res.json()["Contests"]
            draft_group_contests = [contest for contest in contests if not ('Madden' in contest['gameType'] or 'Showdown' in contest['gameType'] or 'Best Ball' in contest['gameType'] or 'Snake' in contest['gameType'])]
            print(len(draft_group_contests))
            print({contest["nt"] for contest in draft_group_contests})
            print({contest["dg"] for contest in draft_group_contests})
            print({contest["m"] for contest in draft_group_contests})

            return draft_group_contests
        except Exception as e:
            print("Error fetching draftkings slates.")
            print(e)
            return []


    def getDraftKingsDraftGroupById(self, draftGroupId):
        res = requests.get(f'https://api.draftkings.com/draftgroups/v1/{draftGroupId}').json()
        return self.convertDraftKingsDraftGroup(res["draftGroup"])

    
    def getDraftKingsContestRules(self, gameTypeId):
        try:
            res = requests.get(f"https://api.draftkings.com/lineups/v1/gametypes/{gameTypeId}/rules?format=json")
        except Exception as e:
            print(e)
        return
        

    def getDraftKingsDraftablesByDraftGroupId(self, draftGroupId: str):
        res = requests.get(f'https://api.draftkings.com/draftgroups/v1/draftgroups/{draftGroupId}/draftables?format=json').json()
        return self.convertDraftKingsDraftables(res["draftables"])


    def convertDraftKingsDraftGroup(self, draftGroup):
        data = {}
        data["site"] = "draftkings"
        data["draftGroupId"] = draftGroup["draftGroupId"]
        data["startTime"] = datetime.datetime.utcfromtimestamp(timegm(time.strptime(draftGroup["minStartTime"], "%Y-%m-%dT%H:%M:%S.%f0Z"))).strftime("%Y-%m-%dT%H:%M:%S")
        data["endTime"] = ""
        data["startTimeSuffix"] = draftGroup.get("startTimeSuffix") if draftGroup.get("startTimeSuffix") else "Main"
        data["salaryCap"] = 60000

        games = []
        for game in draftGroup["games"]:
            split_teams = game["description"].split(" @ ")
            games.append({
                "awayTeam": split_teams[0],
                "homeTeam": split_teams[1],
                "gameId": game["gameId"],
                "startTime": datetime.datetime.utcfromtimestamp(timegm(time.strptime(game["startDate"], "%Y-%m-%dT%H:%M:%S.%f0Z"))).strftime("%Y-%m-%dT%H:%M:%S")
            })

        data["games"] = games
        return data


    def convertDraftKingsDraftables(self, draftables):
        convertedDraftables = []
        draftablesIds = set()

        for player in draftables:
            if player["playerId"] not in draftablesIds:
                convertedDraftables.append(self.convertDraftKingsPlayer(player))
                draftablesIds.add(player["playerId"])

        return convertedDraftables


    def convertDraftKingsPlayer(self, player):
        result = {}
        if player["draftStatAttributes"]:
            result["fppg"] = [x["value"] for x in player["draftStatAttributes"] if x["id"] == 90][0]
            result["oprk"] = int([x["sortValue"] for x in player["draftStatAttributes"] if x["id"] == -2][0])
            
        if player["competition"]:
            result["game"] = {
                "homeTeam": player["competition"]["nameDisplay"][0]["value"],
                "awayTeam": player["competition"]["nameDisplay"][2]["value"],
                "gameId": player["competition"]["competitionId"],
                "startTime": datetime.datetime.utcfromtimestamp(timegm(time.strptime(player["competition"]["startTime"], "%Y-%m-%dT%H:%M:%S.%f0Z"))).strftime("%Y-%m-%dT%H:%M:%S")
            }
        
        result["team"] = player["teamAbbreviation"]
        result["site"] = "draftkings"
        result["position"] = player["position"]
        result["displayName"] = f'{player["firstName"]} {player["lastName"]}'
        result["firstName"] = player["firstName"]
        result["lastName"] = player["lastName"]
        result["playerSiteId"] = player["playerId"]
        result["salary"] = player.get("salary") if player.get("salary") else None
        result["status"] = player["status"] if player["status"] != "None" else ""
        result["projPoints"] = ""
        result["playerImageSmall"] = player["playerImage50"]
        result["playerImageLarge"] = player["playerImage160"]
        result["number"] = ""
        
        result["opponent"] = result["game"]["homeTeam"] if result["team"] != result["game"]["homeTeam"] else result["game"]["awayTeam"]
        
        return result
