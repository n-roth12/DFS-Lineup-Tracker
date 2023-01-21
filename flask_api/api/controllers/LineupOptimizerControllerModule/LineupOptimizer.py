from ..LineupOptimizerControllerModule import allowed_positions
from ..LineupOptimizerControllerModule.Lineup import Lineup
# from allowed_positions import flex_positions_dict, injured_status_list
# from Lineup import Lineup
from random import randint

class LineupOptimizer:

    def __init__(self, lineup: Lineup, draftables: list, lineup_positions: list, stack_teams = [], stack_number_of_players = 0, punt_positions = [], excluded_flex_positions = []) -> None:
        self.lineup = lineup
        self.weighted_cost_map = self.create_weighted_cost_map(draftables=draftables, lineup_positions=lineup_positions)
        if stack_teams and len(stack_teams) == 2 and stack_number_of_players and stack_number_of_players > 1:
            first_team_number_of_players = stack_number_of_players // 2
            second_team_number_of_players = stack_number_of_players - first_team_number_of_players
            self.stack = { stack_teams[0]: first_team_number_of_players, stack_teams[1]: second_team_number_of_players }
        elif stack_teams and len(stack_teams) == 1:
            self.stack = {stack_teams[0]: stack_number_of_players}
        self.flex_positions_to_exclude = excluded_flex_positions
        self.punt_positions = punt_positions
        self.number_of_retries = 10
        self.number_of_players_to_consider = 15

    def create_weighted_cost_map(self, draftables: list, lineup_positions:list) -> dict:
        positions_set = set(lineup_positions)
        weighted_cost_map = { "".join(filter(lambda x: x.isalpha(), position)): [] for position in positions_set \
            if position not in list(allowed_positions.flex_positions_dict.get(self.lineup.get_site()).keys()) }

        for draftable in draftables:
            fantasy_points_per_game = 0.0 if draftable["fppg"] == "-" else float(draftable["fppg"]) 
            value = fantasy_points_per_game / int(draftable["salary"])
            draftable["value"] = value
            weighted_cost_map[draftable["position"]].append(draftable)

        for position in weighted_cost_map.keys():
            weighted_cost_map[position].sort(key=lambda player : player["value"], reverse=True)

        return weighted_cost_map
    
    def generate_single_lineup(self) -> Lineup:
        empty_slots = self.lineup.get_empty_slots()
        if len(empty_slots) < 1:
            return self.lineup

        for lineup_slot in empty_slots:
            if lineup_slot in list(allowed_positions.flex_positions_dict.get(self.lineup.get_site()).keys()):
                eligible_flex_positions = [position for position in allowed_positions.flex_positions_dict.get(self.lineup.get_site()).get(lineup_slot) \
                    if self.flex_positions_to_exclude is None or (position not in self.flex_positions_to_exclude)]
                position = eligible_flex_positions[randint(0, len(eligible_flex_positions) - 1)]
            else:
                position = "".join(filter(lambda x: x.isalpha(), lineup_slot))

            player_to_add = self.pick_player_of_position(position)
            self.lineup.add_player_at_position(player=player_to_add, lineup_slot=lineup_slot)

        return self.lineup

    def pick_player_of_position(self, position: str) -> dict:
        for j in range(self.number_of_retries):
            player_index_to_use = randint(0, min(self.number_of_players_to_consider, len(self.weighted_cost_map[position]) - 1))
            if self.weighted_cost_map[position][player_index_to_use]["playerSiteId"] not in self.lineup.get_player_ids() \
                and self.weighted_cost_map[position][player_index_to_use]["status"] not in allowed_positions.injured_status_list:

                return self.weighted_cost_map[position][player_index_to_use]

        raise Exception("Error picking player for position: Exceedd max retries")
