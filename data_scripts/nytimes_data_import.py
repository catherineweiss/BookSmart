import csv
import cx_Oracle
from datetime import datetime
import ftfy
import numpy as np
import os

# Oracle connection
# Add the DB user credentials here
DB_USERNAME = os.environ["DB_USERNAME"]
DB_PASSWORD = os.environ["DB_PASSWORD"]
ENDPOINT = "booksmrt.cdttst4n9hrp.us-east-1.rds.amazonaws.com:1521/booksmrt"
CONNECTION_STRING = f"{DB_USERNAME}/{DB_PASSWORD}@{ENDPOINT}"

MONTHS = {
    "01": "JAN",
    "02": "FEB",
    "03": "MAR",
    "04": "APR",
    "05": "MAY",
    "06": "JUN",
    "07": "JUL",
    "08": "AUG",
    "09": "SEP",
    "10": "OCT",
    "11": "NOV",
    "12": "DEC",
}

def split_file(infile_dir, infile, outfile_dir, header, n=50):
    input = list(csv.reader(open(f"{infile_dir}/{infile}", "r", encoding="latin-1"), delimiter=","))
    splits = np.array_split(input, n)

    for i, split in enumerate(splits):
        outfile = f"{outfile_dir}/{i}_{infile}"
        print(outfile)
        output = csv.writer(open(outfile, "w"))
        output.writerow(header)
        for row in split:
            row = list(row)
            print(row)
            output.writerow(row)

def insert_book_files():

    # Constants
    directory = os.fsencode("nytimes/book")  # Name of the directory

    # Name of the fields in order
    fields = [
        "ISBN10",
        "ISBN13",
        "DESCRIPTION",
        "TITLE",
        "BOOK_IMAGE",
        "BOOK_IMAGE_WIDTH",
        "BOOK_IMAGE_HEIGHT",
        "AMAZON_PRODUCT_URL",
        "AGE_GROUP"
    ]

    # Iterate across files in folder
    for file in os.listdir(directory):
        con = cx_Oracle.connect(CONNECTION_STRING)
        cur = con.cursor()

        filename = os.fsdecode(file)
        if filename.endswith(".csv"):
            name = filename.replace(".csv", "")
            # name of the output text file/ log file
            output_filename = f"nytimes/output/book/{name}_output.txt"
            f = open(output_filename, "w")

            dateTimeObj = datetime.now()
            print(dateTimeObj, file=f)

            # Across each file
            with open(f"nytimes/book/{filename}", "r") as csv_file:
                reader = csv.DictReader(csv_file, delimiter="|")
                for row in reader:
                    isbn10 = row["isbn10"]
                    isbn10 = f"'{isbn10}'"
                    isbn13 = row["isbn13"]
                    isbn13 = f"'{isbn13}'"

                    description = row["description"]
                    description = ftfy.fix_text(description)
                    if "'" in description:
                        description = description.replace("'", "''")
                    description = f"'{description}'"

                    title = row["title"]
                    if "'" in title:
                        title = title.replace("'", "''")
                    title = f"'{title}'"

                    book_image = row["book_image"]
                    book_image = f"'{book_image}'"

                    book_image_width = row["book_image_width"]
                    book_image_height = row["book_image_height"]

                    amazon_product_url = row["amazon_product_url"]
                    amazon_product_url = f"'{amazon_product_url}'"

                    age_group = row["age_group"]
                    if age_group == "":
                        age_group = "'Unknown'"

                    values = [
                        isbn10,
                        isbn13,
                        description,
                        title,
                        book_image,
                        book_image_width,
                        book_image_height,
                        amazon_product_url,
                        age_group
                    ]

                    try:
                        print(f"{filename}: Inserting {', '.join(values)}", file=f)

                        # Add your insert statement here
                        query_table = "INSERT INTO NYT_BOOK"
                        query_fields = f" ({', '.join(fields)})"
                        query_values = f" VALUES ({', '.join(values)})"
                        query = query_table + query_fields + query_values
                        print(query)
                        cur.execute(query)

                    except Exception as e:
                        print(f"{e}", file=f)
            dateTimeObj = datetime.now()
            print(dateTimeObj, file=f)

        cur.close()
        con.commit()
        con.close()

