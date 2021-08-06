var express = require('express');
var router = express.Router();
//var cors = require('cors');
var app = express();
var mysql = require('mysql');
var sha256 = require('sha256');
var config = require('../config/secret.json');

var con = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});

//router.use(cors({origin: "http://www.indivinst.com", credentials: true}));
//router.use(cors({origin: ["http://indivinst.com", "http://www.indivinst.om"], credentials: true}));
con.connect(function (err) {
  if (err) throw err;
});

//START OF AUTOSETUP

//var sql = "CREATE TABLE bpages (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), message longtext, date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, date_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, private BOOLEAN DEFAULT FALSE, pid INT, namepid VARCHAR(255) UNIQUE NOT NULL, pin BOOLEAN DEFAULT FALSE)";
//con.query(sql, function (err, result) {
//if (err) throw err;
//console.log("Bpages Table created");
//});
//var sql = "CREATE TABLE sessions (session_id INT AUTO_INCREMENT PRIMARY KEY, expires TIMESTAMP, data VARCHAR(255))";
//con.query(sql, function (err, result) {
//if (err) throw err;
//console.log("Sessions Table created");
//});

//var sql = "INSERT IGNORE INTO bpages (name, message, namepid) VALUES ?";
//var values = [
//['Day1', 'Writing1', 'Day1 0'],
//['Day2', 'Writing2', 'Day2 0'],
//['Day3', 'Writing3', 'Day3 0'],
//['Day4', 'Writing4', 'Day4 0'],
//['Day5', 'Writing5', 'Day5 0'],
//['Day6', 'Writing6', 'Day6 0'],
//['Day7', 'Writing7', 'Day7 0'],
//['Day8', 'Writing8', 'Day8 0'],
//['Day9', 'Writing9', 'Day9 0'],
//['Day10', 'Writing10', 'Day10 0'],
//['Day11', 'Writing11', 'Day11 0'],
//['Day12', 'Writing12', 'Day12 0'],
//['Day13', 'Writing13', 'Day13 0'],
//['Day14', 'Writing14', 'Day14 0']
//];
//con.query(sql, [values], function (err, result) {
//if (err) throw err;
//console.log("Number of records inserted: " + result.affectedRows);
//});

//var pw = "CREATE TABLE password (id INT AUTO_INCREMENT PRIMARY KEY, password VARCHAR(255))";
//con.query(pw, function (err, result) {
//if (err) throw err;
//console.log("password table made");
//});
//console.log('see', config.clientPassword);
//var p = `${"INSERT INTO password (password) VALUE('" + sha256(config.clientPassword) + "')"}`;//REMEMBER TO REMOVE WHEN DONE
//con.query(p, function(err, result){
//if(err) throw err;
//console.log('password errored');
//});

//END OF AUTO SETUP

//TRUNCATE TABLE password; // this lets you delete your password. A new one can be added after.
//INSERT INTO password(password) VALUE("fkajshdlkasd81173871273askljdhasdjh");
router.get('/', function (req, res, next) {
  con.query(
    'SELECT name FROM bpages where pid = 0 OR pid IS NULL ORDER BY name',
    function (err, result, fields) {
      if (err) throw err;
      // console.log(result);
      res.json(result);
    },
  );
});

router.get('/publicBpages', function (req, res, next) {
  con.query(
    'SELECT name FROM bpages where (pid = 0 OR pid IS NULL) AND private = 0 ORDER BY name',
    function (err, result, fields) {
      if (err) throw err;
      // console.log(result);
      res.json(result);
    },
  );
});

router.get('/pinBpages', function (req, res, next) {
  con.query(
    'SELECT name, namepid FROM bpages where pin = true AND private = 0 ORDER BY name',
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    },
  );
});

router.get('/getPinBpage/:currentBpageId', function (req, res, next) {
  con.query(
    `SELECT pin FROM bpages where id = '${req.params.currentBpageId}'`,
    function (err, result, fields) {
      if (err) throw err;
      console.log('res', result);
      res.send(result);
    },
  );
});

