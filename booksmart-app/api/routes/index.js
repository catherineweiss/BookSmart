var express = require('express');
var router = express.Router();
var config = require('../db-config.js');

/**
 * AWS DynamoDB - NoSQL DB
 *
 */
var AWS = require('aws-sdk');
// Set the AWS configuration
AWS.config.loadFromPath('./config.json');
// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();

/**
 * In Memory Caching Middleware
 *
 */
var cache = require('memory-cache');
// configure cache middleware
let memCache = new cache.Cache();
let cacheMiddleware = (duration) => {
    return (req, res, next) => {
        let key =  '__express__' + req.originalUrl || req.url;
        let cacheContent = memCache.get(key);
        if(cacheContent){
            res.send( cacheContent );
        }else{
            res.sendResponse = res.send;
            res.send = (body) => {
                memCache.put(key,body,duration*1000);
                res.sendResponse(body);
            };
            next()
        }
    }
};

/**
 * Oracle DB - AWS RDS Instance
 * @type {OracleDb}
 */
const oracledb = require('oracledb');

async function closePool() {
  console.log('\nTerminating');
  try {
    await oracledb.getPool().close(10);
    console.log('Pool closed');
  } catch(err) {
    console.error(err.message);
  }
}

async function closePoolAndExit() {
  console.log('\nTerminating');
  try {
    // Get the pool from the pool cache and close it when no
    // connections are in use, or force it closed after 10 seconds
    // If this hangs, you may need DISABLE_OOB=ON in a sqlnet.ora file
    await oracledb.getPool().close(10);
    console.log('Pool closed');
    process.exit(0);
  } catch(err) {
    console.error(err.message);
    process.exit(1);
  }
}

process
  .once('SIGTERM', closePoolAndExit)
  .once('SIGINT',  closePoolAndExit);

/* ------------------------------------------------ */
/* ----- Routers to handle data requests ---------- */
/* ------------------------------------------------ */

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/**
 * Bestsellers
 */
