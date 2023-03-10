from LineupOptimizerControllerModule.Lineup import Lineup

class TagsController:
    def __init__(self, lineup: Lineup):
        self.lineup = lineup

    def is_stack(self):
        return True
