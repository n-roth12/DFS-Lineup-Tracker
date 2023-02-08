import unittest
from Lineup import Lineup
from LineupOptimizer import LineupOptimizer
from test_draftables import test_draftables

class TestLineupOptimizerMethods(unittest.TestCase):
    
    ###### UNIT TESTS ######
        
    def test_create_weighted_cost_map(self):
        optimizer = self.optimizer_draftkings()
        self.assertEqual(sorted(["QB", "RB", "WR", "TE", "DST"]), sorted(list(optimizer.weighted_cost_map.keys())))
        self.assertEqual(26, len(optimizer.weighted_cost_map.get("QB")))
        self.assertEqual(41, len(optimizer.weighted_cost_map.get("RB")))
        self.assertEqual(77, len(optimizer.weighted_cost_map.get("WR")))
        self.assertEqual(45, len(optimizer.weighted_cost_map.get("TE")))
        self.assertEqual(8, len(optimizer.weighted_cost_map.get("DST")))

    def test_get_player_of_position(self):
        optimizer = self.optimizer_draftkings()
        for position in ["QB", "RB", "WR", "TE", "DST"]:
            for i in range(10):
                player = optimizer.pick_player_of_position(position)
                self.assertEqual(position, player.get("position"))

    def test_generate_single_lineup_no_empty_positions(self):
        optimizer = self.optimizer_draftkings()
        for i in range(10):
            lineup = optimizer.generate_single_lineup(lineup=self.empty_draftkings_lineup())
            self.assertEqual(0, len(lineup.get_empty_slots()))

    def test_exclude_flex_positions(self):
        optimizer = LineupOptimizer(draftables=test_draftables, lineup_positions=self.get_all_draftkings_lineup_slots, \
            salary_cap=50000, excluded_flex_positions=["TE", "RB"])        
        for i in range(10):
            lineup = optimizer.generate_single_lineup(self.empty_draftkings_lineup())
            self.assertEqual(lineup.lineup.get("FLEX").get("position"), "WR")
        
        optimizer = LineupOptimizer(draftables=test_draftables, lineup_positions=self.get_all_draftkings_lineup_slots, \
            salary_cap=50000, excluded_flex_positions=["WR"])
        for i in range(10):
            lineup = optimizer.generate_single_lineup()
            self.assertNotEqual(lineup.lineup.get("FLEX").get("position"), "WR")

    def test_replace_only_empty(self):
        for i in range(10):
            lineup = self.non_empty_draftkings_lineup()
            optimizer = self.optimizer_draftkings()
            player1 = lineup.lineup.get("WR2")
            player2 = lineup.lineup.get("RB1")
            lineup = optimizer.generate_single_lineup(lineup=lineup)
            self.assertDictEqual(player1, lineup.lineup.get("WR2"))
            self.assertDictEqual(player2, lineup.lineup.get("RB1"))
            self.assertEqual(0, len(lineup.get_empty_slots()))

    ##### HELPER METHODS ######
    def optimizer_draftkings(self):
        test_draftables = self.draftables()
        return LineupOptimizer(draftables=test_draftables, \
            lineup_positions=self.get_all_draftkings_lineup_slots(), site="draftkings", salary_cap=50000)

    def non_empty_draftkings_lineup(self):
        optimizer = self.optimizer_draftkings()
        player1 = optimizer.pick_player_of_position("WR")
        player2 = optimizer.pick_player_of_position("RB")
        lineup = self.empty_draftkings_lineup()
        lineup.add_player_at_position(lineup_slot="WR1", player=player1)
        lineup.add_player_at_position(lineup_slot="RB1", player=player2)

        return lineup

    def empty_draftkings_lineup(self):
        return Lineup.create_lineup_with_positions(positions=self.get_all_draftkings_lineup_slots(), site="draftkings")

    def get_all_draftkings_lineup_slots(self):
        return ["QB", "RB1", "RB2", "WR1", "WR2", "WR3", "TE", "FLEX", "DST"]

    def draftables(self):
        return test_draftables


if __name__ == "__main__":
    unittest.main()