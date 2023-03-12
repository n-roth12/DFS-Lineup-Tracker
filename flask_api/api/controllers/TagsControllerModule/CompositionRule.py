from LineupOptimizerControllerModule import Lineup

class CompositionRule:

    def check_rule(composition: dict, lineup: Lineup) -> bool:
        position_count = {}
        for player in lineup.lineup.values():
            if player and player.get("position"):
                if player.get("position") in position_count.keys():
                    position_count[player["position"]] += 1
                else:
                    position_count[player["position"]] = 1

        for position in composition.keys():
            if composition[position] != position_count[position]:
                return False

        return True

    def implement_rule(draftables: list):
        return