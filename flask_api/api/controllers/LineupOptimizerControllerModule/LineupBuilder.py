from LineupOptimizerControllerModule.LineupBuilderSlot import LineupBuilderSlot

class LineupBuilder:

    def __init__(self, positions: list, site: str):
        self.lineup_slots = []
        self.site = site
        for position in positions:
            self.lineup_slots.append(LineupBuilderSlot(title=position, site=site))

    def get(self, position_title: str):
        return next((lineup_slot for lineup_slot in self.lineup_slots if lineup_slot.title == position_title), None)
    
    def with_composition_rule(self, composition_dict: dict):
        return

    def with_stack_rule(self, stack_dict: dict):
        return

    def with_punt_rule(self, position: str, salary_max = None):
        return