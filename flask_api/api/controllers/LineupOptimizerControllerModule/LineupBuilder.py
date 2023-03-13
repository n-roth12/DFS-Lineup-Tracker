from LineupOptimizerControllerModule.LineupBuilderSlot import LineupBuilderSlot

STACK_ORDER = ["QB", "WR", "TE", "RB", "DST"]

class LineupBuilder:

    def __init__(self, positions: list, site: str):
        self.lineup_slots = []
        self.site = site
        for position in positions:
            self.lineup_slots.append(LineupBuilderSlot(title=position, site=site))

    def get(self, position_title: str) -> LineupBuilderSlot:
        return next((lineup_slot for lineup_slot in self.lineup_slots if lineup_slot.title == position_title), None)
    
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

    def stack_order_helper(self, eligible_positions: list):
        return min([STACK_ORDER.index(pos) for pos in eligible_positions])
