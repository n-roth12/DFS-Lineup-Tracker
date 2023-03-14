from LineupOptimizerControllerModule.LineupBuilderSlot import LineupBuilderSlot
from LineupOptimizerControllerModule.PlayerPicker import PlayerPicker
from LineupOptimizerControllerModule.allowed_positions import injured_status_list
from LineupOptimizerControllerModule.Lineup import Lineup
from random import randint

STACK_ORDER = ["QB", "WR", "TE", "RB", "DST"]
NUM_PLAYERS_TO_CONSIDER = 10

class LineupBuilder:

    def __init__(self, positions: list, site: str, draftables: list):
        self.lineup_slots = []
        self.site = site
        for position in positions:
            self.lineup_slots.append(LineupBuilderSlot(title=position, site=site))
        self.weighted_cost_map = self.create_weighted_cost_map(draftables)

    def get(self, position_title: str) -> LineupBuilderSlot:
        return next((lineup_slot for lineup_slot in self.lineup_slots if lineup_slot.title == position_title), None)

    def build(self) -> Lineup:
        lineup = {}
        lineup_ids = []
        for lineup_slot in self.lineup_slots:
            player = self.pick_player(lineup_slot.eligible_positions[0], 
                team_abbr=lineup_slot.eligible_team, max_salary=lineup_slot.max_salary, taken_ids=lineup_ids)
            lineup_ids.append(player["playerSiteId"])
            lineup[lineup_slot.title] = player
        return Lineup(lineup=lineup, site=self.site)

    def with_composition_rule(self, position: str, num_players: int):
        count = 0
        for slot in self.lineup_slots:
            if position in slot.eligible_positions:
                count += 1
                if len(slot.eligible_positions) > 1:
                    slot.eligible_positions = [position]
                if count >= num_players:
                    return self
        return None

    def with_punt_rule(self, position_title: str, max_salary = None):
        lineup_slot = self.get(position_title)
        if not lineup_slot:
            return None
        lineup_slot.set_max_salary(max_salary)
        return self

    # first team with always get the QB, best to pass team with more players first, could make wrapper method
    def with_stack_rule(self, team_abbr1: str, num_players1: int, team_abbr2: str, num_players2: int):
        count1 = 0
        count2 = 0
        for lineup_slot in sorted(self.lineup_slots, key=lambda x: self.stack_order_helper(x.eligible_positions)):
            if count1 == num_players1 and count2 == num_players2:
                return self
            if count2 == num_players2:
                lineup_slot.set_eligible_team(team_abbr1)
                count1 += 1
            elif count1 == num_players1:
                lineup_slot.set_eligible_team(team_abbr2)
                count2 += 1
            else:
                if count1 > count2 + 1:     # we first try to stack the first two players of team1 before any players on team2
                    lineup_slot.set_eligible_team(team_abbr2)
                    count2 += 1
                else:
                    lineup_slot.set_eligible_team(team_abbr1)
                    count1 += 1
        return None

    def stack_order_helper(self, eligible_positions: list) -> int:
        return min([STACK_ORDER.index(pos) for pos in eligible_positions])

    def create_weighted_cost_map(self, draftables: list) -> dict:
        weighted_cost_map = {}
        for draftable in draftables:
            fantasy_points_per_game = 0.0 if draftable["fppg"] == "-" else float(draftable["fppg"]) 
            value = fantasy_points_per_game / int(draftable["salary"])
            draftable["value"] = value
            if draftable.get("position") not in weighted_cost_map.keys():
                weighted_cost_map[draftable["position"]] = [draftable]
            else:
                weighted_cost_map[draftable["position"]].append(draftable)
        for position in weighted_cost_map.keys():
            weighted_cost_map[position].sort(key=lambda player : player["value"], reverse=True)
        return weighted_cost_map

    # picks the top players that matches the filters, None if no player matches filter
    def pick_player(self, position: str, taken_ids = [], team_abbr = None, max_salary = None) -> dict:
        return next((player for player in self.weighted_cost_map[position] if (
            (team_abbr == None or player["team"] == team_abbr) 
            and (max_salary == None or player["salary"] <=  max_salary) 
            and (player["status"] not in injured_status_list)
            and (player["playerSiteId"] not in taken_ids)
            )), None)