def insert_bestseller_files():

    # Constants
    directory = os.fsencode("nytimes/bestseller")  # Name of the directory
    # Name of the fields in order
    fields = [
        "ENTRY_ID",
        "RANK",
        "RANK_LAST_WEEK",
        "WEEKS_ON_LIST",
        "BESTSELLERS_DATE",
        "LIST_NAME",
    ]

    # Iterate across files in folder
    for file in os.listdir(directory):
        con = cx_Oracle.connect(CONNECTION_STRING)
        cur = con.cursor()

        filename = os.fsdecode(file)
        if filename.endswith(".csv"):
            name = filename.replace(".csv", "")
            # name of the output text file/ log file
            output_filename = f"nytimes/output/{name}_output.txt"
            f = open(output_filename, "w")

            dateTimeObj = datetime.now()
            print(dateTimeObj, file=f)

            # Across each file
            with open(f"nytimes/bestseller/{filename}", "r") as csv_file:
                reader = csv.DictReader(csv_file)
                for row in reader:
                    entry_id = row["entry_id"]
                    rank = row["rank"]
                    rank_last_week = row["rank_last_week"]
                    weeks_on_list = row["weeks_on_list"]

                    bestsellers_date = row["bestsellers_date"].split("-")
                    year = bestsellers_date[0][2:]
                    month = MONTHS[bestsellers_date[1]]
                    day = bestsellers_date[2]
                    bestsellers_date = f"'{day}-{month}-{year}'"

                    list_name = row["list_name"]
                    list_name = f"'{list_name}'"

                    values = [
                        entry_id,
                        rank,
                        rank_last_week,
                        weeks_on_list,
                        bestsellers_date,
                        list_name,
                    ]

                    try:
                        print(f"{filename}: Inserting {', '.join(values)}", file=f)

                        # Add your insert statement here
                        query_start = (
                            f"INSERT INTO NYT_BESTSELLER ({', '.join(fields)})"
                        )
                        query_body = f"VALUES ({', '.join(values)})"
                        query = f"{query_start} {query_body}"
                        print(query)
                        cur.execute(query)
                    except Exception as e:
                        print(f"{e}", file=f)
            dateTimeObj = datetime.now()
            print(dateTimeObj, file=f)

        cur.close()
        con.commit()
        con.close()

def insert_booklist_file(directory_name, fields):
    directory = os.fsencode(directory_name)
    for file in os.listdir(directory):
        con = cx_Oracle.connect(CONNECTION_STRING)
        cur = con.cursor()

        filename = os.fsdecode(file)
        if filename.endswith(".csv"):
            name = filename.replace(".csv", "")
            # name of the output text file/ log file
            output_filename = f"nytimes/output/booklist/{name}_output.txt"
            f = open(output_filename, "w")

            dateTimeObj = datetime.now()
            print(dateTimeObj, file=f)

            # Across each file
            with open(f"{directory_name}/{filename}", "r") as csv_file:
                reader = csv.DictReader(csv_file)
                for row in reader:
                    entry_id = row["entry_id"]
                    isbn13 = row["isbn13"]
                    if isbn13.endswith(".0"):
                        isbn13 = isbn13[:-2]
                    isbn13 = f"'{isbn13}'"

                    values = [
                        entry_id,
                        isbn13
                    ]

                    try:
                        print(f"{filename}: Inserting {', '.join(values)}", file=f)

                        # Add your insert statement here
                        query_table = "INSERT INTO NYT_BOOK_LIST"
                        query_fields = f" ({', '.join(fields)})"
                        query_values = f" VALUES ({', '.join(values)})"
                        query = query_table + query_fields + query_values
                        print(query)
                        cur.execute(query)

                    except Exception as e:
                        print(f"{e}", file=f)
            dateTimeObj = datetime.now()
            print(dateTimeObj, file=f)

        cur.close()
        con.commit()
        con.close()

def insert_author_book_files():
    dir = "nytimes/authorbook"

    # Constants
    directory = os.fsencode(dir)  # Name of the directory

    # Name of the fields in order
    fields = [
        "AUTHOR_ID",
        "ISBN13"
    ]

    # Iterate across files in folder
    for file in os.listdir(directory):
        con = cx_Oracle.connect(CONNECTION_STRING)
        cur = con.cursor()

        filename = os.fsdecode(file)
        if filename.endswith(".csv"):
            name = filename.replace(".csv", "")
            # name of the output text file/ log file
            output_filename = f"nytimes/output/authorbook/{name}_output.txt"
            f = open(output_filename, "w")

            dateTimeObj = datetime.now()
            print(dateTimeObj, file=f)

            # Across each file
            with open(f"{dir}/{filename}", "r") as csv_file:
                reader = csv.DictReader(csv_file)
                for row in reader:

                    author_id = row["author_id"]
                    author_id = f"'{author_id}'"

                    isbn13 = row["isbn13"]
                    if isbn13.endswith(".0"):
                        isbn13 = isbn13[:-2]
                    isbn13 = f"'{isbn13}'"

                    values = [
                        author_id,
                        isbn13,
                    ]

                    try:
                        print(f"{filename}: Inserting {', '.join(values)}", file=f)

                        # Add your insert statement here
                        query_table = "INSERT INTO NYT_AUTHOR_BOOK2"
                        query_fields = f" ({', '.join(fields)})"
                        query_values = f" VALUES ({', '.join(values)})"
                        query = query_table + query_fields + query_values
                        print(query)
                        cur.execute(query)

                    except Exception as e:
                        print(f"{e}", file=f)
            dateTimeObj = datetime.now()
            print(dateTimeObj, file=f)

        cur.close()
        con.commit()
        con.close()

if __name__ == "__main__":
    insert_bestseller_files()

    insert_book_files()

    fields = ["ENTRY_ID", "ISBN13"]
    directory = "nytimes/booklist"
    insert_booklist_file(directory, fields)

    infile_dir = "cleaned_nytimes_data"
    infile = "NYTimesBestsellerFix.csv"
    outfile_dir = "nytimes/bestsellerfix"
    headers = [
        "author_id",
        "isbn13",
    ]
    split_file(infile_dir, infile, outfile_dir, headers)

    insert_author_book_files()
