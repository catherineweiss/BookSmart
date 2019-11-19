var express = require('express');
var router = express.Router();
var config = require('../db-config.js');

/* ----- Connects to Booksmart Oracle database ----- */

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
/* ----- Routers to handle data requests ----- */
/* ------------------------------------------------ */

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/**
 * Recommendations
 */
router.get('/recommendations/:list/:num', function(req, res, next) {
  const list = req.params.list;
  const num = req.params.num;

  async function init(list, num) {
    try {
      // Create a connection pool which will later be accessed via the
      // pool cache as the 'default' pool.
      await oracledb.createPool(config);
      console.log('Connection pool started');

      // Now the pool is running, it can be used
      const rows = await getRecommendations(list, num);
      // console.log(rows);
      return rows;

    } catch (err) {
      console.error('init() error: ' + err.message);
    } finally {
      await closePool();
    }
  };

  async function getRecommendations (list, num) {
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

  // res.render('index', { data: "Hi" });
});


/**
 * Inventory Manager
 */
router.get('/inventory/:start/:end/:num', function(req, res, next) {
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

    async function getInventory (startDate, endDate, num) {
        let conn;

        try {
            conn = await oracledb.getConnection();
            const query =
                `SELECT LB.bib_num, LB.title, LB.item_count, CC.checkout_count FROM
            LibraryBook LB,
            (
               SELECT *
               FROM (
                        SELECT bib_num, COUNT(id) AS checkout_count
                        FROM LibraryCheckout_2
                         WHERE checkout_date >= TO_DATE(:startDate, 'YYYY-MM-DD')
                           AND checkout_date <= TO_DATE(:endDate, 'YYYY-MM-DD')
                        GROUP BY bib_num
                        ORDER BY checkout_count DESC
                    )
               WHERE ROWNUM < :num
            ) CC
            WHERE LB.bib_num = CC.bib_num
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
 * Librarian Tool: Book Display Planner
 */
router.get('/bookdisplay/:list/:year/:numTimes/:numDisplay', function(req, res, next) {
  const list = req.params.list;
  const year = req.params.year;
  const numTimes = req.params.numTimes;
  const numDisplay = req.params.numDisplay;

  console.log("Book Display params: "+list+", "+year+", "+numTimes+", "+numDisplay);

  async function init(list, year, numTimes, numDisplay) {
      try {
          // Create a connection pool which will later be accessed via the
          // pool cache as the 'default' pool.
          await oracledb.createPool(config);
          console.log('Connection pool started');

          // Now the pool is running, it can be used
          const rows = await getBooksToDisplay(list, year, numTimes, numDisplay);
          // console.log(rows);
          return rows;

      } catch (err) {
          console.error('init() error: ' + err.message);
      } finally {
          await closePool();
      }
  };

  async function getBooksToDisplay (listName, year, numTimes, numDisplay) {
      let conn;

      try {
          conn = await oracledb.getConnection();
          const query =
              `WITH BESTSELLING_AUTHORS_ON_LIST AS(
                SELECT AB2.AUTHOR_ID
                FROM NYT_AUTHOR_BOOK_3 AB2 JOIN
                    NYT_BOOK_LIST BL2 ON (BL2.ISBN13 = AB2.ISBN13) JOIN
                    NYT_BESTSELLER BS2 ON (BS2.ENTRY_ID = BL2.ENTRY_ID)
                WHERE BS2.LIST_NAME = :listName
                GROUP BY AB2.AUTHOR_ID
                HAVING COUNT(*) > :numTimes
             ),
             SELECTION AS(
                SELECT *
                FROM NYT_BESTSELLER BS
                    JOIN NYT_BOOK_LIST BL ON (BS.ENTRY_ID = BL.ENTRY_ID)
                    JOIN NYT_BOOK BK ON (BK.ISBN13 = BL.ISBN13)
                    JOIN NYT_AUTHOR_BOOK_3 AB ON (BK.ISBN13 = AB.ISBN13)
                    JOIN NYT_AUTHOR_3 A ON (A.AUTHOR_ID = AB.AUTHOR_ID)
                WHERE A.AUTHOR_ID IN (SELECT * FROM BESTSELLING_AUTHORS_ON_LIST)
             )
             SELECT S.TITLE, S.NAME, S.ISBN13, COUNT(UNIQUE LC.ID) AS NUM_CHECKOUTS
             FROM SELECTION S JOIN
                LIBRARYISBN LI ON (S.ISBN13 = LI.ISBN) JOIN
                LIBRARYCHECKOUT_2 LC ON (LI.BIB_NUM = LC.BIB_NUM)
             WHERE EXTRACT(YEAR FROM CHECKOUT_DATE) = :year
             GROUP BY S.TITLE, S.NAME, S.ISBN13
             ORDER BY NUM_CHECKOUTS DESC`;

          const binds = [listName, year, numTimes, numDisplay];
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

  init(list, year, numTimes, numDisplay).then(result => res.json(result));
});

module.exports = router;
