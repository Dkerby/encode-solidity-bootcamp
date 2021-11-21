var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const IPFS = require('ipfs-core')

var ipfsRouter = require('./routes/ipfs');

var app = express();

async function initGlobalIPFS() {
    global.IPFS = await IPFS.create()
};

initGlobalIPFS()

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/ipfs', ipfsRouter);

app.get('/', function(req, res, next) {
  console.log(__dirname+ '/views/index.html');
  res.sendFile(__dirname + '/views/index.html');
});

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
  res.sendFile(__dirname + '/views/error.html');
});

module.exports = app;
