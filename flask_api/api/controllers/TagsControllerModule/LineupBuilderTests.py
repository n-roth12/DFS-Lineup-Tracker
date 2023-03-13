import unittest
from LineupOptimizerControllerModule.LineupBuilder import LineupBuilder
from LineupOptimizerControllerModule.LineupBuilderSlot import LineupBuilderSlot

class LineupBuilderTests(unittest.TestCase):

    def test_true(self):
        return self.assertTrue(True)

    def test_lineup_builder_get(self):
        lineup_builder = LineupBuilder(positions=["QB", "RB1", "RB2", "WR1", "WR2", "WR3", "TE", "FLEX", "DST"], site="draftkings")
        self.assertIsNone(lineup_builder.get("TE2"))
        self.assertIsNotNone(lineup_builder.get("TE"))
        self.assertTrue(lineup_builder.get("WR3").title == "WR3")
        self.assertFalse(lineup_builder.get("FLEX").title == "RB1")

        

    
