from .yahoo_scoring import yahoo_scoring
from .draftkings_scoring import draftkings_scoring
from .fanduel_scoring import fanduel_scoring

SCORING = {
    "fanduel": fanduel_scoring,
    "draftkings": draftkings_scoring,
    "yahoo": yahoo_scoring
}

def get_score(site, stats):
    scoring = SCORING.get(site, None)
    if not scoring:
        print("Invalid site for scoring.")
        return None
    points = 0.0
    # standard categories are scored as number of stats times score per stat 
    for category in scoring.values():
        for key, value in category.get("standard", {}).items():
            if stats.get(key):
                points += stats.get(key) * value
        # range categories are given a constant value depending on what range they fall into
        for key, _ranges in category.get("range", {}).items():
            if stats.get(key):
                for _range in _ranges:
                    if is_in_range(stats.get(key), _range["lower"], _range["upper"]):
                        points += _range["points"]
    return round(points, 2)

def is_in_range(stat: int, lower: int, upper: int) -> bool:
    if lower is None and upper is None:
        return True
    if lower is None and stat <= upper:
        return True
    if upper is None and stat >= lower:
        return True
    if stat >= lower and stat <= upper:
        return True
    return False
