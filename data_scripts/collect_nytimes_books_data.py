from datetime import date, timedelta
import json
import os
import pandas as pd
from pandas.io.json import json_normalize
import requests
import time

api_key = os.environ['NYTIMES_API_KEY']

def get_list_names(text_file):
    with open(text_file, 'r') as file:
        list_names = [name.strip() for name in file.readlines()]

    list_names = ["-".join(name.lower().split()) for name in list_names]

    return list_names

def get_data_from_list(lst, start_date, end_date):
    print(lst)
    listname = "_".join(lst.split("-"))
    datapath = f"nytimes_data/nytimes_{listname}.csv"
    if os.path.exists(datapath):
        return
    data = []
    date = start_date
    while date <= end_date:
        print(date)
        # sleep between calls to avoid hitting rate limit (https://developer.nytimes.com/faq#a11)
        time.sleep(6)
        try:
            url = f'https://api.nytimes.com/svc/books/v3/lists/{str(date)}/{lst}.json?&api-key={api_key}'
            r = requests.get(url)
            results = r.json()['results']
            bestsellers_date = results['bestsellers_date']
            results = results['books']
            for r in results:
                d = {**r, 'bestsellers_date': bestsellers_date}
                data.append(d)
            date = date + timedelta(days=7)
        except Exception as e:
            if r.status_code == 429:
                print(f"Status code = {r.status_code}")
                time.sleep(61)
                continue
            elif r.status_code == 404:
                print(f"{r.status_code} : No data found for {date}")
                date = date + timedelta(days=7)
    print("Done!")

    data = json_normalize(data)
    data.to_csv(datapath, index=False)

def get_all_list_names():
    try:
        url = f'https://api.nytimes.com/svc/books/v3/lists/names.json?&api-key={api_key}'
        r = requests.get(url)
        bestsellers_lists_json = r.json()['results']
        bestsellers_lists = [lst['list_name'] for lst in bestsellers_lists_json]

        with open('all_bestseller_list_names.txt', 'w') as f:
            for lst in bestsellers_lists:
                f.write(f'{lst}\n')
    except Exception as e:
        print(e)

def get_data_from_all_lists():
    list_names = get_list_names('all_bestseller_list_names.txt')

    start_date = date(year=2008, month=6, day=8)
    end_date = date(year=2019, month=10, day=6)

    for lst in list_names:
        get_data_from_list(lst, start_date, end_date)

def update_list_with_name(list_name):
    name = "_".join(list_name.lower().split())
    name = name.replace("-", "_")
    datapath = f"nytimes_data/nytimes_{name}.csv"

    df = pd.read_csv(datapath)
    df["list_name"] = list_name
    df.to_csv(datapath, index=False)

def update_all_lists_with_names(list_names_file='all_bestseller_list_names.txt'):
    with open(list_names_file, 'r') as file:
        list_names = [name.strip() for name in file.readlines()]
    for i, name in enumerate(list_names):
        update_list_with_name(name)
    print(f"{i+1} lists successfully processed!")
