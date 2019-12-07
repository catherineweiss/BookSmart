from bs4 import BeautifulSoup
import collections
import csv
import ftfy
import json
import logging
import operator
import os
import pandas as pd
from pandas.io.json import json_normalize
import requests
import time
from tqdm import tqdm
import unicodedata
import xmltodict

api_key = os.environ["GOODREADS_API_KEY"]


def read_isbns_from_file(filename):
    print(f"Fetching ISBNS...")
    isbns = set()
    with open(filename, "r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            isbn10 = row["primary_isbn10"]
            if isbn10[-2:] == ".0":
                isbn10 = isbn10[:-2]
            isbn13 = row["primary_isbn13"]
            if isbn13[-2:] == ".0":
                isbn13 = isbn13[:-2]
            isbns.add((isbn13, isbn10))
    isbns = list(isbns)
    return isbns


def read_column_from_file(filename, col_name):
    data = set()
    with open(filename, "r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            d = row[col_name]
            data.add(d)
    data = list(data)
    return data


def get_goodreads_book_id_from_isbn(isbn):
    base_url = "https://www.goodreads.com/book/isbn_to_id"
    try:
        url = f"{base_url}/{isbn}?key={api_key}"
        r = requests.get(url)
        if r.status_code == 200:
            return r.text
        if r.status_code == 404:
            return None
    except Exception as e:
        print(e)


def get_multiple_goodreads_book_ids_from_isbn_list(isbns, nytimes_file):
    print(f"Fetching Goodreads data for ISBNs...")
    goodreads_ids = set()
    for isbn13, isbn10 in tqdm(isbns):
        # must avoid requesting any method more than once per second
        # see Terms & Conditions: https://www.goodreads.com/api/terms
        time.sleep(2)
        id = get_goodreads_book_id_from_isbn(isbn13)
        if id is not None:
            goodreads_ids.add(id)
        else:
            if isbn10 != "":
                time.sleep(2)
                id = get_goodreads_book_id_from_isbn(isbn10)
                if id is not None:
                    goodreads_ids.add(id)
                    continue
            msg = f"No result for isbn {(isbn13, isbn10)}"
            logging.info(msg)

    goodreads_ids = list(goodreads_ids)

    export_goodreads_ids(goodreads_ids, nytimes_file)

    return goodreads_ids


def get_book_info_from_id(goodreads_id):
    goodreads_base_url = "https://www.goodreads.com/book/show/"
    try:
        url = f"{goodreads_base_url}{goodreads_id}?key={api_key}"
        r = requests.get(url)
        if r.status_code == 200:
            xml_data = r.text
            return xml_data
        else:
            print(f"Skipping {goodreads_id} because status code = {r.status_code}")
            return None
    except Exception as e:
        print(e)


def parse_book_info_from_xml(xml):
    doc = xmltodict.parse(xml)
    book = doc["GoodreadsResponse"]["book"]
    data = {}
    data["goodreads_id"] = book["id"]
    data["title"] = book["title"]
    data["isbn"] = book["isbn"]
    data["isbn13"] = book["isbn13"]
    data["image_url"] = book["image_url"]
    data["small_image_url"] = book["small_image_url"]
    data["description"] = book["description"]
    data["average_rating"] = book["average_rating"]

    if "#text" in book["work"]["original_publication_year"]:
        data["publication_year"] = book["work"]["original_publication_year"]["#text"]
    else:
        data["publication_year"] = None

    if "#text" in book["work"]["ratings_count"]:
        data["ratings_count"] = book["work"]["ratings_count"]["#text"]
    else:
        data["ratings_count"] = None

    authors = book["authors"]["author"]
    if isinstance(authors, list):
        for i, a in enumerate(authors):
            data[f"author_{i}"] = a["name"]
    if isinstance(authors, collections.OrderedDict):
        data["author_0"] = authors["name"]

    return data


def convert_dict_to_dataframe(d):
    df = json_normalize(json.loads(json.dumps(d)))
    return df


def construct_dataset_from_goodreads_data(goodreads_ids):
    print(f"Building dataset...")
    data_dicts = []
    for id in tqdm(goodreads_ids):
        # must avoid requesting any method more than once per second
        # see Terms & Conditions: https://www.goodreads.com/api/terms
        time.sleep(2)
        xml = get_book_info_from_id(id)
        if xml is not None:
            data = parse_book_info_from_xml(xml)
            data_dicts.append(data)

    df = pd.DataFrame.from_dict(data_dicts)
    return df


def export_goodreads_ids(ids, nytimes_file):
    outfile = nytimes_file.split("/")[1]
    outfile = f"goodreads_data/goodreads_ids/goodreads_ids_{outfile}"
    if os.path.exists(outfile):
        # return
        mode = "a"
        write_header = False
    else:
        mode = "w"
        write_header = True
    with open(outfile, mode) as f:
        if write_header:
            header = "goodreads_ids"
            f.write(f"{header}\n")
        for id in ids:
            f.write(f"{id}\n")
    print(f"Goodreads IDs exported to {outfile}")


def get_goodreads_book_data(filename):
    outfile = "_".join(filename.split("/")[2].split("_")[2:])
    outfile = f"goodreads_data/goodreads_data_{outfile}"
    print(f"Generating {outfile}...")
    if os.path.exists(outfile):
        print(f"{outfile} already exists")
        return
    goodreads_ids = read_column_from_file(filename, "goodreads_ids")
    df = construct_dataset_from_goodreads_data(goodreads_ids)
    df.to_csv(outfile, index=False)
    print(f"Goodreads data exported to {outfile}")


def write_raw_goodreads_data_to_json(data, outfile):
    with open(outfile, "w") as o:
        json.dump(data, o)


def check_goodreads_files():
    for filename in os.listdir("goodreads_data/goodreads_ids"):
        if filename.endswith(".csv"):
            split = filename.split("_")
            nytimes_filename = "_".join(split[2:])
            ids = read_goodreads_ids_from_file(
                f"goodreads_data/goodreads_ids/{filename}"
            )
            try:
                isbns = read_column_from_file(
                    f"nytimes_data/{nytimes_filename}", "primary_isbn13"
                )
            except FileNotFoundError:
                print(f"NOT FOUND: {nytimes_filename}")
            if len(set(ids)) == len(set(isbns)):
                pass
                # print(f"{nytimes_filename} IS DONE")
            else:
                print(f"Check out {filename}")


def save_all_goodreads_data():
    logfile = "logfiles/goodreads_data.log"
    logging.basicConfig(filename=logfile, filemode="a", level=logging.DEBUG)
    goodreads_dir = "goodreads_data/goodreads_ids"
    for filename in os.listdir(goodreads_dir):
        if filename.endswith(".csv"):
            f = f"{goodreads_dir}/{filename}"
            get_goodreads_book_data(f)


def save_all_goodreads_ids():
    logfile = "logfiles/goodreads.log"
    logging.basicConfig(filename=logfile, filemode="a", level=logging.DEBUG)
    for filename in os.listdir("nytimes_data"):
        if filename.endswith(".csv"):
            outfile = f"goodreads_data/goodreads_ids/goodreads_ids_{filename}"
            if os.path.exists(outfile):
                continue
            else:
                logging.info("========================================")
                logging.info(filename)
                f = f"nytimes_data/{filename}"
                isbns = read_isbns_from_file(f)
                get_multiple_goodreads_book_ids_from_isbn_list(isbns, f)


def clean_html(description):
    soup = BeautifulSoup(description, "html.parser")
    text = soup.get_text()
    # text = unicodedata.normalize('NFKC', text).replace("\n", "")
    text = ftfy.fix_text(text).replace("\n", "")
    return text


def clean_dataset(infile, outfile):
    print(f"Infile: {infile}")
    df = pd.read_csv(infile)
    df["isbn13"] = df["isbn13"].astype(str)
    df["description"] = df["description"].astype(str)
    descriptions = list(df["description"])
    descriptions = [clean_html(d) for d in descriptions]
    descriptions = pd.Series(descriptions)
    df["description"] = descriptions
    df.to_csv(outfile, index=False)
    print(f"Outfile: {outfile}")


def clean_all_data():
    indir = "goodreads_data"
    outdir = "cleaned_goodreads_data"
    for filename in os.listdir(indir):
        if filename.endswith(".csv"):
            infile = f"{indir}/{filename}"
            outfile = f"{outdir}/cleaned_{filename}"
            clean_dataset(infile, outfile)


def stringify(col, infile, outfile):
    df = pd.read_csv(infile)
    df[col] = df[col].astype(str)
    pd.to_csv(outfile)
