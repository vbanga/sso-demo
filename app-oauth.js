var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stylus = require('stylus');

var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login')
var flash = require('connect-flash');

var app = express();

var passport = require('passport')
var session = require('express-session')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: "roomapplication session" }));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use('/', index);
app.use('/users', users);


var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

passport.use('provider', new OAuth2Strategy({
    authorizationURL: 'https://5c63f71b-e5eb-45cb-bc87-83de9faec49c.predix-uaa.run.aws-usw02-pr.ice.predix.io/oauth2/authorize',
    tokenURL: 'https://5c63f71b-e5eb-45cb-bc87-83de9faec49c.predix-uaa.run.aws-usw02-pr.ice.predix.io/oauth2/token',
    clientID: 'node-sso-demo',
    clientSecret: 'node-sso-demo',
    callbackURL: 'https://node-sso-demo.run.aws-usw02-pr.ice.predix.io/users'
  },
  function(accessToken, refreshToken, profile, done) {
    //User.findOrCreate(..., function(err, user) {
      done(err, "user");
    //});
  }
));

app.get('/login', passport.authenticate('provider'));
app.get('/users',
  passport.authenticate('provider', { successRedirect: '/users',
                                      failureRedirect: '/login' }));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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

//code for importing static files
app.use(express.static(path.join(__dirname, 'public')));
var currentPort = app.listen(process.env.PORT || 3000);
console.log("Server started at PORT " + currentPort);

module.exports = app;
