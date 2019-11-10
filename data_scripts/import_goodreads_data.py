import csv
import pandas as pd
import os


def get_headers(file):
    with open(file, "r") as f:
        for i, row in enumerate(f):
            if i == 0:
                headers = row
                break
    headers = headers.strip().split(",")
    return headers


def create_author_key(author):
    author = author.lower()
    author = author.replace(" and ", "")
    author = author.replace(" with ", "")
    author = author.replace(" & ", "")
    author = author.replace(" drawings ", "")
    author = author.replace(" photography ", "")
    author = author.replace(" by ", " ")

    key = f"_{author[:4]}_{author[-4:]}"
    return key


def author_file(infile, outfile, headers):
    df = pd.read_csv(infile)
    all_authors = set()
    for a in headers:
        authors = list(df[a].dropna())
        all_authors.update(authors)

    author_entries = []
    for author in all_authors:
        key = create_author_key(author)
        author_entries.append([key, author])

    output = csv.writer(open(outfile, "w"), delimiter=",")
    output.writerow(["id", "name"])

    for entry in author_entries:
        output.writerow(entry)


def books_file(infile, outfile):
    book_headers = [
        "goodreads_id",
        "description",
        "title",
        "image_url",
        "small_image_url",
        "publication_year",
        "average_rating",
        "ratings_count",
    ]
    df = pd.read_csv(infile)
    book_df = df[book_headers]
    book_df.to_csv(outfile, index=False)


def isbn_file(infile, outfile):
    isbn_rows = []
    with open(infile, "r") as rf:
        reader = csv.DictReader(rf)
        for row in reader:
            goodreads_id = row["goodreads_id"]
            isbn10 = row["isbn"]
            isbn13 = row["isbn13"]
            isbn_rows.append([goodreads_id, isbn10, "ISBN10"])
            isbn_rows.append([goodreads_id, isbn13, "ISBN13"])

    with open(outfile, "w") as wf:
        headers = ["goodreads_id", "isbn", "isbn_type"]
        writer = csv.DictWriter(wf, fieldnames=headers)
        writer.writeheader()
        for row in isbn_rows:
            r = {"goodreads_id": row[0], "isbn": row[1], "isbn_type": row[2]}
            writer.writerow(r)


def writtenby_file(infile, outfile, author_headers):
    writtenby_rows = []
    with open(infile, "r") as rf:
        reader = csv.DictReader(rf)
        for row in reader:
            goodreads_id = row["goodreads_id"]
            for author_id in author_headers:
                author = row[author_id]
                if author:
                    key = create_author_key(author)
                    writtenby_rows.append([goodreads_id, key])

    with open(outfile, "w") as wf:
        headers = ["goodreads_id", "author_id"]
        writer = csv.DictWriter(wf, fieldnames=headers)
        for row in writtenby_rows:
            r = {"goodreads_id": row[0], "author_id": row[1]}
            writer.writerow(r)


def split_file(infile, output_dir, headers):
    file = infile.split("/")
    file = file[1].split("_")
    basename = "_".join(file[4:])

    # author file
    author_outfile = f"{output_dir}/authors/authors_goodreads_{basename}"
    author_headers = [h for h in headers if h.startswith("author_")]
    author_file(infile, author_outfile, author_headers)

    # books file
    books_outfile = f"{output_dir}/books/books_goodreads_{basename}"
    books_file(infile, books_outfile)

    # isbn file
    isbn_outfile = f"{output_dir}/isbns/isbns_goodreads_{basename}"
    isbn_file(infile, isbn_outfile)

    # writtenby file
    writtenby_outfile = f"{output_dir}/writtenby/writtenby_goodreads_{basename}"
    writtenby_file(infile, writtenby_outfile, author_headers)


def split_all_files(input_dir, output_dir):
    for i, file in enumerate(os.listdir(input_dir)):
        if i < 10:
            if file.endswith(".csv"):
                path = f"{input_dir}/{file}"
                headers = get_headers(path)
                split_file(path, output_dir, headers)


if __name__ == "__main__":
    goodreads_data_dir = "cleaned_goodreads_data"
    goodreads_imports_dir = "goodreads_imports"
    split_all_files(goodreads_data_dir, goodreads_imports_dir)
