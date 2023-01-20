import unittest
from Lineup import Lineup
from LineupOptimizer import LineupOptimizer
from test_draftables import test_draftables

class TestLineupOptimizerMethods(unittest.TestCase):
    
    ###### UNIT TESTS ######
        
    def test_create_weighted_cost_map(self):
        optimizer = self.optimizer_with_empty_lineup()
        self.assertEqual(sorted(["QB", "RB", "WR", "TE", "DST"]), sorted(list(optimizer.weighted_cost_map.keys())))
        self.assertEqual(26, len(optimizer.weighted_cost_map.get("QB")))
        self.assertEqual(41, len(optimizer.weighted_cost_map.get("RB")))
        self.assertEqual(77, len(optimizer.weighted_cost_map.get("WR")))
        self.assertEqual(45, len(optimizer.weighted_cost_map.get("TE")))
        self.assertEqual(8, len(optimizer.weighted_cost_map.get("DST")))

    def test_create_optimizer_with_rules(self):
        optimizer = self.optimizer_with_empty_lineup() \
            .with_flex_constraint(["TE", "RB"]) \
            .with_punt_positions(["TE"]) \
            .with_stack(teams=["SF", "SEA"], number_of_players=4) \
            .with_replace_only_empty()
        self.assertEqual(["TE"], optimizer.punt_positions)
        self.assertEqual(sorted(["SF", "SEA"]), sorted(optimizer.stack.keys()))
        self.assertEqual(4, sum(optimizer.stack.values()))
        self.assertTrue(optimizer.replace_only_empty)
        self.assertEqual(sorted(["TE", "RB"]), sorted(optimizer.flex_positions_to_exclude))

    def test_get_player_of_position(self):
        optimizer = self.optimizer_with_empty_lineup()
        for position in ["QB", "RB", "WR", "TE", "DST"]:
            for i in range(10):
                player = optimizer.pick_player_of_position(position)
                self.assertEqual(position, player.get("position"))

    def test_generate_single_lineup(self):
        optimizer = self.optimizer_with_empty_lineup()
        lineup = optimizer.generate_single_lineup()
        print(lineup.lineup)

    ##### HELPER METHODS ######
    def optimizer_with_empty_lineup(self):
        test_draftables = self.draftables()
        empty_lineup = self.empty_draftkings_lineup()
        return LineupOptimizer(draftables=test_draftables, lineup=empty_lineup, \
            lineup_positions=self.get_all_draftkings_lineup_slots())

    def empty_draftkings_lineup(self):
        return Lineup(positions=self.get_all_draftkings_lineup_slots(), players=[], site="draftkings")

    def get_all_draftkings_lineup_slots(self):
        return ["QB", "RB1", "RB2", "WR1", "WR2", "WR3", "TE", "FLEX", "DST"]

    def draftables(self):
        return test_draftables


if __name__ == "__main__":
    unittest.main()