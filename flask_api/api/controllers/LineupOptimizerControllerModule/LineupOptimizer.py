from ..LineupOptimizerControllerModule import allowed_positions
from ..LineupOptimizerControllerModule.Lineup import Lineup
# from allowed_positions import flex_positions_dict, injured_status_list
# from Lineup import Lineup
from random import randint
from copy import deepcopy

class LineupOptimizer:

    def __init__(self, draftables: list, lineup_positions: list, salary_cap: int, site: str, stack_teams = [], \
        stack_number_of_players = 0, punt_positions = [], excluded_flex_positions = []) -> None:
        
        self.site = site
        self.weighted_cost_map = self.create_weighted_cost_map(draftables=draftables, lineup_positions=lineup_positions)
        self.stack = self.create_stack_map(stack_teams=stack_teams, stack_number_of_players=stack_number_of_players)
        self.flex_positions_to_exclude = excluded_flex_positions
        self.punt_positions = punt_positions
        self.number_of_retries = 10
        self.number_of_players_to_consider = 15
        self.salary_cap = salary_cap

    def create_weighted_cost_map(self, draftables: list, lineup_positions:list) -> dict:
        positions_set = set(lineup_positions)
        weighted_cost_map = { "".join(filter(lambda x: x.isalpha(), position)): [] for position in positions_set \
            if position not in list(allowed_positions.flex_positions_dict.get(self.site).keys()) }

        for draftable in draftables:
            fantasy_points_per_game = 0.0 if draftable["fppg"] == "-" else float(draftable["fppg"]) 
            value = fantasy_points_per_game / int(draftable["salary"])
            draftable["value"] = value
            weighted_cost_map[draftable["position"]].append(draftable)

        for position in weighted_cost_map.keys():
            weighted_cost_map[position].sort(key=lambda player : player["value"], reverse=True)

        return weighted_cost_map

    def generate_optimized_lineup(self, lineup: Lineup) -> Lineup:
        best_lineup_projection = 0.0
        best_lineup = None
        count1 = 0
        count2 = 0

        for i in range(100):
            generated_lineup = self.generate_single_lineup(lineup)

            lineup_proj_total = generated_lineup.get_lineup_projected_points()
            lineup_salary = generated_lineup.get_lineup_salary()
            if lineup_proj_total > best_lineup_projection:
                best_lineup_projection = lineup_proj_total
                best_lineup = generated_lineup
                count1 += 1
            if lineup_salary > self.salary_cap or len(generated_lineup.get_empty_slots()) != 0:
                count2 += 1
    
        print(count1)
        print(count2)
        print(best_lineup_projection)
        return best_lineup
    
    def generate_single_lineup(self, lineup: Lineup) -> Lineup:
        lineup_copy = deepcopy(lineup)
        empty_slots = lineup_copy.get_empty_slots()
        if len(empty_slots) < 1:
            return lineup_copy

        for lineup_slot in empty_slots:
            if lineup_slot in list(allowed_positions.flex_positions_dict.get(lineup_copy.get_site()).keys()):
                eligible_flex_positions = [position for position in allowed_positions.flex_positions_dict.get(lineup_copy.get_site()).get(lineup_slot) \
                    if self.flex_positions_to_exclude is None or (position not in self.flex_positions_to_exclude)]
                position = eligible_flex_positions[randint(0, len(eligible_flex_positions) - 1)]
            else:
                position = "".join(filter(lambda x: x.isalpha(), lineup_slot))

            for i in range(self.number_of_retries):
                player_to_add = self.pick_player_of_position(position)
                success = lineup_copy.add_player_at_position(player=player_to_add, lineup_slot=lineup_slot)

        return lineup_copy

    def pick_player_of_position(self, position: str) -> dict:
        for j in range(self.number_of_retries):
            player_index_to_use = randint(0, min(self.number_of_players_to_consider, len(self.weighted_cost_map[position]) - 1))
            if self.weighted_cost_map[position][player_index_to_use]["status"] not in allowed_positions.injured_status_list:

                return self.weighted_cost_map[position][player_index_to_use]

    def create_stack_map(self, stack_teams: list, stack_number_of_players: int) -> dict:
        if stack_teams and len(stack_teams) == 2 and stack_number_of_players and stack_number_of_players > 1:
            first_team_number_of_players = stack_number_of_players // 2
            second_team_number_of_players = stack_number_of_players - first_team_number_of_players
            return { stack_teams[0]: first_team_number_of_players, stack_teams[1]: second_team_number_of_players }
        elif stack_teams and len(stack_teams) == 1:
            return {stack_teams[0]: stack_number_of_players}
        
        return None
