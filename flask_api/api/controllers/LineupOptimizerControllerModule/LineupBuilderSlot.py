from LineupOptimizerControllerModule.allowed_positions import flex_positions_dict

class LineupBuilderSlot:

    # you would pass title="QB" or title="WR2" and it is optional to pass eligible_positions
    def __init__(self, title: str, site: str, eligible_positions = None, eligible_teams = None, max_salary = None):
        self.title = title
        self.site = site
        if not eligible_positions or not len(eligible_positions):
            self.default_eligible_position(title)
        self.eligible_teams = eligible_teams
        self.max_salary = max_salary

    def default_eligible_position(self, title: str):
        if title != "FLEX":
            self.eligible_positions = ["".join(filter(lambda x: x.isalpha(), title))]
        else:
            self.eligible_positions = flex_positions_dict[self.site][title]

    def set_eligible_teams(self, eligible_teams: list):
        self.eligible_teams = eligible_teams

    def set_eligible_positions(self, eligible_positions: list):
        self.eligible_positions = eligible_positions

    def set_max_salary(self, max_salary: int):
        self.max_salary = max_salary
