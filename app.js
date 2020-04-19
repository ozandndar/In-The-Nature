// Packages
var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	flash = require('connect-flash'),
	methodOverride 		= require("method-override"),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	passportLocalMongoose = require('passport-local-mongoose'),
	$ = require('jquery'),
	expressSanitizer = require('express-sanitizer'),
	seedDB = require('./seeds');

// Modals
	Comment = require('./models/comment'),
	Campground = require('./models/campground'),
	User = require('./models/User');

// Routes
var commentRoutes 		= require("./routes/comments"),
		campgroundRoutes 	= require("./routes/campgrounds"),
		authRoutes			 	= require("./routes/auth");

// APP CONFIG
// seedDB();
mongoose.connect('mongodb+srv://ozan9211:8f15xe7n@inthenature-2i0mh.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
}).then(() => {
	console.log("connected to db!");
}).catch(err => {
	console.log('ERROR:', err.message);
});
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());
app.use(expressSanitizer());
app.use(function(req, res, next) { // set permissions for json endpoints
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});
// PASSPORT CONFIG
app.use(
	require('express-session')({
		secret: 'Auth is the key.',
		resave: false,
		saveUninitialized: false
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// send current user to all pages
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// Routes
app.use(authRoutes);
app.use("/kamp-yerleri",campgroundRoutes);
app.use("/kamp-yerleri/:id/comments", commentRoutes);

// app.listen(20000, function() {
// 	console.log('App is running... Great!');
// });

app.listen(process.env.PORT, process.env.IP);