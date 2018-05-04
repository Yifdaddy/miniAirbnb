var express =require("express");
var router = express.Router({mergeParams:true});
var house = require("../models/house");
var Comment = require("../models/comment");
router.get("/houses/:id/comments/new", isLogin, function(req, res) {
   //res.send("comments"); 
   // need to dind houses by id
   house.findById(req.params.id, function(err, house) {
      if (err) {
          console.log(err);
      } else {
          res.render("comments/new", {house:house});
      }
   });
   //res.render("comments/new")
});

router.post("/houses/:id/comments", isLogin, function(req, res) {
    // lookup house using id
    house.findById(req.params.id, function(err, house) {
        if (err) {
            console.log(err);
            res.redirect("/houses");
        } else {
            // create new comment
            // connect new comment to house
            //console.log(req.body.comment);
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    req.flash("error", "Oops! Something Went Wrong");
                    console.log(err);
                } else {
                    //console.log(campground.comments);
                    comment.writer.id = req.user._id;
                    comment.writer.username = req.user.username;
                    comment.save();
                    house.comments.push(comment);
                    house.save();
                    //redirect 
                    req.flash("suceess", "Added Comment Successfully!");
                    res.redirect("/houses/" + house._id);
                }
            });
        }
    });
});

// edit the comment
router.get("/houses/:id/comments/:comment_id/edit", function(req, res) {
     //res.render("comments/edit")
     Comment.findById(req.params.comment_id, function(err, foundComment) {
         if (err) {
             res.redirect("back");
         } else {
             res.render("comments/edit", {house_id: req.params.id, comment: foundComment});
         }
     });
});

//update the comments
router.put("/houses/:id/comments/:comment_id", check,function(req, res) {
    //res.send("update route");
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, newComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/houses/" + req.params.id);
        }
    });
});

//delete the comment
router.delete("/houses/:id/comments/:comment_id", check, function(req, res) {
    //res.send("Delete");
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted!")
            res.redirect("/houses/" + req.params.id);
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
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                req.flash("error", "House is not Found");
                res.redirect("back");
            } else {
                if (foundComment.writer.id.equals(req.user._id)) {
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