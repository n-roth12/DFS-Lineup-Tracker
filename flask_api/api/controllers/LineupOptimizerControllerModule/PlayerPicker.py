from LineupOptimizerControllerModule.allowed_positions import injured_status_list, flex_positions_dict

from random import randint
from copy import deepcopy

NUM_RETRIES = 10

class PlayerPicker:

    def __init__(self, draftables: list):
        self.weight_cost_map = self.create_weighted_cost_map()

    def create_weighted_cost_map(self, draftables: list, lineup_positions: list) -> dict:
        positions_set = set(lineup_positions)
        weighted_cost_map = { "".join(filter(lambda x: x.isalpha(), position)): [] for position in positions_set \
            if position not in list(flex_positions_dict.get(self.site).keys()) }

        for draftable in draftables:
            fantasy_points_per_game = 0.0 if draftable["fppg"] == "-" else float(draftable["fppg"]) 
            value = fantasy_points_per_game / int(draftable["salary"])
            draftable["value"] = value
            weighted_cost_map[draftable["position"]].append(draftable)

        for position in weighted_cost_map.keys():
            weighted_cost_map[position].sort(key=lambda player : player["value"], reverse=True)

        return weighted_cost_map

    def pick_player(self, draftables: list, position = None, team_abbr = None, max_salary = None):
        for j in range(self.number_of_retries):
            player_index_to_use = randint(0, min(self.number_of_players_to_consider, len(self.weighted_cost_map[position]) - 1))
            if self.weighted_cost_map[position][player_index_to_use]["status"] not in allowed_positions.injured_status_list:

                return self.weighted_cost_map[position][player_index_to_use]