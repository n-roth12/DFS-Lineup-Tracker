draftkings_scoring = {
	"offense": {
        "standard": {
            "passing_touchdowns": 4,
            "passing_yards": 0.04,
            "interceptions": -1,
            "rushing_touchdowns": 6,
            "rushing_yards": 0.1,
            "recieving_touchdowns": 6,
            "recieving_yards": 0.1,
            "receptions": 1,
            "return_touchdowns": 6,
            "fumbles_lost": -1,
            "passing_2point_conversions": 2,
            "rushing_2point_conversions": 2,
            "recieving_2point_conversions": 2,
            "fumble_recovery_touchdown": 6 
        },
        "range": {
            "passing_yards": [{
                "lower": 300,
                "upper": None,
                "points": 3
            }],
            "rushing_yards": [{
                "lower": 100,
                "upper": None,
                "points": 3
            }],
            "receiving_yards": [{
                "lower": 100,
                "upper": None,
                "points": 3
            }]
        }
    },
    "defense": {
        "standard": {
            "sacks": 1,
            "interceptions": 2,
            "fumble_recoveries": 2,
            "return_touchdowns": 6,
            "interception_touchdowns": 6,
            "fumble_recovery_touchdowns": 6,
            "kick_return_touchdowns": 6,
            "safeties": 2,
            "blocks": 2,
            "2pt_conversions": 2 
        },
        "range": {
            "points_allowed": [
                {
                    "lower": None,
                    "upper": 0,
                    "points": 10
                },
                {
                    "lower": 1,
                    "upper": 6,
                    "points": 7
                },
                {
                    "lower": 7,
                    "upper": 13,
                    "points": 4
                },
                {
                    "lower": 14,
                    "upper": 20,
                    "points": 1
                },
                {
                    "lower": 21,
                    "upper": 27,
                    "points": 0
                },
                {
                    "lower": 28,
                    "upper": 34,
                    "points": -1
                },
                {
                    "lower": 35,
                    "upper": None,
                    "points": -4
                }
            ]
        }
    }
}