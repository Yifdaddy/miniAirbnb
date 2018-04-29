var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var CampgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String
});

var Campground = mongoose.model("Campground", CampgroundSchema);

// Campground.create(
//     {
//         name: "Granite Hill", 
//         image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
//         description: "It is Granite Hill located at nowhere."
//     }, function(err, campground) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("added " + campground);
//         }
//     }
//     );


// var campgrounds = [
//         {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
//         {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
//         {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
//         {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
//         {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
//         {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
//         {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
//         {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
//         {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"}
// ];
    
app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    // Get all campgrounds from mongodb
    Campground.find({}, function(err, allcampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("INDEX",{campgrounds:allcampgrounds});
        }
    })
    
    //res.render("campgrounds",{campgrounds:campgrounds});
});

app.post("/campgrounds", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, image: image, description: description}
    //campgrounds.push(newCampground);
    //Create a new campground and save
    Campground.create(newCampground, function(err, newlyCreadted){
       if (err) {
           console.log(err);
       } else {
           res.redirect("/campgrounds");
       }
    });
    //redirect back to campgrounds page
    //res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
   res.render("new"); 
});

//Give user more info about the campground
app.get("/campgrounds/:id", function(req, res) {
    //find campground with provided ID
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("show",{campground: foundCampground});
        }
    });
    //var id = req.params.id
    //res.render("show");
})

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});