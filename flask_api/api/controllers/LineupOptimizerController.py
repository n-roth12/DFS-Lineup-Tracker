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


    def generate_optimized_lineup(self, existing_lineup: dict, lineup_positions: list, eligible_flex_positions: list, 
        remainingSalaryCap: int, draftables: list) -> dict:

        flex_position = self.choose_flex_position(eligible_flex_positions)
        weighted_cost_map = self.create_weighted_cost_map(draftables=draftables, lineup_positions=lineup_positions)

        best_lineup_proj = 0
        best_lineup = None
        count = 0

        for i in range(self.number_of_iterations):
            lineup = self.generate_single_lineup(weighted_cost_map=weighted_cost_map, 
                    lineup_positions=lineup_positions, flex_position=flex_position)

            if lineup is None:
                continue

            lineup_proj_total = self.get_lineup_projected_points(lineup)
            if lineup_proj_total > best_lineup_proj:
                best_lineup_proj = lineup_proj_total
                best_lineup = lineup
                count += 1

        result = []
        converted_lineup_positions = self.convert_lineup_positions(lineup_positions)
        for k in range(len(best_lineup)):
            result.append({"position": converted_lineup_positions[k].lower(), "player": best_lineup[k]})
        
        return self.add_sort_order_to_lineup(result)        


    def get_lineup_projected_points(self, lineup: list) -> float:
        points_sum = 0
        for player in lineup:
            points_sum += 0.0 if player["fppg"] == "-" else float(player["fppg"]) 

        return points_sum


    def get_lineup_salary(self, lineup: list) -> int:
        salary_sum = 0
        for player in lineup:
            salary_sum += player["salary"]
        
        return salary_sum


    def generate_single_lineup(self, lineup_positions: list, weighted_cost_map: dict, flex_position: list) -> list:
        lineup = []
        lineup_ids = []
        salary_sum = 0
        proj_total = 0
        for position in lineup_positions:
            if position == self.flex_position_label:
                position = flex_position
            player_to_add = self.pick_player_for_position(weighted_cost_map=weighted_cost_map, position=position, lineup_ids=lineup_ids)
            
            if player_to_add is None:
                return None

            salary_sum += player_to_add["salary"]
            proj_total += float(player_to_add["fppg"]) if player_to_add["fppg"] != "-" else 0

            lineup.append(player_to_add)
            lineup_ids.append(player_to_add["playerSiteId"])
        
        if len(lineup) != len(lineup_positions) or salary_sum > 60000:
            print("error, lineup is either over the salary cap or does not have the right number of players...")
            return None
        
        return lineup


    def pick_player_for_position(self, weighted_cost_map: dict, position: str, lineup_ids: list) -> dict:
        for j in range(self.number_of_retries):
            player_index_to_use = random.randint(0, min(self.number_of_players_to_consider, len(weighted_cost_map[position]) - 1))
            if weighted_cost_map[position][player_index_to_use]["playerSiteId"] not in lineup_ids \
                    and weighted_cost_map[position][player_index_to_use]["status"] not in self.injured_status_list:

                return weighted_cost_map[position][player_index_to_use]

        print(f"error, not able to pick player for position in under {str(self.number_of_retries)} tries...")
        return None


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
        return { position: [] for position in positions if position != self.flex_position_label}


    def choose_flex_position(self, eligible_flex_positions: list) -> list:
        return eligible_flex_positions[random.randint(0, len(eligible_flex_positions) - 1)]

    
    def add_sort_order_to_lineup(self, lineup: dict) -> dict:
        sorted_positions = ["qb", "rb1", "rb2", "wr1", "wr2", "wr3", "te", "flex", "dst"]
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
