# This function reads CSVs in chunks and uploads them to the specified table 


import cx_Oracle
import csv
import os
from datetime import datetime

# Oracle connection
# Add the DB user credentials here
db_username = ""
db_password = ""
connection_string = db_username+"/"+db_password+"@booksmrt.cdttst4n9hrp.us-east-1.rds.amazonaws.com:1521/booksmrt"

# Constants
directory = os.fsencode("library_isbn")  # Name of the directory
fields = ['isbn', 'isbn_type', 'bib_num'] # Name of the fields in order

# Iterate across files in folder
for file in os.listdir(directory):
    con = cx_Oracle.connect(connection_string)
    cur = con.cursor()

    filename = os.fsdecode(file)
    if filename.endswith(".csv"):
        output_filename = "library_isbn/output/" + str(filename) + "_output.txt" # name of the output text file/ log file
        f = open(output_filename, 'w')

        dateTimeObj = datetime.now()
        print(dateTimeObj, file=f)

        # Across each file
        with open("library_isbn/" + str(filename), "r") as csv_file:
            csv_reader = csv.DictReader(csv_file, fieldnames=fields, delimiter=',')
            for lines in csv_reader:
                try:
                    print(filename + ": Inserting " + lines['isbn'] + "," + lines['isbn_type'] + "," + lines['bib_num'],
                          file=f)

                    # Add your insert statement here
                    cur.execute(
                        "insert into LibraryISBN (isbn, isbn_type, bib_num) values (:1, :2, :3)",
                        (lines['isbn'], lines['isbn_type'], lines['bib_num']))
                except:
                    print("An exception occured", file=f)
        dateTimeObj = datetime.now()
        print(dateTimeObj, file=f)

    cur.close()
    con.commit()
    con.close()

