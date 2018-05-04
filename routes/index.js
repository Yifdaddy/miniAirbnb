var express =require("express");
var router = express.Router();
var passport = require("passport")
var User = require("../models/user")
router.get("/", function(req, res){
    //res.render("landing");
    res.redirect("/houses");
});

//Authentication
router.get("/register", function(req, res) {
    res.render("register");
});
router.post("/register", function(req, res) {
    //res.send
   // var newUser = new User({username:req.body.username});
    User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
       if (err) {
           //console.log(err);
           //err is coming from passport
           req.flash("error", err.message);
           return res.redirect("register");
       }
       // log the user in
       passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome, " + user.username);
            res.redirect("/houses");
       });
    });
});

router.get("/login", function(req, res) {
    res.render("login")
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/houses",
        failureRedirect: "/login"
    }), function(req, res) { //callback doesn't do anything here
    //res.send("Login");
});

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You Have Logged Out!");
    res.redirect("/houses");
});

function isLogin(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } 
    res.redirect("/login");
}
module.exports = router;