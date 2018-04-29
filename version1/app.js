var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
var campgrounds = [
    {name: "Salmon Creek", image:"https://pixabay.com/get/eb30b90c2bf4023ed1584d05fb1d4e97e07ee3d21cac104497f4c778aee8b3bc_340.jpg"},
    {name: "Granite Hill", image:"https://pixabay.com/get/e83db50a21f4073ed1584d05fb1d4e97e07ee3d21cac104497f4c778aee8b3bc_340.jpg"},
    {name: "Mountain Goat's Rest", image:"https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg"}
    ];

//Landing page
app.get("/", function(req, res) {
    //res.send("landing");
    res.render("landing");
})

app.get("/campgrounds", function(req, res){
    res.render("campgrounds",{campgrounds:campgrounds});
    //res.send("campground page");
});
app.post("/campgrounds", function(req, res) {
   //get data from form and add to campground array
   //redirect back to campground page
   //用req.body.name和req.body.image来获取new.ejs的信息（与form对应）
   var name = req.body.name;  // <input type="text" name="name" placeholder="name">
   var image = req.body.image; //<input type="text" name = "image" placeholder= "image url">
   

   if (req.body.trueDelete == "true") {
       campgrounds.pop();
       res.redirect("/campgrounds");
   } else {
        var campObj = {name:name,image:image};
        campgrounds.push(campObj);
        res.redirect("/campgrounds");
   }
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});
app.get("/campgrounds/old", function(req, res) {
   res.render("old"); 
});


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("YelpCamp connected..."); 
});