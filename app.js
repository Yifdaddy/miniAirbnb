var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local")
mongoose.connect("mongodb://localhost/camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
var house = require("./models/house");
var Comment = require("./models/comment")
//var seedDB = require("./seeds"); // import the function
var User = require("./models/user")
//seedDB(); //export a function in seed.js
var expressSession = require("express-session");
var houseRoutes = require("./routes/houses");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");
var methodOverride = require("method-override");
var conFlash = require("connect-flash");
app.use(methodOverride("_method"));
app.use(conFlash());

//passport config
app.use(expressSession({
    secret:"Cool",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.use(indexRoutes);
app.use(commentRoutes);
app.use(houseRoutes);

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Airbnb Simulator Has Started!");
});