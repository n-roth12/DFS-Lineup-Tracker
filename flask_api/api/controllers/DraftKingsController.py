import requests

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
        try:
            res = requests.get(f'https://api.draftkings.com/draftgroups/v1/{draftGroupId}')
            return res.json()["draftGroup"]
        except Exception as e:
            print(e)
            return

    
    def getDraftKingsContestRules(self, gameTypeId):
        try:
            res = requests.get(f"https://api.draftkings.com/lineups/v1/gametypes/{gameTypeId}/rules?format=json")
        except Exception as e:
            print(e)
        return
        

    def getDraftKingsDraftablesByDraftGroupId(self, draftGroupId: str):
        try:
            res = requests.get(f'https://api.draftkings.com/draftgroups/v1/draftgroups/{draftGroupId}/draftables?format=json')
            return res.json()["draftables"]
        except:
            print(f"Error fetching DraftKings draftables from draft group: {draftGroupId}")
            return []


    def convertDraftKingsPlayer(self, player):
        if player["draftStatAttributes"]:
            fppg = [x["value"] for x in player["draftStatAttributes"] if x["id"] == 90]
            oprk = [x["value"] for x in player["draftStatAttributes"] if x["id"] == -2]
            
            player["fppg"] = fppg[0] if len(fppg) else None
            player["oprk"] = oprk[0] if len(oprk) else None

        if player["game"]:
            player["game"] = {
                "homeTeam": player["competition"]["nameDisplay"][0]["value"],
                "awayTeam": player["competition"]["nameDisplay"][2]["value"],
                "competitionId": player["competition"]["competitionId"],
                "startTime": player["competition"]["startTime"]
            }
        
        player["team"] = player.pop("teamAbbreviation", "")
        player["site"] = "draftkings"

        del(player["teamAbbreviation"])
        del(player["competition"])
        del(player["draftStatAttributes"])
        del(player["rosterSlotId"])
        del(player["isSwappable"])
        del(player["teamLeagueSeasonAttributes"])
        del(player["externalRequirements"])
        
        return player

