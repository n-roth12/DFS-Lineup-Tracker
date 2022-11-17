from api import app
import redis
import json
import requests

class RedisController:

    redis_client = redis.Redis(host='localhost', port=6379, db=0)

    def get_players(self, year, week):
        key = f'players_{year}_{week}'
        players = self.redis_client.get(key)
        return json.loads(players) if players else None


    def set_players(self, year, week):
        key = f'players_{year}_{week}'
        
        try:
            res = requests.get(f'{app.config["FFB_API_URL"]}api/top?year={year}&week={week}')
            players_from_api = res.json()
            qbs_res = requests.get(f'{app.config["FFB_API_URL"]}api/top?year={year}&week={week}&pos=QB')
            qbs_from_api = qbs_res.json()
            rbs_res = requests.get(f'{app.config["FFB_API_URL"]}api/top?year={year}&week={week}&pos=RB')
            rbs_from_api = rbs_res.json()
            wrs_res = requests.get(f'{app.config["FFB_API_URL"]}api/top?year={year}&week={week}&pos=WR')
            wrs_from_api = wrs_res.json()
            tes_res = requests.get(f'{app.config["FFB_API_URL"]}api/top?year={year}&week={week}&pos=TE')
            tes_from_api = tes_res.json()
            def_res = requests.get(f'{app.config["FFB_API_URL"]}api/top?year={year}&week={week}&pos=dst')
            defenses_from_api = def_res.json()

            result = {
                "All": players_from_api, 
                "QB": qbs_from_api,
                "RB": rbs_from_api,
                "WR": wrs_from_api,
                "TE": tes_from_api,
                "DST": defenses_from_api 
            }

            self.redis_client.set(key, json.dumps(result))

            return result

        except Exception as e:
            print(e)
            return None


    def get_year(self, year):
        key = f'players_{year}'
        players = self.redis_client.get(key)
        return json.loads(players)

    def set_year(self, year):
        key = f'players_{year}'
        
        res = requests.get(f'{app.config["FFB_API_URL"]}api/top?year={year}')
        players_from_api = res.json()
        qbs_res = requests.get(f'{app.config["FFB_API_URL"]}api/top?year={year}&pos=QB')
        qbs_from_api = qbs_res.json()
        rbs_res = requests.get(f'{app.config["FFB_API_URL"]}api/top?year={year}&pos=RB')
        rbs_from_api = rbs_res.json()
        wrs_res = requests.get(f'{app.config["FFB_API_URL"]}api/top?year={year}&pos=WR')
        wrs_from_api = wrs_res.json()
        tes_res = requests.get(f'{app.config["FFB_API_URL"]}api/top?year={year}&pos=TE')
        tes_from_api = tes_res.json()
        def_res = requests.get(f'{app.config["FFB_API_URL"]}api/top?year={year}&pos=dst')
        defenses_from_api = def_res.json()
        result = {
            "All": players_from_api, 
            "QB": qbs_from_api,
            "RB": rbs_from_api,
            "WR": wrs_from_api,
            "TE": tes_from_api,
            "DST": defenses_from_api 
        }
        
        self.redis_client.set(key, json.dumps(result))
        return result

    
    def get_games(self, year, week):
        key = f'games_{year}_{week}'
        games = self.redis_client.get(key)
        return json.loads(games) if games else None

    
    def set_games(self, year, week):
        key = f'games_{year}_{week}'
        data = requests.get(f'{app.config["FFB_API_URL"]}/api/teamstats?week={week}&year={year}').json()

        games = []
        for team, team_data in data.items():
            if len(team_data):
                game = team_data[0]['stats']['game']
                if game not in games:
                    games.append(game)
        
        self.redis_client.set(key, json.dumps(games))
        return games

    
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
