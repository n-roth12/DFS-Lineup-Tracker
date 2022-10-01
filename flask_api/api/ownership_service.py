import requests
import time
import json
from bs4 import BeautifulSoup

def scrape_ownership():
    url = "https://www.pff.com/dfs/ownership"

    headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'}
    for i in range(100):
        try:
            results = requests.get(url, headers=headers)
        except requests.exceptions.ConnectionError:
            time.sleep(1)
        else:
            break
    else:
        print(f'Unable to scrape ownership projections. Please try again later.')

    soup = BeautifulSoup(results.text, 'html.parser')
    ownership_containers = soup.find_all('div', {'class': 'dfs-ownership'})

    result = {}

    fanduel_tbody = ownership_containers[0].find('tbody')
    fanduel_rows = fanduel_tbody.find_all('tr')
    for row in fanduel_rows:
        row_data = row.find_all('td')
        result[row_data[1].text] = {}
        result[row_data[1].text]["fanduel"] = {
            "id": row_data[0].text,
            "team": row_data[2].text,
            "opponent": row_data[3].text,
            "position": row_data[4].text,
            "salary": row_data[5].text,
            "ownership_projection": row_data[6].text
        }

    draftkings_tbody = ownership_containers[1].find('tbody')
    draftkings_rows = draftkings_tbody.find_all('tr')

    for row in draftkings_rows:
        row_data = row.find_all('td')
        if row_data[1].text not in result.keys():
            result[row_data[1].text] = {}
        result[row_data[1].text]["draftkings"] = {
            "id": row_data[0].text,
            "team": row_data[2].text,
            "opponent": row_data[3].text,
            "position": row_data[4].text,
            "salary": row_data[5].text,
            "ownership_projection": row_data[6].text
        }

    print(result)
    