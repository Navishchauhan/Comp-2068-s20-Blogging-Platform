// JavaScript Document
const express = require('express');
const app = express();
require('dotenv').config();

const path = require('path');

//mongo access
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI, {
	auth: {
		user: process.env.DB_USER,
		password: process.env.DB_PASS
	},
	useNewURLParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
}).catch(err => console.error('Error: ${err}'));

//implement body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//setup our session 
const passport = require('passport');
const session = require('express-session');
app.use(session({
	secret: 'any salty secret here', 
	resave : true, 
	saveUninitialized: false
})); 

// Setting up Passport
app.use(passport.initialize());
app.use(passport.session());
const User = require('./models/user');
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//set our views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/css', express.static('assets/css'));
app.use('/javascript', express.static('assets/javascript'));
app.use('/images', express.static('assets/images'));

// Setup flash notifications and defaults
const flash = require('connect-flash');
app.use(flash());
app.use('/', (req, res, next) => {
  // Setting default locals
  res.locals.pageTitle = "Untitled";

  // Passing along flash message
  res.locals.flash = req.flash();
  res.locals.formData = req.session.formData || {};
  req.session.formData = {};
  
  // Authentication helper
  res.locals.authorized = req.isAuthenticated();
  if (res.locals.authorized) res.locals.email = req.session.passport.user;

  next();
});

//register our routing 
const routes = require('./routes.js');
app.use('/', routes);

//set up our server 
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
