import cx_Oracle
import csv
import os

# Oracle connection
connection_string = "booksmart_user/booksmart_user_2019@booksmrt.cdttst4n9hrp.us-east-1.rds.amazonaws.com:1521/booksmrt"
con = cx_Oracle.connect(connection_string)
cur = con.cursor()

# Constants
directory = os.fsencode("library_book")
fields = ['bib_num', 'title', 'item_type', 'item_collection', 'item_count']

# Iterate across files in folder
for file in os.listdir(directory):
     filename = os.fsdecode(file)
     if filename.endswith(".csv"):
         output_filename = filename + "_output.txt"
         f = open(output_filename, 'w')

        # Across each file
         with open("library_book/LibraryBook_FinalPart.csv", "r") as csv_file:
             csv_reader = csv.DictReader(csv_file, fieldnames=fields, delimiter=',')
             for lines in csv_reader:
                # try:
                     lines['bib_num'] = str(lines['bib_num'].encode('utf-8').strip())
                     lines['title'] = lines['title'].encode('utf-8').strip()
                     lines['item_type'] = lines['item_type'].encode('utf-8').strip()
                     lines['item_collection'] = lines['item_collection'].encode('utf-8').strip()
                     lines['item_count'] = lines['item_count'].encode('utf-8').strip()
                     print("Inserting " + lines['bib_num'])
                     cur.execute(
                         "insert into LibraryBook (bib_num, title, item_type, item_collection, item_count) values (:1, :2, :3, :4, :5)",
                         (lines['bib_num'], lines['title'], lines['item_type'], lines['item_collection'], lines['item_count']))
                # except:
                    # print("An exception occured")
     else:
         continue

cur.close()
con.commit()
con.close()