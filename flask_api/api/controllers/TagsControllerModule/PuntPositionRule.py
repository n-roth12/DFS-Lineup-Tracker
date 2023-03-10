from LineupOptimizerControllerModule.Lineup import Lineup

DRAFT_KINGS_PUNT_PRICE = 4000

class PuntPositionRule:

    def check_rule(self, lineup: Lineup):
        for player in lineup.lineup.value():
            if player.get("salary") < DRAFT_KINGS_PUNT_PRICE:
                return True, player.get("position")



