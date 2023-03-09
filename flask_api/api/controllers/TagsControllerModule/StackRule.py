from LineupOptimizerControllerModule.Lineup import Lineup

class StackRule:

    def check_rule(self, lineup):
        team_positional_map = self.get_team_positional_map(lineup)
        

    def get_team_positional_map(self, lineup):
        result = {}

        for player in lineup.values():
            if player.get("game").get("gameId") not in result.keys():
                result[player.get("game").get("gameId")] = { 
                    player.get("game").get("homeTeam"): [], 
                    player.get("game").get("awayTeam") : [] 
                }
            result[player.get("game").get("gameId")][player.get("team")].append(player)

        return result



# maybe store game map like this:
# stack_map = { 
#   174834: { "TEN": [], "SF": [{player1}, {player2}] }
#   899028: { "MIA": [{player1}], "BUF": [{player1}, {player2}, {player3}] }
# }

