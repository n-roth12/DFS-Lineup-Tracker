import random

class LineupOptimizerController:

    def __init__(self) -> None:
        pass

    def generate_lineup(self, existing_lineup, lineup_positions, eligible_flex_positions, 
        salaryCap, draftables):

        flex_position = self.choose_flex_position(eligible_flex_positions)
        weighted_cost_map = {"QB": [], "RB": [], "WR": [], "TE": [], "DST": []}

        for draftable in draftables["draftables"]:
            fantasy_points_per_game = 0.0 if draftable["fppg"] == "-" else float(draftable["fppg"]) 
            value = fantasy_points_per_game / int(draftable["salary"])
            draftable["value"] = value
            weighted_cost_map[draftable["position"]].append(draftable)

        for position in weighted_cost_map.keys():
            weighted_cost_map[position].sort(key=lambda player : player["value"], reverse=True)

        best_lineup_proj = 0
        best_lineup = None
        best_lineup_salary = 0
        count = 0

        for i in range(100000):
            lineup = []
            lineup_ids = set()
            salary_sum = 0
            proj_total = 0
            for position in lineup_positions:
                match = False
                if position == "FLEX":
                    position = flex_position

                for j in range(10):
                    player_index_to_use = random.randint(0, min(15, len(weighted_cost_map[position])))
                    if weighted_cost_map[position][player_index_to_use]["playerSiteId"] not in lineup_ids \
                            and weighted_cost_map[position][player_index_to_use]["status"] not in ["IR", "O"]:
                        salary_sum += weighted_cost_map[position][player_index_to_use]["salary"]
                        proj_total += float(weighted_cost_map[position][player_index_to_use]["fppg"]) if weighted_cost_map[position][player_index_to_use]["fppg"] != "-" else 0

                        lineup.append(weighted_cost_map[position][player_index_to_use])
                        lineup_ids.add(weighted_cost_map[position][player_index_to_use]["playerSiteId"])
                        break
            
            if len(lineup) == len(lineup_positions) and salary_sum <= 60000:
                if proj_total > best_lineup_proj:
                    best_lineup_proj = proj_total
                    best_lineup = lineup
                    best_lineup_salary = salary_sum
                    count += 1
            else:
                continue

        result = []
        converted_lineup_positions = self.convert_lineup_positions(lineup_positions)
        for k in range(len(lineup)):
            result.append({"position": converted_lineup_positions[k].lower(), "player": best_lineup[k]})
        self.add_sort_order_to_lineup(result)

        return result


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


    # converts from the format:
    # ["QB", "RB", "RB", "WR", "WR", "WR", "TE", "FLEX", "DST"]
    # to =>
    # ["QB", "RB1", "RB2", "WR1", "WR2", "WR3", "TE", "FLEX", "DST"]
    # this should be an interview question
    # would be quicker to write and easier to understand with a hash map,
    # but not as efficient
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
