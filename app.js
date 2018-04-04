require("./db/db.js");
const mongoose = require("mongoose");
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cors = require('cors');
const logger = require('morgan');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const index = require('./routes/index');
const users = require('./routes/users');
const projects = require("./routes/projects");
const expenses = require("./routes/expenses");
const helmet = require("helmet");


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(fileUpload());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet({
    frameguard: {
        action: "deny"
    }
}));
// var node_ip = process.env.NODE_IP || 'http://localhost:3000';
// var ssrf_url = node_ip+'/expenses/ssrf/'

// app.use(helmet.contentSecurityPolicy({
//     directives: {
//         defaultSrc: ["'self', 'http://localhost:3000/expenses/ssrf/' "],
//         styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com']
//     }
//  }));

app.use('/', index);
app.use('/users', users);
app.use('/projects', projects);
app.use('/expenses', expenses);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
