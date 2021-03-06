const sslRedirect = require('heroku-ssl-redirect');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
// const session = require("express-session");
const session = require('cookie-session');
const passport = require('passport');
const https = require('https'); //Required for https
const http = require('http'); //Required for http
const dotenv = require('dotenv');

dotenv.config();

const path = require('path'); //Required for https
const fs = require('fs'); //Required for https

const app = express();

// app.use(sslRedirect());
// Passport config
require('./config/passport.js')(passport);

// DB Config
const db = require('./config/keys').MongoURI;

// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(function () {
    console.log('MongoDb Connected...');
  })
  .catch(function (err) {
    console.log(err);
  });

// Display static file
app.use(express.static(__dirname + '/public'));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.error_reset_req = req.flash('error_reset_req');
  res.locals.success_mail_sent = req.flash('success_mail_sent');
  res.locals.error_token = req.flash('error_token');
  res.locals.error_passwords_match = req.flash('error_passwords_match');
  res.locals.success_password_change = req.flash('success_password_change');
  res.locals.success_logout_done = req.flash('success_logout');
  res.locals.success_story_publish = req.flash('success_story_publish');
  res.locals.success_story_delete = req.flash('success_story_delete');
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.enable('trust proxy');

//Before using heroku - server running locally
// const PORT = process.env.PORT || 3000;

// app.listen(PORT, console.log(`Server started on port ${PORT}`));

//server for heroku
let port = process.env.PORT;
if (port == null || port == '') {
  port = 4000;
}

// APP.LISTEN FOR HTTP
app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});

// APP.LISTEN FOR HTTPS
// const sslserver = https.createServer(
//   {
//     key: fs.readFileSync(path.join(__dirname, 'cert', 'server.key')),
//     cert: fs.readFileSync(path.join(__dirname, 'cert', 'server.crt')),
//   },
//   app
// );

// sslserver.listen(port, function () {
//   console.log('Server started successfully');
// });
