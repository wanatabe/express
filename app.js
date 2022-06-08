var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var contentDisposition = require('content-disposition');
var serveIndex = require('serve-index');
var ejs = require('ejs');

var indexRouter = require('./routes/index');
var hieipRouter = require('./routes/hieip');
var upRouter = require('./routes/upload');
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, 'public')));

function setHeaders(res, path) {
    res.setHeader('Content-Disposition', contentDisposition(path));
}
app.use(
    '/data',
    express.static(path.join(__dirname, 'data'), {
        index: false,
        setHeaders: setHeaders
    })
);
app.use('/data', serveIndex('data', { icons: true }));

app.set('views', ['src', 'public']);
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.use('/', indexRouter);
app.use('/hieip', hieipRouter);
app.use('/', upRouter);

module.exports = app;
