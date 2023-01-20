from LineupSlot import LineupSlot
from allowed_positions import flex_positions_dict

class Lineup:

    def __init__(self, positions: list, players: list, site: str) -> None:
        if len(players) > len(positions):
            raise Exception("Cannot construct lineup: More players than lineup positions.")

        self.lineup = {}
        self.site = site

        for i in range(len(positions)):
            if i < len(players) - 1:
                self.lineup[positions[i]] = players[i]
            else:
                self.lineup[positions[i]] = {}

    def get_site(self):
        return self.site
        
    def get_lineup_as_list(self) -> list:
        return [player for player in self.lineup.values()]

    def get_lineup_as_dict(self) -> dict:
        return self.lineup

    def get_lineup_projected_points(self) -> float:
        points_sum = 0
        for player in self.lineup.values():
            if player != {}:
                player_data = player.get("player")
                if player_data:
                    points_sum += 0.0 if player_data.get("fppg") == "-" else float(player_data.get("fppg"))
                else:
                    points_sum += 0.0 if player.get("fppg") == "-" else float(player_data.get("fppg"))

        return points_sum

    def get_lineup_salary(self) -> int:
        salary_sum = 0
        for player in self.lineup.values():
            if player.get("salary"):
                salary_sum += player.get("salary")
        
        return salary_sum

    def get_player_ids(self) -> list:
        return [self.lineup.get(lineup_slot).get("player").get("playerSiteId") for lineup_slot in \
            list(self.lineup.keys()) if self.lineup.get(lineup_slot).get("player")]

    def get_empty_slots(self) -> list:
        return [position for position in self.lineup.keys() if self.is_slot_empty(position)]

    def has_empty_slots(self) -> bool:
        return len(self.get_empty_slots()) > 1
    
    def is_slot_empty(self, lineup_slot: str) -> bool:
        player = self.lineup.get(lineup_slot)
        if not player:
            return True
        return (len(player.keys()) < 1)

    def add_player_at_position(self, lineup_slot: str, player: dict) -> None:
        if self.is_position_eligible_for_slot(lineup_slot=lineup_slot, position=player.get("position")):
            self.lineup[lineup_slot] = player

    def is_position_eligible_for_slot(self, lineup_slot: str, position: str) -> bool:
        if lineup_slot in list(flex_positions_dict.get(self.site).keys()):
            return position in flex_positions_dict.get(self.site).get(lineup_slot)
        
        return "".join(filter(lambda x: x.isalpha(), lineup_slot)) == position