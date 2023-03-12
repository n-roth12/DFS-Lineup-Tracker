from LineupOptimizerControllerModule.Lineup import Lineup

DRAFT_KINGS_PUNT_PRICE = 4000

class PuntPositionRule:

    def check_rule(lineup: Lineup):
        for player in lineup.lineup.values():
            if player.get("salary") < DRAFT_KINGS_PUNT_PRICE:
                return True, player.get("position")

    def implement_rule(lineup: Lineup, draftables: list):
        lineup.add_player(PuntPositionRule.get_punt_player())

    def get_punt_player(eligible_positions: list, draftables: list):
        for draftable in draftables:
            if draftable["salary"] <= DRAFT_KINGS_PUNT_PRICE and draftable["position"] in eligible_positions:
                return draftable
                