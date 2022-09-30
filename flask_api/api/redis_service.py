from curses import echo
from api import app
import redis
import json
import requests

class RedisService:

    def __init__(self, host, port, db):
        self.redis_client = redis.Redis(host=host, port=port, db=db)

    # should return "success"
    def ping_cache(self):
        self.redis_client.set("test", json.dumps("success"))
        test = self.redis_client.get("test")
        if test:
            return json.loads(test)
        
    # should return None
    def fail_cache(self):
        test = self.redis_client.get("asdfsadf")
        return test


    def get_players(self, year, week):
        key = f'players_{year}_{week}'
        players = self.redis_client.get(key)
        return json.loads(players) if players else None


    def set_players(self, year, week):
        key = f'players_{year}_{week}'
        
        try:
            players_res = requests.get(f'{app.config["FFB_API_URL"]}api/top?year={year}&week={week}')
            players_from_api = players_res.json()
            defense_res = requests.get(f'{app.config["FFB_API_URL"]}api/top?year={year}&week={week}&pos=dst')
            defenses_from_api = defense_res.json()
            players_from_api.extend(defenses_from_api)
            self.redis_client.set(key, json.dumps(players_from_api))

            return players_from_api

        except Exception as e:
            print(e)
            return None

    
    def get_teams_info(self, year, week):
        key = f'team_info_{year}_{week}'
        team_info = self.redis_client.get(key)
        return json.loads(team_info) if team_info else None

    
    def set_teams_info(self, year, week):
        key = f'team_info_{year}_{week}'
        try:
            res = requests.get(f'{app.config["FFB_API_URL"]}api/teamstats?year={year}&week={week}')
            data = res.json()
            result = []
            for team, players in data.items():
                if len(players):
                    team_result = {'team': team}
                    point_total = sum([player['stats']['fantasy_points'] for player in players])
                    team_result['points'] = point_total
                    result.append(team_result)

            result = sorted(result, key=lambda x: x['points'], reverse=True)
            self.redis_client.set(key, json.dumps(result))
            return result
        except Exception as e:
            print(e)
            return None



    

    

