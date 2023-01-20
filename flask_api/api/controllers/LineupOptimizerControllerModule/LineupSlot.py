class LineupSlot:

    # position should be a specific lineup slot (i.e. QB, RB1, RB2, FLEX...)
    def __init__(self, slot):
        self.slot = slot
        self.flex_eligible_positions = ["RB", "WR", "TE"]


    def is_position_eligible_for_slot(self, position):
        if self.slot == "FLEX":
            return position in self.flex_eligible_positions

        return "".join(filter(lambda x: x.isalpha(), position)) == self.slot