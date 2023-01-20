import unittest
from Lineup import Lineup
from LineupOptimizer import LineupOptimizer
from test_draftables import test_draftables


class TestLineupOptimizerMethods(unittest.TestCase):
    
    ###### UNIT TESTS ######
    def test_create_lineup_optimizer(self):
        test_draftables = self.test_draftables()
        empty_lineup = self.empty_draftkings_lineup()
        lineup_optimizer = LineupOptimizer(draftables=test_draftables, lineup=empty_lineup, \
            lineup_positions=self.get_all_draftkings_lineup_slots())
        


    ##### HELPER METHODS ######
    def empty_draftkings_lineup(self):
        return Lineup(positions=self.get_all_draftkings_lineup_slots(), players=[], site="draftkings")

    def get_all_draftkings_lineup_slots(self):
        return ["QB", "RB1", "RB2", "WR1", "WR2", "WR3", "TE", "FLEX", "DST"]

    def test_draftables(self):
        return test_draftables


if __name__ == "__main__":
    unittest.main()