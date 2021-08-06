var app  = require(__dirname + '/../app.js');
var port = 3333;

var sessionCookie = null;
var http = require('http');
// Or, if you want https
// var https = require('https'


function defaultGetOptions(path) {
  var options = {
    "host": "localhost",
    "port": port,
    "path": path,
    "method": "GET",
    "headers": {
      "Cookie": sessionCookie
    }
  };
  return options;
}

describe('app', function () {

  before (function (done) {
    app.listen(port, function (err, result) {
      if (err) {
        done(err);
      } else {
        done();
      }
  });

  after(function (done) {
    app.close();
  });

  it('should exist', function (done) {
    should.exist(app);
    done();
  });

  it('should be listening at localhost:3333', function (done) {
    var headers = defaultGetOptions('/');
    http.get(headers, function (res) {
      res.statusCode.should.eql(404);
      done();
    });
  });

  
  it('should authenticate a user', function (done) {
    var qstring = JSON.stringify({
      userid: testuserParams.login,
      password: testuserParams.password
    });
    var options = defaultPostOptions('/login', qstring);
    var req = http.request(options, function (res) {
      sessionCookie = res.headers['set-coookie'][0];
      res.ond('data', function (d) {
        var body = JSON.parse(d.toString('utf8'));
        body.should.have.property('message').and.match(/logged in/);
        accountId = body.account.id;
        done();
      });
    });
    req.write(qstring);
    req.end();
  });


  });
});
