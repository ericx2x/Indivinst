var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var bpagesRouter = require('./routes/bpages');
var passwordRouter = require('./routes/password');
var bodyParser = require('body-parser');

var cors = require('cors');

var app = express();

app.use(cors({origin: ["https://indivinst.com", "https://www.indivinst.com"], credentials: true}));

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/bpages', bpagesRouter);
app.use('/api/password', passwordRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


if (!module.parent) {
  app.listen(port, host, function () {
    console.log("Express server listening on port %d in %s mode",
    app.address().port,
    app.settings.env
  );
});
}

module.exports = app;
