import random
class LineupOptimizerController:

    def __init__(self) -> None:
        self.small_number_of_iterations = 1000
        self.number_of_iterations = 10000
        self.large_number_of_iterations = 100000
        self.flex_position_label = "FLEX"
        self.number_of_retries = 20
        self.number_of_players_to_consider = 15
        self.injured_status_list = ["IR", "O"]


    def generate_optimized_lineup(self, existing_lineup: list, lineup_positions: list, eligible_flex_positions: list, 
        remainingSalaryCap: int, draftables: list) -> dict:

        flex_position = self.choose_flex_position(eligible_flex_positions)
        weighted_cost_map = self.create_weighted_cost_map(draftables=draftables, lineup_positions=lineup_positions)
        temp = self.remove_empty_lineup_positions(lineup=existing_lineup)
        lineup_positions_to_fill = self.get_positions_to_fill(existing_lineup=existing_lineup, lineup_positions=lineup_positions)

        # converted_lineup_positions = self.convert_lineup_positions(lineup_positions)

        best_lineup_proj = 0
        best_lineup = None
        count = 0

        for i in range(self.number_of_iterations):
            lineup = self.generate_single_lineup(existing_lineup=temp, weighted_cost_map=weighted_cost_map, 
                    lineup_positions_to_fill=lineup_positions_to_fill, flex_position=flex_position)

            if lineup is None:
                continue

            lineup_proj_total = self.get_lineup_projected_points(lineup)
            if lineup_proj_total > best_lineup_proj:
                best_lineup_proj = lineup_proj_total
                best_lineup = lineup
                count += 1
        
        return self.add_sort_order_to_lineup(best_lineup)        


    def get_lineup_projected_points(self, lineup: list) -> float:
        points_sum = 0
        for player in lineup:
            if player.get("player"):
                temp = player.get("player")
                points_sum += 0.0 if temp.get("fppg") == "-" else float(temp.get("fppg"))
            else:
                points_sum += 0.0 if player.get("fppg") == "-" else float(player.get("fppg")) 

        return points_sum


    def get_lineup_salary(self, lineup: list) -> int:
        salary_sum = 0
        for player in lineup:
            salary_sum += player["salary"]
        
        return salary_sum

    
    def get_positions_to_replace(self, lineup: list) -> list:
        return [position["position"] for position in lineup if len(list(position["player"].keys())) < 1]

    
    def remove_empty_lineup_positions(self, lineup: list) -> list:
        result = []
        for position in lineup:
            if position.get("player") and len(position.get("player").keys()) > 1:
                result.append(position)
        return result


    def generate_single_lineup(self, lineup_positions_to_fill: list, weighted_cost_map: dict, flex_position: list, existing_lineup: list) -> list:
        lineup = [i for i in existing_lineup]
        lineup_ids = [i.get("player").get("playerSiteId") for i in existing_lineup if i.get("player")]
        salary_sum = 0
        proj_total = 0
        # print(existing_lineup)
        # print(len(lineup_positions_to_fill))
        for position in lineup_positions_to_fill:
            if self.remove_number_from_string(position) == self.flex_position_label:
                temp = flex_position
            else:
                temp = position
            player_to_add = self.pick_player_for_position(weighted_cost_map=weighted_cost_map, 
                position=self.remove_number_from_string(temp), lineup_ids=lineup_ids)
            
            if player_to_add is None:
                return None

            salary_sum += player_to_add["salary"]
            proj_total += float(player_to_add["fppg"]) if player_to_add["fppg"] != "-" else 0

            lineup.append({"position": position, "player": player_to_add})
            lineup_ids.append(player_to_add["playerSiteId"])
        # print('oo')
        # print(lineup)
        # print(len(lineup))
        if len(lineup) != len(lineup_positions_to_fill) + len(existing_lineup) or salary_sum > 60000:
            # print("error, lineup is either over the salary cap or does not have the right number of players...")
            return None
        
        return lineup


    def pick_player_for_position(self, weighted_cost_map: dict, position: str, lineup_ids: list) -> dict:
        for j in range(self.number_of_retries):
            player_index_to_use = random.randint(0, min(self.number_of_players_to_consider, len(weighted_cost_map[position]) - 1))
            if weighted_cost_map[position][player_index_to_use]["playerSiteId"] not in lineup_ids \
                    and weighted_cost_map[position][player_index_to_use]["status"] not in self.injured_status_list:

                return weighted_cost_map[position][player_index_to_use]

        # print(f"error, not able to pick player for position in under {str(self.number_of_retries)} tries...")
        return None
        
    
    def determine_stack_positions(self, existing_lineup, teams_to_stack, number_of_players_to_stack, lineup_positions):
        count = 0
        if len(teams_to_stack) < 1 or number_of_players_to_stack < 1:
            return []

        for position in existing_lineup:
            if position["player"] and position["player"]["team"] in teams_to_stack:
                count += 1

        if count >= number_of_players_to_stack:
            return []

        
    def get_positions_to_fill(self, existing_lineup: list, lineup_positions: list) -> list:
        lineup_positions_copy = [i for i in lineup_positions]
        print(lineup_positions_copy)
        for position in existing_lineup:
            print(position)
            if position.get("player") and len(position.get("player").keys()) > 1:
                lineup_positions_copy.remove(position["position"])

        return lineup_positions_copy

    
    def remove_number_from_string(self, val: str) -> str:
        return "".join(filter(lambda x: x.isalpha(), val))


    def create_weighted_cost_map(self, draftables: list, lineup_positions:list) -> dict:
        weighted_cost_map = self.positions_list_to_weighted_cost_map(lineup_positions)

        for draftable in draftables["draftables"]:
            fantasy_points_per_game = 0.0 if draftable["fppg"] == "-" else float(draftable["fppg"]) 
            value = fantasy_points_per_game / int(draftable["salary"])
            draftable["value"] = value
            weighted_cost_map[draftable["position"]].append(draftable)

        for position in weighted_cost_map.keys():
            weighted_cost_map[position].sort(key=lambda player : player["value"], reverse=True)

        return weighted_cost_map
    

    def positions_list_to_weighted_cost_map(self, positions_list: list) -> dict:
        positions = set(positions_list)
        return { self.remove_number_from_string(position): [] for position in positions if position != self.flex_position_label}


    def choose_flex_position(self, eligible_flex_positions: list) -> list:
        return eligible_flex_positions[random.randint(0, len(eligible_flex_positions) - 1)]

    
    def add_sort_order_to_lineup(self, lineup: dict) -> dict:
        sorted_positions = ["QB", "RB1", "RB2", "WR1", "WR2", "WR3", "TE", "FLEX", "DST"]
        for player in lineup:
            if player["position"] not in sorted_positions:
                player["sort_index"] = 100
            else:
                player["sort_index"] = sorted_positions.index(player["position"])
        return lineup


    def convert_lineup_positions(self, positions_list: list) -> list:
        result = []
        if len(positions_list) < 1:
            return result

        prev = positions_list.pop(0)
        prev_count = 0
        for i in range(len(positions_list)):
            temp = positions_list.pop(0)
            if temp != prev:
                result.append(prev + (str(prev_count + 1) if prev_count > 0  else ""))
                prev_count = 0
            else:
                prev_count += 1
                result.append(prev + str(prev_count))
            prev = temp

        result.append(prev + (str(prev_count + 1) if prev_count > 0 else ""))

        return result
