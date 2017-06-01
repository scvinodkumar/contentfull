var express				=	require('express')
  , util              	=   require('util')
  , session 			= 	require('express-session')
  , cookieParser 		= 	require('cookie-parser')
  , bodyParser 			= 	require('body-parser')
  , flash 				= 	require('connect-flash')
  , multer 				= 	require('multer')
  , passport        	=   require('passport')
  //, FacebookStrategy  	=   require('passport-facebook').Strategy
 // , config            	=   require('./configuration/config')
//, mysql             	=   require('mysql')
  , morgan       		= 	require('morgan')
  , mongoose 			= 	require('mongoose');
   

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration   


/*
//Define MySQL parameter in Config.js file.
var connection = mysql.createConnection({
  host     : config.host,
  user     : config.username,
  password : config.password,
  database : config.database
});
*/

var app=express();

app.set('view engine','ejs');

app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


var sessionStore 	= 	new session.MemoryStore;
var upload 			= 	multer({ dest: 'images/'});

app.use(cookieParser());
app.use(session({
	cookie: { maxAge: null },
	store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'ilovescotchscotchyscotchscotch'
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(flash());

app.use(function(req, res, next){
	res.locals.resLocalVar = "Vinodkumar"
	res.locals.usersActive = '';
	if (req.isAuthenticated()) {
		res.locals.usersActive = req.user;
	}
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});

var routes=require('./routes/route.js');

	

app.get('/',routes.index);
app.get('/products',routes.products);
app.get('/articles',routes.articles);
app.get('/view/:id',routes.view);
app.get('/category/:id',routes.category_view);
app.get('/search',routes.search);
app.post('/search',routes.search);
app.post('/comments/:id/saveComment',routes.savecomment);
app.get('/register',routes.register);
app.post('/register',upload.single('picture'),routes.registerSubmit);

app.get('/login', isNotLoggedIn, routes.login);
app.get('/profile', isLoggedIn, routes.profile);
app.get('/logout', isLoggedIn, routes.logout);
//app.get('/login', routes.login);
app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
// handle the callback after facebook has authenticated the user
app.get('/auth/facebook/callback',
	passport.authenticate('facebook', {
		successRedirect : '/profile',
		failureRedirect : '/'
	}));

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
function isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated())
        return next();

    res.redirect('/');
}

var port = process.env.PORT || 8080;

var server=app.listen(port,function(req,res){
    console.log("Catch the action at http://localhost:"+port);
});
module.exports=app;