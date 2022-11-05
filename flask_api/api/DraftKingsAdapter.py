import requests

class DraftKingsAdapter:

    def getDraftKingsDraftGoups(this):
        result = []
        draftGroupIds = this.getDraftKingsDraftGroupIds()
        for draftGroupId in draftGroupIds:
            try:
                draftGroupRes = requests.get(f'https://api.draftkings.com/draftgroups/v1/{draftGroupId}')
                result.append(draftGroupRes.json())
            except:
                print(f"Error fetching draft group: {draftGroupId}")
        return result

    
    def getDraftKingsDraftGroupIds():
        try:
            res = requests.get("https://www.draftkings.com/lobby/getcontests?sport=nfl&format=json")
            contests = res.json()["Contests"]
            draft_group_ids = {contest["dg"] for contest in contests if not ('Madden' in contest['gameType'] or 'Showdown' in contest['gameType'] or 'Best Ball' in contest['gameType'] or 'Snake' in contest['gameType'])}
            return draft_group_ids
        except:
            print("Error fetching DraftKings draft group ids.")
            return []


    def getDraftKingsDraftablesByDraftGroupId(draftGroupId: str):
        try:
            res = requests.get(f'https://api.draftkings.com/draftgroups/v1/draftgroups/{draftGroupId}/draftables?format=json')
            return res.json()["draftables"]
        except:
            print(f"Error fetching DraftKings draftables from draft group: {draftGroupId}")
            return []