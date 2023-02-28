from api import app
import requests

class FFBApiController:

    def __init__(self): 
        self.api_endpoint = f'{app.config["FFB_API_URL"]}api'

    def get_player_career_stats(self, player_name: str):
        return self.get_player_stats_in_range(player_name, 2012, 2022)

    def get_player_stats_in_range(self, player_name: str, year_start: int, year_end: int):
        last_pos = "None"
        
        result = []
        for year in range(year_start, year_end + 1):
            res = requests.get(f'{self.api_endpoint}/stats?name={self.parse_player_name(player_name)}&year={year}')
            if res.status_code == 200:
                
                year_data = res.json()
                last_pos = year_data['position']
                result.append({'year': year, 'stats': year_data['stats'] })
            
        return { 'name': ' '.join(word[0].upper() + word[1:] for word in player_name.split(' ')), 'position': last_pos, 'stats': result}
    
    def get_player_year_stats(self, player_name: str, year: int):
        res = requests.get(f'{app.config["FFB_API_URL"]}/api/performances?name={self.parse_player_name(player_name)}&year={year}')
        if res.status_code != 200:
            return None

        year_data = res.json()
        return year_data

    def get_player_week_stats(self, player_name: str, year: int, week: int):
        return

    def parse_player_name(self, player_name: str):
        return player_name.replace(' ', '_')

    def get_players_list_stats(self, player_names_list, year, week):
        res = requests.get(f'{self.api_endpoint}/')

    def get_draftables_playergamestats(self, draftables, week, year):
        body = {
            "week": week,
            "year": year,
            "players": draftables
        }
        res = requests.post(f'{self.api_endpoint}/v2/playergamestats', json=body)
        if res.status_code == 200:
            return res.json()

        return []