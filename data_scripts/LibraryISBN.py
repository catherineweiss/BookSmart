from csv import reader, writer

# Open input file
input = list(reader(open("library_isbn_input.csv", "r"), delimiter=","))
# Open output file
output = writer(open("library_isbn_output.csv", "w"), delimiter=",")

# For each row in input, write to output as separate rows
for row in input:
    bib_num = row[0]
    isbns = row[1]
    if isbns:
        isbn_list = isbns.split(", ")
        for isbn in isbn_list:
            if len(isbn) is 13:
                isbn_type = "ISBN13"
            else:
                isbn_type = "ISBN10"
            # Create a row per ISBN
            row = []
            row.append(isbn)
            row.append(isbn_type)
            row.append(bib_num)

            # Write row to CSV
            output.writerow(row)