router.get('/bestsellers/:list/:num', cacheMiddleware(3000), function(req, res, next) {
  const list = req.params.list;
  const num = req.params.num;

  async function init(list, num) {
    try {
      // Create a connection pool which will later be accessed via the
      // pool cache as the 'default' pool.
      await oracledb.createPool(config);
      console.log('Connection pool started');

      // Now the pool is running, it can be used
      const rows = await getBestsellers(list, num);
      // console.log(rows);
      return rows;

    } catch (err) {
      console.error('init() error: ' + err.message);
    } finally {
      await closePool();
    }
  };

    /**
     * Get list of best sellers, given list name and number of results to return
     * @param list
     * @param num
     * @returns {Promise<SQLResultSetRowList|number|HTMLCollectionOf<HTMLTableRowElement>|string>}
     */
  async function getBestsellers (list, num) {
    let conn;

    try {
      conn = await oracledb.getConnection();
      const query =
      `SELECT *
       FROM (
         SELECT title, description, isbn13, MAX(WEEKS_ON_LIST) as Weeks_On_List
         FROM (
           SELECT NB.WEEKS_ON_LIST, B.TITLE, B.DESCRIPTION, B.ISBN13
           FROM NYT_BESTSELLER NB, NYT_BOOK_LIST NBL, NYT_BOOK B
           WHERE LIST_NAME = :list
           AND NB.ENTRY_ID = NBL.ENTRY_ID
           AND B.ISBN13 = NBL.ISBN13
           ORDER BY WEEKS_ON_LIST DESC
         ) book
         GROUP BY title, description, isbn13
         ORDER BY Weeks_On_List DESC
      )
      WHERE ROWNUM <= :num`;

      const binds = [list, num];
      const options = { outFormat: oracledb.OUT_FORMAT_OBJECT };
      const result = await conn.execute(query, binds, options);

      console.log(result.rows);
      return result.rows;

    } catch (err) {
      console.error('Ouch!', err)
    } finally {
      if (conn) { // conn assignment worked, need to close
        try {
          await conn.close();
          console.log("Closing connection...");
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  init(list, num).then(result => res.json(result));

});

/**
 * Get list names for the best sellers
 */
router.get('/bestsellers/getlists', cacheMiddleware(3000), function(req, res, next) {

  async function init() {
    try {
      // Create a connection pool which will later be accessed via the
      // pool cache as the 'default' pool.
      await oracledb.createPool(config);
      console.log('Connection pool started');

      // Now the pool is running, it can be used
      const rows = await getNYTimesLists();
      // console.log(rows);
      return rows;

    } catch (err) {
      console.error('init() error: ' + err.message);
    } finally {
      await closePool();
    }
  };

    /**
     * Get List names from New York Times data
     * @returns {Promise<SQLResultSetRowList|number|HTMLCollectionOf<HTMLTableRowElement>|string>}
     */
  async function getNYTimesLists () {
    let conn;

    try {
      conn = await oracledb.getConnection();
      const query = "SELECT LIST_NAME FROM NYT_LIST ORDER BY LIST_NAME";
      const options = { outFormat: oracledb.OUT_FORMAT_OBJECT };
      const result = await conn.execute(query, [], options);

      console.log(result.rows);
      return result.rows;

    } catch (err) {
      console.error('Ouch!', err)
    } finally {
      if (conn) { // conn assignment worked, need to close
        try {
          await conn.close();
          console.log("Closing connection...");
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  init().then(result => res.json(result));

});


/**
 * Inventory Manager Feature
 */
router.get('/inventory/:start/:end/:num', cacheMiddleware(3000), function(req, res, next) {
    const start = req.params.start;
    const end = req.params.end;
    const num = req.params.num;

    console.log("Inventory params: "+start+", "+end+", "+num);

    async function init(start, end, num) {
        try {
            // Create a connection pool which will later be accessed via the
            // pool cache as the 'default' pool.
            await oracledb.createPool(config);
            console.log('Connection pool started');

            // Now the pool is running, it can be used
            const rows = await getInventory(start, end, num);
            // console.log(rows);
            return rows;

        } catch (err) {
            console.error('init() error: ' + err.message);
        } finally {
            await closePool();
        }
    };

/**
 * Get library inventory information based on Checkout Date range and number of results to return
 * @param startDate
 * @param endDate
 * @param num
 * @returns {Promise<SQLResultSetRowList|number|HTMLCollectionOf<HTMLTableRowElement>|string>}
 */
async function getInventory (startDate, endDate, num) {
        let conn;

        try {
            conn = await oracledb.getConnection();
            const query =
                `SELECT LB.bib_num, LB.title, LIC.genre_name as GENRE, LB.item_count, CC.checkout_count FROM
            LibraryBook LB, LibraryItemCode LIC,
            (
               SELECT *
               FROM (
                        SELECT LC2.bib_num, COUNT(LC2.id) AS checkout_count
                        FROM LibraryCheckout_2 LC2 , LibraryItemCode LIC1, LibraryItemCode LIC2
                        WHERE LIC1.code = LC2.item_collection
                            AND LIC2.code = LC2.item_type
                            AND LC2.checkout_date >= TO_DATE(:startDate, 'YYYY-MM-DD')
                            AND LC2.checkout_date <= TO_DATE(:endDate, 'YYYY-MM-DD')
                            AND LIC1.genre_name != 'NA'
                            AND LIC2.genre_name != 'NA'
                        GROUP BY LC2.bib_num
                        ORDER BY checkout_count DESC
                    )
               WHERE ROWNUM < :num
            ) CC
            WHERE LB.bib_num = CC.bib_num
                AND LB.item_collection = LIC.code
            ORDER BY checkout_count DESC`;

            const binds = [startDate, endDate, num];
            const options = { outFormat: oracledb.OUT_FORMAT_OBJECT };
            const result = await conn.execute(query, binds, options);

            console.log(result.rows);
            return result.rows;

        } catch (err) {
            console.error('Ouch!', err)
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close();
                    console.log("Closing connection...");
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }

    init(start, end, num).then(result => res.json(result));
});

/**
 * Librarian Tool: Book Display Planner - Feature
 */
router.get('/bookdisplay/:list/:numTimes/:year/:numDisplay', cacheMiddleware(3000), function(req, res, next) {
  const list = req.params.list;
  const numTimes = req.params.numTimes;
  const year = req.params.year;
  const numDisplay = req.params.numDisplay;

  console.log("Book Display params: " + list + ", " + numTimes + ", " + year + ", " + numDisplay);

  async function init(list, numTimes, year, numDisplay) {
      try {
          // Create a connection pool which will later be accessed via the
          // pool cache as the 'default' pool.
          await oracledb.createPool(config);
          console.log('Connection pool started');

          // Now the pool is running, it can be used
          const rows = await getBooksToDisplay(list, numTimes, year, numDisplay);
          // console.log(rows);
          return rows;

      } catch (err) {
          console.error('init() error: ' + err.message);
      } finally {
          await closePool();
      }
  };

/**
 *  Get information about the books to display, given the genre, number of times the book appears in
 *  the best seller list, the year and the number of results to display
 * @param list
 * @param numTimes
 * @param year
 * @param numDisplay
 * @returns {Promise<SQLResultSetRowList|number|HTMLCollectionOf<HTMLTableRowElement>|string>}
 */
async function getBooksToDisplay (list, numTimes, year, numDisplay) {
      let conn;

      try {
          conn = await oracledb.getConnection();
          const query =
              `WITH BESTSELLING_AUTHORS_ON_LIST AS (
                SELECT AB1.AUTHOR_ID
                FROM (SELECT NBL.ISBN13 AS ISBN13
                      FROM NYT_BESTSELLER BS1
                               JOIN NYT_BOOK_LIST NBL on BS1.ENTRY_ID = NBL.ENTRY_ID
                      WHERE BS1.LIST_NAME = :list
                      GROUP BY NBL.ISBN13) ISBNs
                         JOIN NYT_AUTHOR_BOOK_3 AB1 ON ISBNs.ISBN13 = AB1.ISBN13
                GROUP BY AB1.AUTHOR_ID
                HAVING COUNT(*) >= :numTimes
            ), SELECTION AS (
            SELECT BS.LIST_NAME, BK.ISBN13, BK.TITLE, A.AUTHOR_ID, A.NAME
            FROM NYT_BESTSELLER BS
                   JOIN NYT_BOOK_LIST BL ON (BS.ENTRY_ID = BL.ENTRY_ID)
                   JOIN NYT_BOOK BK ON (BK.ISBN13 = BL.ISBN13)
                   JOIN NYT_AUTHOR_BOOK_3 AB ON (BK.ISBN13 = AB.ISBN13)
                   JOIN NYT_AUTHOR_3 A ON (A.AUTHOR_ID = AB.AUTHOR_ID)
            WHERE A.AUTHOR_ID IN (SELECT * FROM BESTSELLING_AUTHORS_ON_LIST)
            GROUP BY BK.ISBN13, BS.LIST_NAME, BK.TITLE, A.AUTHOR_ID, A.NAME
            ), RESULTS AS (
                SELECT DISTINCT(S.TITLE) AS TITLE, S.NAME, COUNT(UNIQUE LC.ID) AS NUM_CHECKOUTS
                FROM SELECTION S
                         JOIN
                     LIBRARYISBN LI ON (S.ISBN13 = LI.ISBN)
                         JOIN
                     LIBRARYCHECKOUT_2 LC ON (LI.BIB_NUM = LC.BIB_NUM)
                WHERE EXTRACT(YEAR FROM CHECKOUT_DATE) = :year
                GROUP BY S.TITLE, S.NAME
                ORDER BY NUM_CHECKOUTS DESC
            )
            SELECT R.TITLE, R.NAME, R.NUM_CHECKOUTS
            FROM RESULTS R
            WHERE ROWNUM <= :numDisplay`;

          const binds = [list, numTimes, year, numDisplay];
          const options = { outFormat: oracledb.OUT_FORMAT_OBJECT };
          const result = await conn.execute(query, binds, options);

          console.log(result.rows);
          return result.rows;

      } catch (err) {
          console.error('Ouch!', err)
      } finally {
          if (conn) { // conn assignment worked, need to close
              try {
                  await conn.close();
                  console.log("Closing connection...");
              } catch (err) {
                  console.error(err);
              }
          }
      }
  }

  init(list, numTimes, year, numDisplay).then(result => res.json(result));
});

/**
 * Reader Dashboard - Book Background
 *
 * Examples: harry potter and the , girl with the dragon tattoo, hunger games, alchemist, fault in our stars, kite runner
 */
router.get('/bookbackground/:title', cacheMiddleware(3000), function(req, res, next) {
    const title = req.params.title;

    console.log("Book background params: "+title);

    async function init(title) {
        try {
            // Create a connection pool which will later be accessed via the
            // pool cache as the 'default' pool.
            await oracledb.createPool(config);
            console.log('Connection pool started');

            if(!title || title.trim() === '') {
                return;
            }

            // Now the pool is running, it can be used
            const titleInput = '%'+title.toLowerCase()+'%';
            const rows = await getBookBackground(titleInput);
            // console.log(rows);
            return rows;

        } catch (err) {
            console.error('init() error: ' + err.message);
        } finally {
            await closePool();
        }
    };

/**
 * Get background information about books that match a user inputted title
 * @param title
 * @returns {Promise<SQLResultSetRowList|number|HTMLCollectionOf<HTMLTableRowElement>|string>}
 */
async function getBookBackground (title) {
        let conn;

        try {
            conn = await oracledb.getConnection();
            const query =
                `SELECT LB_NYT.*, GRB.AVERAGE_RATING, GRB.RATINGS_COUNT, GRB.IMAGE_URL, GRB.SMALL_IMAGE_URL, GRB.PUBLICATION_YEAR
         FROM (
         SELECT LB_Result.*,
                NB.DESCRIPTION         AS DESCRIPTION,
                NB.AMAZON_PRODUCT_URL  AS PRODUCT_URL,
                NB.BOOK_IMAGE_WIDTH,
                NB.BOOK_IMAGE_HEIGHT,
                NB.BOOK_IMAGE,
                MIN(NBS.RANK)          AS MIN_RANK,
                MAX(NBS.WEEKS_ON_LIST) AS MAX_WEEKS_ON_LIST
         FROM (
                  SELECT AVG_CC.*, LI.ISBN
                  FROM (SELECT LC.BIB_NUM AS BIB_NUM, LB.TITLE AS TITLE, CEIL(COUNT(LC.id) / 5) AS AVG_CHECKOUT_PER_YEAR
                        FROM LIBRARYBOOK LB,
                             LibraryCheckout_2 LC,
                             LibraryItemCode LIC1,
                             LibraryItemCode LIC2
                        WHERE LB.BIB_NUM = LC.BIB_NUM
                          AND lower(LB.TITLE) like :title
                          AND LIC1.code = LC.item_collection
                          AND LIC2.code = LC.item_type
                          AND LIC1.genre_name != 'NA'
                          AND LIC2.genre_name != 'NA'
                        GROUP BY LC.bib_num, LB.title) AVG_CC
                           LEFT JOIN LIBRARYISBN LI
                                     ON AVG_CC.BIB_NUM = LI.BIB_NUM
                                         AND LI.ISBN_TYPE = 'ISBN13'
              ) LB_Result
                  LEFT JOIN NYT_BOOK NB
                            ON NB.ISBN13 = LB_Result.ISBN
                  LEFT JOIN NYT_BOOK_LIST NBL
                            ON NB.ISBN13 = NBL.ISBN13
                  LEFT JOIN NYT_BESTSELLER NBS
                            ON NBS.ENTRY_ID = NBL.ENTRY_ID
                  LEFT JOIN NYT_LIST NL
                            ON NL.LIST_NAME = NBS.LIST_NAME
         GROUP BY LB_Result.BIB_NUM, LB_Result.TITLE, LB_Result.AVG_CHECKOUT_PER_YEAR, LB_Result.ISBN,
                  NB.DESCRIPTION, NB.AMAZON_PRODUCT_URL, NB.BOOK_IMAGE_WIDTH, NB.BOOK_IMAGE_HEIGHT, NB.BOOK_IMAGE
         ) LB_NYT
         LEFT JOIN GOODREADSISBN GRI
                   ON LB_NYT.ISBN = GRI.ISBN13
         LEFT JOIN GOODREADSBOOK GRB
                   ON GRB.GOODREADS_ID = GRI.GOODREADS_ID
         ORDER BY MIN_RANK ASC`;

            const binds = [title];
            const options = { outFormat: oracledb.OUT_FORMAT_OBJECT };
            const result = await conn.execute(query, binds, options);

            console.log(result.rows);
            return result.rows;

        } catch (err) {
            console.error('Ouch!', err)
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close();
                    console.log("Closing connection...");
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }

    init(title).then(result => res.json(result));
});

/**
 * Librarian Dashboard - Book People Are Not Borrowing - Feature
 *
 */
router.get('/notreadbooks/:year', cacheMiddleware(3000), function(req, res, next) {
    const year = req.params.year;

    console.log("Not Read books params: "+year);

    async function init(year) {
        try {
            // Create a connection pool which will later be accessed via the
            // pool cache as the 'default' pool.
            await oracledb.createPool(config);
            console.log('Connection pool started');

            // Now the pool is running, it can be used
            const rows = await getNeverReadBooks(year);

            return rows;

        } catch (err) {
            console.error('init() error: ' + err.message);
        } finally {
            await closePool();
        }
    };

/**
 * Get a list of 25 books that were the least read per year, from the library dataset
 * This is generated randomly in order to make the feature interesting
 * @param year
 * @returns {Promise<SQLResultSetRowList|number|HTMLCollectionOf<HTMLTableRowElement>|string>}
 */
async function getNeverReadBooks (year) {
        let conn;

        try {
            conn = await oracledb.getConnection();
            const query =
                `SELECT *
        FROM (
         SELECT DISTINCT(LB.TITLE) AS TITLE, LA.NAME AS AUTHOR,  LC2.GENRE_NAME AS GENRE, LI.ISBN
         FROM LibraryBook LB
                  JOIN LibraryISBN LI on LI.BIB_NUM = LB.BIB_NUM AND LI.ISBN_TYPE = 'ISBN13'
                  JOIN LibraryItemCode LC1 on LB.ITEM_COLLECTION = LC1.CODE AND LC1.GENRE_NAME != 'NA'
                  JOIN LibraryItemCode LC2 on LB.ITEM_TYPE = LC2.CODE AND LC2.GENRE_NAME != 'NA'
                  JOIN LibraryBookAuthor LBA on LBA.BIB_NUM = LB.BIB_NUM
                  JOIN LibraryAuthor LA on LA.ID = LBA.AUTHOR_ID
         WHERE LI.ISBN NOT IN (SELECT LI2.ISBN
                               FROM LibraryCheckout_2 LC2
                                        JOIN LIBRARYISBN LI2 ON LI2.BIB_NUM = LC2.BIB_NUM
                               WHERE EXTRACT(YEAR FROM LC2.CHECKOUT_DATE) = :year)
         ORDER BY DBMS_RANDOM.VALUE()
         )
        WHERE ROWNUM <= 25`;

            const binds = [year];
            const options = { outFormat: oracledb.OUT_FORMAT_OBJECT };
            const result = await conn.execute(query, binds, options);

            console.log(result.rows);
            return result.rows;

        } catch (err) {
            console.error('Ouch!', err)
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close();
                    console.log("Closing connection...");
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }

    init(year).then(result => res.json(result));
  });

 /*
  * Reader Tool: Great Books You've Never Heard Of - Feature
 */
router.get('/greatbooks/:genre/:num', cacheMiddleware(3000), function(req, res, next) {
  const genre = req.params.genre;
  const num = req.params.num;

  console.log("Great Books params: "+genre+", "+num);

  async function init(genre, num) {
      try {
          // Create a connection pool which will later be accessed via the
          // pool cache as the 'default' pool.
          await oracledb.createPool(config);
          console.log('Connection pool started');

          // Now the pool is running, it can be used
          const rows = await getGreatBooks(genre, num);
          // console.log(rows);
          return rows;

      } catch (err) {
          console.error('init() error: ' + err.message);
      } finally {
          await closePool();
      }
  };

/**
 * Get book titles from the library dataset, which did not appear on the best seller list
 * @param genre
 * @param num
 * @returns {Promise<SQLResultSetRowList|number|HTMLCollectionOf<HTMLTableRowElement>|string>}
 */
async function getGreatBooks (genre, num) {
      let conn;

      try {
          conn = await oracledb.getConnection();
          const query =
              `WITH GENRE_SELECTION AS (
                SELECT LC2.BIB_NUM, LB2.TITLE, LI2.ISBN, LC2.ID AS CHECKOUT_ID
                FROM LIBRARYCHECKOUT_2 LC2
                    JOIN LIBRARYBOOK LB2 ON LC2.BIB_NUM = LB2.BIB_NUM
                    JOIN LIBRARYISBN LI2 ON LC2.BIB_NUM = LI2.BIB_NUM
                    JOIN LIBRARYITEMCODE LIC2 ON LB2.ITEM_COLLECTION = LIC2.CODE
                WHERE LIC2.GENRE_NAME = :genre
            ), LIB_BOOKS_ON_NYT_LISTS AS (
                SELECT LI3.BIB_NUM
                FROM NYT_BOOK NB JOIN LIBRARYISBN LI3 ON NB.ISBN13 = LI3.ISBN
            )
            SELECT TITLE, NUM_CHECKOUTS
            FROM (SELECT GS.TITLE, COUNT(GS.CHECKOUT_ID) AS NUM_CHECKOUTS, GS.BIB_NUM
                  FROM GENRE_SELECTION GS
                  WHERE GS.BIB_NUM NOT IN (SELECT BIB_NUM FROM LIB_BOOKS_ON_NYT_LISTS)
                  GROUP BY GS.BIB_NUM, GS.TITLE
                  ORDER BY NUM_CHECKOUTS DESC)
            WHERE ROWNUM <= :num `;

          const binds = [genre, num];
          const options = { outFormat: oracledb.OUT_FORMAT_OBJECT };
          const result = await conn.execute(query, binds, options);

          console.log(result.rows);
          return result.rows;

      } catch (err) {
          console.error('Ouch!', err)
      } finally {
          if (conn) { // conn assignment worked, need to close
              try {
                  await conn.close();
                  console.log("Closing connection...");
              } catch (err) {
                  console.error(err);
              }
          }
      }
  }

  init(genre, num).then(result => res.json(result));
});

/**
 * Recommendations - Feature
 */
router.get('/recommendations/:title/:num', cacheMiddleware(3000), function(req, res, next) {
  const titleInput = `%${req.params.title.toUpperCase()}%`;
  const numTitles = req.params.num;

  async function init(titleInput, numTitles) {
    try {
      // Create a connection pool which will later be accessed via the
      // pool cache as the 'default' pool.
      await oracledb.createPool(config);
      console.log('Connection pool started');

      // Now the pool is running, it can be used
      const rows = await getRecommendations(titleInput, numTitles);
      // console.log(rows);
      return rows;

    } catch (err) {
      console.error('init() error: ' + err.message);
    } finally {
      await closePool();
    }
  };

/**
 * Get book recommendations given a book title and the number of results to return.
 * The recommended books should share the same genre as the book that was input and
 * have at least a similar Good Reads rating.
 * @param titleInput
 * @param numTitles
 * @returns {Promise<SQLResultSetRowList|number|HTMLCollectionOf<HTMLTableRowElement>|string>}
 */
async function getRecommendations (titleInput, numTitles) {
    let conn;
    try {
      conn = await oracledb.getConnection();
      const query =
      `WITH TargetBook AS (
        SELECT *
        FROM GOODREADSBOOK
        WHERE UPPER(title) LIKE :titleInput
      ),
      TargetISBNsAndRatings AS (
        SELECT GI.ISBN as ISBN, TB.AVERAGE_RATING as RATING
        FROM TargetBook TB JOIN GOODREADSISBN GI ON (TB.GOODREADS_ID = GI.GOODREADS_ID)
        UNION
        SELECT GI.ISBN13 as ISBN, TB.AVERAGE_RATING as RATING
        FROM TargetBook TB JOIN GOODREADSISBN GI ON (TB.GOODREADS_ID = GI.GOODREADS_ID)
      ),
      TargetLibraryBooks AS (
         SELECT *
         FROM TargetISBNsAndRatings TB, LIBRARYISBN LI, LIBRARYBOOK LB, LIBRARYITEMCODE LIC
         WHERE TB.ISBN = LI.ISBN
           AND LI.BIB_NUM = LB.BIB_NUM
           AND LB.ITEM_COLLECTION = LIC.CODE
      ),
      TargetGenres AS (
        SELECT GENRE_NAME AS GENRE_NAME, COUNT(*) as Count
        FROM TargetLibraryBooks
        WHERE GENRE_NAME IS NOT NULL
        GROUP BY GENRE_NAME
        UNION
        SELECT SUB_GENRE_NAME AS GENRE_NAME, COUNT(*) as Count
        FROM TargetLibraryBooks
        WHERE SUB_GENRE_NAME IS NOT NULL
        GROUP BY SUB_GENRE_NAME
      ),
      TopGenre AS (
         SELECT GENRE_NAME
         FROM TargetGenres
         WHERE ROWNUM = 1
       )
       SELECT DISTINCT(GB2.TITLE), GB2.DESCRIPTION, GB2.AVERAGE_RATING, LIC2.GENRE_NAME, GB2.RATINGS_COUNT, TO_CHAR(GB2.PUBLICATION_YEAR, 9999) AS PUBLICATION_YEAR
       FROM GOODREADSBOOK GB2,
            GOODREADSISBN GI2,
            LIBRARYISBN LI2,
            LIBRARYBOOK LB2,
            LIBRARYITEMCODE LIC2
       WHERE GB2.GOODREADS_ID = GI2.GOODREADS_ID
       AND (GI2.ISBN = LI2.ISBN OR GI2.ISBN13 = LI2.ISBN)
       AND LI2.BIB_NUM = LB2.BIB_NUM
       AND LB2.ITEM_COLLECTION = LIC2.CODE
       AND LIC2.GENRE_NAME = (SELECT GENRE_NAME FROM TopGenre)
       AND GB2.AVERAGE_RATING >= (SELECT MAX(AVERAGE_RATING) FROM TargetBook)
       AND ROWNUM <= :numTitles
       ORDER BY GB2.AVERAGE_RATING DESC
       `;

      const binds = [titleInput, numTitles];
      const options = { outFormat: oracledb.OUT_FORMAT_OBJECT };
      const result = await conn.execute(query, binds, options);

      console.log(result.rows);
      return result.rows;

    } catch (err) {
      console.error('Ouch!', err)
    } finally {
      if (conn) { // conn assignment worked, need to close
        try {
          await conn.close();
          console.log("Closing connection...");
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  init(titleInput, numTitles).then(result => res.json(result));

});

/**
 * Add to Favorites - Add Favorite book titles to NoSQL DynamoDB
 */
router.get('/addtofavorites/:title([^/]+/[^/]+)', function(req, res, next) {
    const title = req.params.title;

    console.log("Add to Favorites:"+title);
    var IPs = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    if (IPs.indexOf(":") !== -1) {
        IPs = IPs.split(":")[IPs.split(":").length - 1]
    }
    var IP = IPs.split(",")[0];
    console.log("IP="+IP);

    var table = "BookFavorites";
    var params = {
        TableName: table,
        Key:{
            "ipAddress": IP
        }
    };

    docClient.get(params, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
        }

        var favoriteBooks = [];
        if(data.Item !== undefined && data.Item !== null && data.Item.favorites !== undefined) {
            favoriteBooks = data.Item.favorites;
        }
        favoriteBooks.push(title);

        var favorites = Array.from(new Set(favoriteBooks));
        var inputParams = {
            TableName:table,
            Item:{
                "ipAddress": IP,
                "favorites": favorites,
            }
        };

        console.log("Adding a new item...");
        docClient.put(inputParams, function(err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Added item:", JSON.stringify(data, null, 2));
            }
            return res.json(data);
        });

    });
});

/**
 * Get Favorites - Get Favorite book titles from NoSQL DynamoDB
 */
router.get('/favorites', function(req, res, next) {

        console.log("Get from Favorites");
        var IPs = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        if (IPs.indexOf(":") !== -1) {
            IPs = IPs.split(":")[IPs.split(":").length - 1]
        }
        var IP = IPs.split(",")[0];
        console.log("IP="+IP);

        var table = "BookFavorites";
        var params = {
            TableName: table,
            Key:{
                "ipAddress": IP
            }
        };

        docClient.get(params, function(err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));

                var favoriteBooks = [];
                var favBookTitles = [];
                if(data.Item !== undefined && data.Item !== null && data.Item.favorites !== undefined) {
                    favoriteBooks = data.Item.favorites;
                    for(book in favoriteBooks) {
                        favBookTitles.push({TITLE: favoriteBooks[book]});
                    }
                }

                return res.json(favBookTitles);
            }
        });

});


/**
 * Librarian Dashboard - Borrowing Trends
 * Parameters: Book Title
 * Then graphs the data shown
 *
 */
router.get('/borrowingtrends/:title', cacheMiddleware(3000),function(req, res, next) {
    const title = req.params.title;

    console.log("Borrowing Trends params: "+title);

    async function init(title) {
        try {
            // Create a connection pool which will later be accessed via the
            // pool cache as the 'default' pool.
            await oracledb.createPool(config);
            console.log('Connection pool started');

            if(!title || title.trim() === '') {
                return;
            }

            // Now the pool is running, it can be used
            const titleInput = '%'+title.toLowerCase()+'%';
            const rows = await getBorrowingTrends(titleInput);
            // console.log(rows);
            return rows;

        } catch (err) {
            console.error('init() error: ' + err.message);
        } finally {
            await closePool();
        }
    };

/**
 * Get checkout information based on the title that was input
 * @param title
 * @returns {Promise<SQLResultSetRowList|number|HTMLCollectionOf<HTMLTableRowElement>|string>}
 */
async function getBorrowingTrends (title) {
        let conn;

        try {
            conn = await oracledb.getConnection();
            const query =
                `SELECT LB.TITLE, LI.ISBN, COUNT(LC.CHECKOUT_DATE) AS CHECKOUTS_PER_MONTH,
                  EXTRACT(MONTH FROM LC.CHECKOUT_DATE) AS MONTH,
                  EXTRACT(YEAR FROM LC.CHECKOUT_DATE) AS YEAR,
                  GRB.AVERAGE_RATING, GRB.RATINGS_COUNT
                FROM
                LIBRARYBOOK LB JOIN LIBRARYCHECKOUT_2 LC
                  ON LB.BIB_NUM = LC.BIB_NUM
                  AND lower(LB.TITLE) like :title
                JOIN LIBRARYISBN LI
                  ON LB.BIB_NUM = LI.BIB_NUM
                  AND LI.ISBN_TYPE = 'ISBN13'
                JOIN LibraryItemCode LC1 on LB.ITEM_COLLECTION = LC1.CODE AND LC1.GENRE_NAME != 'NA'
                JOIN LibraryItemCode LC2 on LB.ITEM_TYPE = LC2.CODE AND LC2.GENRE_NAME != 'NA'
                LEFT JOIN GOODREADSISBN GRI
                  ON LI.ISBN = GRI.ISBN13
                LEFT JOIN GOODREADSBOOK GRB
                  ON GRB.GOODREADS_ID = GRI.GOODREADS_ID
                GROUP BY LB.TITLE, LI.ISBN, EXTRACT(MONTH FROM LC.CHECKOUT_DATE), EXTRACT(YEAR FROM LC.CHECKOUT_DATE), GRB.AVERAGE_RATING, GRB.RATINGS_COUNT
                ORDER BY TITLE, YEAR, MONTH, AVERAGE_RATING DESC`;
            const binds = [title];
            const options = { outFormat: oracledb.OUT_FORMAT_OBJECT };
            const result = await conn.execute(query, binds, options);

            console.log(result.rows);
            return result.rows;

        } catch (err) {
            console.error('Ouch!', err)
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close();
                    console.log("Closing connection...");
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }

    init(title).then(result => res.json(result));
});

/**
 * New York Times Best Sellers - Rank
 */
router.get('/nytrank/:title', cacheMiddleware(3000),function(req, res, next) {
    const title = req.params.title;

    console.log("NYT Rank params: "+title);

    async function init(title) {
        try {
            // Create a connection pool which will later be accessed via the
            // pool cache as the 'default' pool.
            await oracledb.createPool(config);
            console.log('Connection pool started');

            if(!title || title.trim() === '') {
                return;
            }

            // Now the pool is running, it can be used
            const titleInput = '%'+title.toLowerCase()+'%';
            const rows = await getNYTRank (titleInput);
            // console.log(rows);
            return rows;

        } catch (err) {
            console.error('init() error: ' + err.message);
        } finally {
            await closePool();
        }
    };

/***
 * Get New York Times Bestseller ranks, given a title
 * @param title
 * @returns {Promise<SQLResultSetRowList|number|HTMLCollectionOf<HTMLTableRowElement>|string>}
 */
async function getNYTRank (title) {
        let conn;

        try {
            conn = await oracledb.getConnection();
            const query =
                `SELECT LB.TITLE, LI.ISBN, NBS.BESTSELLERS_DATE, NBS.RANK
                FROM LIBRARYBOOK LB JOIN LIBRARYISBN LI
                  ON LB.BIB_NUM = LI.BIB_NUM
                  AND LI.ISBN_TYPE = 'ISBN13'
                  AND lower(LB.TITLE) like :title
                JOIN NYT_BOOK NB
                  ON NB.ISBN13 = LI.ISBN
                LEFT JOIN NYT_BOOK_LIST NBL
                  ON NB.ISBN13 = NBL.ISBN13
                LEFT JOIN NYT_BESTSELLER NBS
                  ON NBS.ENTRY_ID = NBL.ENTRY_ID
                LEFT JOIN NYT_LIST NL
                  ON NL.LIST_NAME = NBS.LIST_NAME
                ORDER BY LI.ISBN, BESTSELLERS_DATE ASC`;
            const binds = [title];
            const options = { outFormat: oracledb.OUT_FORMAT_OBJECT };
            const result = await conn.execute(query, binds, options);

            console.log(result.rows);
            return result.rows;

        } catch (err) {
            console.error('Ouch!', err)
        } finally {
            if (conn) { // conn assignment worked, need to close
                try {
                    await conn.close();
                    console.log("Closing connection...");
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }

    init(title).then(result => res.json(result));
});


module.exports = router;