router.get('/:bpagesId', function (req, res, next) {
  con.query(
    `con.query("SELECT name FROM bpages where pid = 0 OR pid IS NULL ORDER BY name", function (err, result, fields) {
';`,
    function (err, result, fields) {
      //console.log('baseUrl', req.baseUrl);
      //console.log('path', req.path);
      //console.log('originalUrl', req.originalUrl);
      if (err) throw err;
      res.send(result);
    },
  );
});

router.get('/namepid/:bpagesName/:pid', function (req, res, next) {
  con.query(
    `SELECT id, name, message, date_created, date_modified, private, pid, namepid FROM bpages 
            WHERE namepid='${req.params.bpagesName} ${req.params.pid}';`,
    function (err, result, fields) {
      //console.log('req.params.bpagesName', req.params.bpagesName);
      //console.log('req.body.pid', req.params.pid);
      //console.log('result', result);
      //console.log('path', req.path);
      //console.log('originalUrl', req.originalUrl);
      if (err) throw err;
      res.send(result);
    },
  );
});

//retreivePathing
router.get('/retreivePathing/:id', function (req, res, next) {
  con.query(
    `SELECT namepid FROM bpages 
            WHERE id='${req.params.id}';`,
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    },
  );
});

router.get('/children/:bpagesId', function (req, res, next) {
  con.query(
    `SELECT id, name, message, date_created, date_modified, private, pid FROM bpages 
            WHERE pid='${req.params.bpagesId}';`,
    function (err, result, fields) {
      //console.log('req', req.params);
      //console.log('result', result);
      //console.log('path', req.path);
      //console.log('originalUrl', req.originalUrl);
      if (err) throw err;
      res.send(result);
    },
  );
});

router.post('/:bpagesId', function (req, res, next) {
  con.query(
    `INSERT IGNORE INTO bpages (name, message, pid, namepid) VALUES ('${req.params.bpagesId.toLowerCase()}', '${
      req.body.messageData
    }', '${req.body.pid}', '${req.params.bpagesId} ${req.body.pid}')`,
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
      // console.log(result);
      // let sql = `INSERT IGNORE INTO bpages (name, message) VALUES ('${req.params.bpagesId}', '')`;
      // let query = con.query(sql);
    },
  );
});

router.post('/update/:bpagesId/:pid', function (req, res, next) {
  con.query(
    `UPDATE bpages SET message='${req.body.messageData}' WHERE namepid='${req.params.bpagesId} ${req.params.pid}';`,
    function (err, result, fields) {
      //console.log('msgdata', req.body.messageData);
      //console.log('namepid', req.params.bpagesId + ' ' + req.params.pid);
      if (err) throw err;
      res.send(result);
    },
  );
});

router.post('/updatePid/:bpagesId/:newPid/:id', function (req, res, next) {
  con.query(
    `UPDATE bpages SET name='${req.params.bpagesId}', message='${req.body.messageData}', pid='${req.params.newPid}', namepid='${req.params.bpagesId} ${req.params.newPid}' WHERE id='${req.params.id}';`,
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    },
  );
});

router.post('/private/:bpagesId', function (req, res, next) {
  con.query(
    `UPDATE bpages SET private='${
      req.body.isPrivateBpage
    }' WHERE name='${req.params.bpagesId.toLowerCase()}';`,
    function (err, result, fields) {
      if (err) throw err;
      //console.log(req.body.privateMode);
      res.send(result);
    },
  );
});

router.delete('/:id', function (req, res, next) {
  //console.log("deleted");
  //console.log(req.params.bpagesId);
  con.query(`DELETE FROM bpages WHERE id='${req.params.id}'`, function (
    err,
    result,
    fields,
  ) {
    if (err) throw err;
    res.send(result);
    // 	console.log(req.params.bpagesID);
    // let sql = `DELETE FROM bpages WHERE name='${req.params.bpagesId}'`;
    //  let query = con.query(sql);
  });
});

router.post('/setpin/:namepid', function (req, res, next) {
  con.query(
    `UPDATE bpages SET pin=NOT pin WHERE namepid='${req.params.namepid}';`,
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    },
  );
});

module.exports = router;
