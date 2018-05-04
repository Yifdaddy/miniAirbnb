var mongoose = require("mongoose");
var houseSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   writer: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
       { type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
       }
    ],
    price: Number
});

module.exports = mongoose.model("House", houseSchema); //Exports the database