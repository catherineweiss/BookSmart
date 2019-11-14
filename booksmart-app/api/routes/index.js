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

      // console.log(result.rows);
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
})

module.exports = router;
