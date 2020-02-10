var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var CommentsSchema = new Schema({
  /* TODO:
   * Add four entries into our schema. These should be:
   *

   * 1: username: A string that will be be required, and also trimmed.
   * 2: password: A string that will be required, trimmed, and at least 6 characters.
   * 3: email: A string that must be a valid email address and unique in our collection.
   * 4: userCreated: A date that will default to the current date.
   *
   * TIP: The regex for checking if a string is an email is: /.+\@.+\..+/
   * Use that with the model attribute that checks for a valid match.
   * -/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/ */
   
   newsid: {type:String,trim:true,required:[true, 'Need id']},
   comment:{type:String,trim:true,required:[true, 'Need comment']}, 
   createdtime:{type:Date,default: Date.now,required:[true, 'Need created time']}
   
});

// This creates our model from the above schema, using mongoose's model method
var Comments = mongoose.model("Comments", CommentsSchema);

// Export the User model
module.exports = Comments;
