var express =require("express");
var router = express.Router();
var House = require("../models/house");
router.get("/houses", function(req, res){
    
    // Get all houses from mongodb
    House.find({}, function(err, allhouses) {
        if (err) {
            console.log(err);
        } else {
            res.render("houses/INDEX",{houses:allhouses, currentUser: req.user});
        }
    });
    
    //res.render("houses",{houses:houses});
});

router.post("/houses", isLogin, function(req, res){
    // get data from form and add to houses array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var writer = {
        id: req.user._id,
        username:req.user.username
    };
    var price = req.body.price;
    var newHouse = {name: name, image: image, description: description, writer: writer, price: price};
    
    //houses.push(newHouse);
    //Create a new campground and save
    House.create(newHouse, function(err, newlyCreated){
       if (err) {
           console.log(err);
       } else {
           //console.log(newlyCreated);
           res.redirect("/houses");
       }
    });
    //redirect back to houses page
    //res.redirect("/houses");
});

router.get("/houses/new", isLogin, function(req, res){
   res.render("houses/new"); 
});

//Give user more info about the campground
router.get("/houses/:id", function(req, res) {
    //find house with provided ID
    House.findById(req.params.id).populate("comments").exec(function(err, foundHouses) {
        if (err) {
            console.log(err);
        } else {
            //console.log(foundHouses);
            res.render("houses/show",{house: foundHouses});
        }
    });
    //var id = req.params.id
    //res.render("show");
});

// Edit house route
//check whether user logged in and if they own the house
router.get("/houses/:id/edit", check, function(req, res) {
    //res.send("Edit page");
    //check whether user logged in
    House.findById(req.params.id, function(err, foundHouse) {
        if (err) {
            req.flash("error", "An Error Happened");
        }
        res.render("houses/edit",{house: foundHouse});
    });
    //res.render("houses/edit",{house: foundHouse});
});

router.put("/houses/:id", check, function(req, res) {
    //find & update the specific house then redirect
    
    House.findByIdAndUpdate(req.params.id, req.body.house, function(err, updatedHouse) {
        if (err) {
            res.redirect("/houses");
        } else {
            res.redirect("/houses/" + req.params.id);
        }
    });
});

//Remove the route
router.delete("/houses/:id", check, function(req, res) {
    //res.send("Delete");
    House.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/houses");
        } else {
            res.redirect("/houses");
        }
    });
});

function isLogin(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You Have to Login First!");
    res.redirect("/login");
}

function check(req, res, next) {
    if (req.isAuthenticated()) {
        House.findById(req.params.id, function(err, foundHouse) {
            if (err || !foundHouse) {
                req.flash("error", "House is not Found");
                res.redirect("back");
            } else {
                
                if (foundHouse.writer.id.equals(req.user._id) || req.user.isAdmin) {
                    //check whether user logged in
                    next();
                } else {
                    req.flash("error", "You Have No Permission");

                    res.redirect("back");
                }
            }
        });
    } else {
        //console.log("You need to Login to your Account");
        req.flash("error", "You Have to Login First!");
        res.redirect("back");
    }
}
module.exports = router;