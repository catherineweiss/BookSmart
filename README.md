# BookSmart

BookSmart was created to help readers and librarians understand patterns and trends in book borrowing, book buying, and popularity. The web application aggregates data on book sales, library checkouts, and reader reviews/ratings from the New York Times Bestseller List API, the Seattle Public Library System, and Goodreads API, respectively. We created five tools specifically for readers:

* Book Background: a one-stop resource to get a multi-faceted view of a user-selected title.
* Book Recommender: a recommendation service based on the genre and reader ratings.
* Great Books You’ve Never Heard Of: find popular non-bestselling books.
* Bestsellers: finds the all-time best selling book titles for a user-selected genre.
* Favorites: every title that appears in a search on Book Background has the option of being added to a Favorites page. Favorites can then be viewed on the corresponding tab from the Reader Dashboard.

We created four tools specifically for librarians, as well as provided access to the Bestsellers feature.

* Inventory Manager: search by date for titles and inventory on the most checked-out books.
* Borrowing Trends: a graphical visualization of library checkout activity and bestseller rankings.
* Book Display Planner: search for titles by bestselling authors in a provided genre.
* What People Are Not Reading: search by date for the least checked-out titles.

## Clone and Run

### Setup
1. Ensure you have installed the requisite Oracle binaries for `node-oracledb`. Instructions are linked from the package's [GitHub page](https://github.com/oracle/node-oracledb#node-oracledb-version-41).
2. Create a `db-config.js` file in `booksmart/api`. It should use the following format:

```
module.exports = {
  user: <username>,
  password: <password>,
  connectString: <endpoint>
};
```

### Running the application
1. Clone the repository.
2. Open two terminal tabs.
3. In the first terminal tab (the "api" tab), navigate into the booksmart-app/api directory. Run `npm install`.
4. In the second terminal tab (the "client" tab), navigate into the booksmart-app/client directory. Run `npm install`.
5. In the "api" tab, run `nodemon api`.
In the "client" tab, run `npm start` to start the development server.
