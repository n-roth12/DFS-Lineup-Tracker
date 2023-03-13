from LineupOptimizerControllerModule import Lineup

class CompositionRule:

    def check_rule(composition: dict, lineup: Lineup) -> bool:
        position_count = CompositionRule.count_positions(lineup)

        for position in composition.keys():
            if composition[position] != position_count[position]:
                return False

        return True

    def implement_rule(composition: dict, lineup: Lineup, draftables: list):
        position_count = CompositionRule.count_positions(lineup)
        
        

        return


    def count_positions(lineup: Lineup) -> dict:
        position_count = {}
        for player in lineup.lineup.values():
            if player and player.get("position"):
                if player.get("position") in position_count.keys():
                    position_count[player["position"]] += 1
                else:
                    position_count[player["position"]] = 1

        return position_count


# LineupBuilder
# default_stack_order = ["QB", "WR", "WR", "WR", "FLEX", "TE", "RB", "RB", "DST"]
# 3 RBs, [{ team: KC, players: {"QB": 1, "WR": 2} }], punt TE
# { "QB": {team: KC, salary: any, position: ["QB"]},
# "WR1": {},
# "WR2": {},
# 
# 
# }
# slots = LineupSlot
#   LineupSlot:
#       name = "WR1"
#       eligible_positions = ["WR"]
#          
