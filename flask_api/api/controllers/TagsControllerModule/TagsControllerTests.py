import unittest
from LineupOptimizerControllerModule.Lineup import Lineup
from LineupOptimizerControllerModule.LineupOptimizer import LineupOptimizer
from TagsControllerModule.TagsController import TagsController
from TagsControllerModule.PuntPositionRule import PuntPositionRule
from LineupOptimizerControllerModule.test_draftables import test_draftables
from TagsControllerModule.StackRule import StackRule

class TestTagsControllerMethods(unittest.TestCase):
    
    def test_returns_true(self):
        self.assertTrue(True)

    def test_stack_check_rule_returns_true(self):
        # self.get_lineup_with_stack()
        self.assertTrue(True)

    def test_get_team_stack(self):
        empty_lineup = self.empty_draftkings_lineup()
        lineup = self.add_stack_to_lineup(team_abbr="KC", num_players=3, lineup=empty_lineup, eligible_positions=["WR", "WR", "QB"])
        self.assertEqual([(3, 0)], StackRule.check_rule(lineup))

###### HELPER METHODS ######

    # Adds a stack to an existing lineup
    # Does not count players already in the lineup towards the stack
    def add_stack_to_lineup(self, team_abbr: str, num_players: int, lineup: Lineup, eligible_positions: list = None):
        if num_players < 1:
            return
        
        if len(eligible_positions) > 0 and num_players != len(eligible_positions):
            return

        stack_players = []
        for player in test_draftables:
            if player.get("team") == team_abbr and player.get("position") in eligible_positions:
                stack_players.append(player)
                eligible_positions.remove(player.get("position"))
                if len(stack_players) >= num_players:
                    break

        lineup.add_players(stack_players)
        return lineup

    def add_players_to_lineup(self, players: list, lineup: Lineup) -> Lineup:
        for player in players:
            lineup.add_player(player)


    def get_lineup_with_stack(self):
        lineup = self.optimizer_draftkings().generate_optimized_lineup(self.empty_draftkings_lineup())
        return lineup

    def get_team_stack(self, team_name: str, num_players: int, positions: list = []) -> list:
        if num_players < 1:
            return []
        
        if len(positions) > 0 and num_players != len(positions):
            return None

        result = []
        for player in test_draftables:
            if player.get("team") == team_name and player.get("position") in positions:
                result.append(player)
                positions.remove(player.get("position"))
                if len(result) >= num_players:
                    return result
        
        return result

    def empty_draftkings_lineup(self):
        lineup = Lineup.create_lineup_with_positions(positions=self.get_all_draftkings_lineup_slots(), site="draftkings")
        self.assertEqual(0, len(lineup.player_ids))
        return lineup

    def get_all_draftkings_lineup_slots(self):
        return ["QB", "RB1", "RB2", "WR1", "WR2", "WR3", "TE", "FLEX", "DST"]

    def optimizer_draftkings(self):
        return LineupOptimizer(draftables=test_draftables, \
            lineup_positions=self.get_all_draftkings_lineup_slots(), site="draftkings", salary_cap=50000)
            

if __name__ == "__main__":
    unittest.main()
    
    