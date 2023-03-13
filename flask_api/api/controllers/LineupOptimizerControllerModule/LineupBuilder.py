from LineupOptimizerControllerModule.LineupBuilderSlot import LineupBuilderSlot

class LineupBuilder:

    def __init__(self, positions: list, site: str):
        self.lineup_slots = []
        self.site = site
        for position in positions:
            self.lineup_slots.append(LineupBuilderSlot(title=position, site=site))

    def get(self, position_title: str):
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

    def with_stack_rule(self, stack_dict: dict):
        return self

    def with_punt_rule(self, position: str, max_salary = None):
        p = self.get(position)
        p.set_max_salary(max_salary)
        return self
