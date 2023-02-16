import datetime

week_dict = {
	2012: {
		'start': {
			'day': 5,
			'month': 9
		},
		'stop': {
			'day': 30,
			'month': 12
		}
	},
	2013: {
		'start': {
			'day': 5,
			'month': 9
		},
		'stop': {
			'day': 29,
			'month': 12
		}
	},
	2014: {
		'start': {
			'day': 4,
			'month': 9
		},
		'stop': {
			'day': 28,
			'month': 12
		}
	},
	2015: {
		'start': {
			'day': 10,
			'month': 9
		},
		'stop': {
			'day': 3,
			'month': 1
		}
	},
	2016: {
		'start': {
			'day': 8,
			'month': 9
		},
		'stop': {
			'day': 1,
			'month': 1,
		}
	},
	2017: {
		'start': {
			'day': 7,
			'month': 9
		},
		'stop': {
			'day': 31,
			'month': 12
		}
	},
	2018: {
		'start': {
			'day': 6,
			'month': 9
		},
		'stop': {
			'day': 30,
			'month': 12
		}
	},
	2019: {
		'start': {
			'day': 5,
			'month': 9
		},
		'stop': {
			'day': 29,
			'month': 12
		}
	},
	2020: {
		'start': {
			'day': 10,
			'month': 9
		},
		'stop': {
			'day': 3,
			'month': 1
		}
	},
	2021: {
		'start': {
			'day': 8,
			'month': 9
		},
		'stop': {
			'day': 9,
			'month': 1
		}
	},
	2022: {
		'start': {
			'day': 8,
			'month': 9
		},
		'stop': {
			'day': 1,
			'month': 9
		}
	}
}

days_of_months = {
	8: 31,
	9: 30,
	10: 31,
	11: 30,
	12: 31,
	1: 31
}

# parses date in the text form "year/month/day"
def parseDate(date: str):
	date_split = date.split('/')
	year = int(date_split[0])
	month = int(date_split[1])
	day = int(date_split[2])
	if year < 2012 or year > 2022:
		return -1

	return getWeek(year, month, day)


def parseDraftGroupDateString(date_string: str):
	split_date = date_string.split("T")
	temp = datetime.datetime.strptime(split_date[0], "%Y-%m-%d")
	year = temp.year
	month = temp.month
	day = temp.day

	season_year = getYear(year=year, month=month, day=day)
	season_week = getWeek(year=year, month=month, day=day)

	return {"year": season_year, "week": season_week}

# TODO make this able to handle preseason and offseason
def getWeek(year, month, day):
	lineup_date = datetime.date(year, month, day)

	start = week_dict[year - 1 if month < 3 else year]['start']
	stop = week_dict[year - 1 if month < 3 else year]['stop']
	start_date = datetime.date(year - 1 if month < 3 else year, start['month'], start['day'])
	stop_date = datetime.date(year + 1 if stop['month'] <= 3 else year, stop['month'], stop['day'])
	
	if lineup_date < start_date:
		return -1

	day_count = lineup_date - start_date
	result = -(-day_count.days // 7)
	if result > 17 and year < 2022 or result > 18 and year > 2021:
		return -1

	return result


# TODO make this more specific to whatever the season start is
def getYear(year, month, day):
	if month < 8:
		return year - 1
	return year

def getCurrentWeek():
	today = datetime.date.today()

	schedule_week = getWeek(today.year, today.month, today.day)
	if schedule_week == -1: 
		return -1
	
	schedule_year = getYear(today.year, today.month, today.day)
	return { "week": schedule_week, "year": schedule_year }

	

	