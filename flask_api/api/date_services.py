import datetime

def parseDate(date):
	date_split = date.split('/')
	year = int(date_split[0])
	month = int(date_split[1])
	day = int(date_split[2])
	if year < 2012 or year > 2022:
		return -1

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