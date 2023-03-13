import unittest
from LineupOptimizerControllerModule.LineupBuilder import LineupBuilder
from LineupOptimizerControllerModule.LineupBuilderSlot import LineupBuilderSlot

class LineupBuilderTests(unittest.TestCase):

    def test_true(self):
        return self.assertTrue(True)

    def test_lineup_builder_get(self):
        lineup_builder = LineupBuilder(positions=["QB", "RB1", "RB2", "WR1", "WR2", "WR3", "TE", "FLEX", "DST"], site="draftkings")
        self.assertIsNone(lineup_builder.get("TE2"))
        self.assertTrue(lineup_builder.get("WR3").title == "WR3")

    def test_with_punt_rule(self):
        lineup_builder = LineupBuilder(positions=["QB", "RB1", "RB2", "WR1", "WR2", "WR3", "TE", "FLEX", "DST"], 
            site="draftkings").with_punt_rule("TE", 4000).with_punt_rule("WR2", 3500)
        self.assertEqual(4000, lineup_builder.get("TE").max_salary)
        self.assertEqual(3500, lineup_builder.get("WR2").max_salary)

    def test_with_valid_composition_rule(self):
        lineup_builder = LineupBuilder(positions=["QB", "RB1", "RB2", "WR1", "WR2", "WR3", "TE", "FLEX", "DST"], 
            site="draftkings").with_composition_rule(position="RB", num_players=3)    
        self.assertEqual(["RB"], lineup_builder.get("FLEX").eligible_positions)
        lineup_builder = LineupBuilder(positions=["QB", "RB1", "RB2", "WR1", "WR2", "WR3", "TE", "FLEX", "DST"], 
            site="draftkings").with_composition_rule(position="WR", num_players=4)    
        lineup_builder = LineupBuilder(positions=["QB", "RB1", "RB2", "WR1", "WR2", "WR3", "TE", "FLEX", "DST"], 
            site="draftkings").with_composition_rule(position="TE", num_players=2)   

    def test_with_invalid_composition_rule(self):
        self.assertIsNone(LineupBuilder(positions=["QB", "RB1", "RB2", "WR1", "WR2", "WR3", "TE", "FLEX", "DST"], 
            site="draftkings").with_composition_rule(position="RB", num_players=4))
        self.assertIsNone(LineupBuilder(positions=["QB", "RB1", "RB2", "WR1", "WR2", "WR3", "TE", "FLEX", "DST"], 
            site="draftkings").with_composition_rule(position="WR", num_players=5))
        self.assertIsNone(LineupBuilder(positions=["QB", "RB1", "RB2", "WR1", "WR2", "WR3", "TE", "FLEX", "DST"], 
            site="draftkings").with_composition_rule(position="TE", num_players=3))
        self.assertIsNone(LineupBuilder(positions=["QB", "RB1", "RB2", "WR1", "WR2", "WR3", "TE", "FLEX", "DST"], 
            site="draftkings").with_composition_rule(position="QB", num_players=2))
