from LineupOptimizerControllerModule.Lineup import Lineup

stack_types = [(3, 1), (3, 2), (4, 1), (4, 2), (4, 3), (5, 1), (3, 0), (4, 0), (2, 1), (5, 0)]

class StackRule:

    def check_rule(lineup: Lineup) -> list:
        stack_map = StackRule.get_team_positional_map(lineup=lineup)
        return StackRule.get_stacks(stack_map)

    def implement_rule(team_abbr: str, num_players: int, lineup: Lineup, draftables: list, eligible_positions: list = None):
        return StackRule.add_stack_to_lineup(team_abbr=team_abbr, num_players=num_players, lineup=lineup, draftables=draftables, eligible_positions=eligible_positions)

    # def contains_stack(self, stack_map: dict, num_players1: int, num_players2: int):
    #     result = []
    #     for gameId in stack_map.keys():
    #         if (len(stack_map[gameId]["homeTeam"]["players"]) == num_players1 and len(stack_map[gameId]["awayTeam"]["players"]) == num_players2)  \
    #             or (len(stack_map[gameId]["awayTeam"]["players"]) == num_players1 and len(stack_map[gameId]["homeTeam"]["players"]) == num_players2):
    #                 return True
    #     return False

    def get_stacks(stack_map: dict):
        result = []
        for gameId in stack_map.keys():
            players1 = max(len(stack_map[gameId]["homeTeam"]["players"]), len(stack_map[gameId]["awayTeam"]["players"]))
            players2 = min(len(stack_map[gameId]["homeTeam"]["players"]), len(stack_map[gameId]["awayTeam"]["players"]))

            if (players1, players2) in stack_types:
                result.append((players1, players2))

        return result


    def get_team_positional_map(lineup: Lineup):
        stack_map = {}

        for player in [x for x in lineup.lineup.values() if x]:
            if player.get("game").get("gameId") not in stack_map.keys():
                stack_map[player.get("game").get("gameId")] = \
                { 
                    "homeTeam": {"team": player.get("game").get("homeTeam"), 
                    "players": [player] if player.get("team") == player.get("game").get("homeTeam") else []}, 
                    "awayTeam": {"team": player.get("game").get("awayTeam"), "players": [],
                    "players": [player] if player.get("team") == player.get("game").get("awayTeam") else []}
                }
            else:
                if player.get("team") == player.get("game").get("homeTeam"):
                    stack_map[player.get("game").get("gameId")]["homeTeam"]["players"].append(player)
                else:
                    stack_map[player.get("game").get("gameId")]["awayTeam"]["players"].append(player)

        return stack_map


    def add_stack_to_lineup(team_abbr: str, num_players: int, lineup: Lineup, draftables: list, eligible_positions: list = None):
        if num_players < 1:
            return
        
        if len(eligible_positions) > 0 and num_players != len(eligible_positions):
            return

        stack_players = []
        for player in draftables:
            if player.get("team") == team_abbr and player.get("position") in eligible_positions:
                stack_players.append(player)
                eligible_positions.remove(player.get("position"))
                if len(stack_players) >= num_players:
                    break

        lineup.add_players(stack_players)
        return lineup
