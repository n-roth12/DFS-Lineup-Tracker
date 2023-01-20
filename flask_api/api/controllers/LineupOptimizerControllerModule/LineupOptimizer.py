from allowed_positions import flex_positions_dict
from Lineup import Lineup
from random import randint

class LineupOptimizer:

    def __init__(self, lineup: Lineup, draftables: list, lineup_positions: list) -> None:
        self.lineup = lineup
        self.weighted_cost_map = self.create_weighted_cost_map(draftables=draftables, lineup_positions=lineup_positions)
        self.stack = None
        self.flex_positions_to_exclude = None
        self.replace_only_empty = False
        self.punt_positions = None


    def create_weighted_cost_map(self, draftables: list, lineup_positions:list) -> dict:
        positions_set = set(lineup_positions)
        weighted_cost_map = { "".join(filter(lambda x: x.isalpha(), position)) for position in positions_set if position != self.flex_position_label }

        for draftable in draftables["draftables"]:
            fantasy_points_per_game = 0.0 if draftable["fppg"] == "-" else float(draftable["fppg"]) 
            value = fantasy_points_per_game / int(draftable["salary"])
            draftable["value"] = value
            weighted_cost_map[draftable["position"]].append(draftable)

        for position in weighted_cost_map.keys():
            weighted_cost_map[position].sort(key=lambda player : player["value"], reverse=True)

        return weighted_cost_map


    def with_stack(self, teams: list, number_of_players: int):
        if len(teams < 1) or number_of_players < 1:
            return
        if len(teams) > 1:
            first_team_number_of_players = number_of_players // 2
            second_team_number_of_players = number_of_players - first_team_number_of_players
            self.stack = { teams[0]: first_team_number_of_players, teams[1]: second_team_number_of_players }
        else:
            self.stack = {teams[0]: number_of_players}

    def with_flex_constraint(self, flex_positions_to_exclude: list) -> None:
        self.flex_positions_to_exclude = flex_positions_to_exclude

    def with_replace_only_empty(self) -> None:
        self.replace_only_empty = True

    def with_punt_positions(self, positions: list) -> None:
        self.punt_positions = positions
    
    def generate_single_lineup(self) -> Lineup:
        empty_slots = self.lineup.get_empty_slots()
        if len(empty_slots) < 1:
            return self.lineup

        for lineup_slot in empty_slots:
            if lineup_slot in list(flex_positions_dict.get(self.lineup.get_site()).keys()):
                if self.flex_positions_to_exclude and len(self.flex_positions_to_exclude) > 0:
                    eligible_flex_positions = [position for position in flex_positions_dict.get(lineup_slot) if position not in self.flex_positions_to_exclude]
                    flex_position = eligible_flex_positions[randint(0, len(eligible_flex_positions) - 1)]

                    player_to_add = self.pick_player_of_position(flex_position)

                    self.lineup.add_player_at_position(player=player_to_add, lineup_slot=lineup_slot)


    def pick_player_of_position(self, position: str) -> dict:
        for j in range(self.number_of_retries):
            player_index_to_use = randint(0, min(self.number_of_players_to_consider, len(self.weighted_cost_map[position]) - 1))
            if self.weighted_cost_map[position][player_index_to_use]["playerSiteId"] not in lineup_ids \
                    and weighted_cost_map[position][player_index_to_use]["status"] not in self.injured_status_list:

                return weighted_cost_map[position][player_index_to_use]

        return None