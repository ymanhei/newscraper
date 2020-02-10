// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");
var News = require("../models/newsModel.js");
var Comments = require("../models/commentsModel.js");
// Routes
// =============================================================
module.exports = function(app,dbresults) {
 // Main route (simple Hello World Message)
app.get("/", function(req, res) {
    var r = [];
    News.find({saved:false}).sort({newstime: -1})
       //Sort by Date Added DESC
  
   .then(function(dbNews) {
     // If all Notes are successfully found, send them back to the client
     dbNews.forEach(function(element){ 
      //console.log("element"+element)
      r.push({
        id: element.id,
        headline: element.headline,
        url: element.url,
        content:element.content,
        newstime:element.newstime
    }); 
  }); 
  //console.log("DATA:   " + r);
     var data = {
      news: r
    };
    //console.log(data);
    res.render("index",data);
   })
   .catch(function(err) {
     // If an error occurs, send the error back to the client
     res.json(err);
   });
  });
  
  app.get("/saved", function(req, res) {
    var r = [];
    News.find({saved:true})
    .populate("comments")
    .then(function(dbNews) {
     // If all Notes are successfully found, send them back to the client
     dbNews.forEach(function(element){ 

      let comobarr = [];
      element.comments.forEach(function(com) {
        comobarr.push({comment:com.comment,id:com._id}); 
//console.log(com.comment);
      })

      //console.log(comobarr);
      r.push({
        id: element.id,
        headline: element.headline,
        url: element.url,
        content:element.content,
        newstime:element.newstime,
        comments:comobarr
    }); 
  }); 
  //console.log("DATA:   " + r);
     var data = {
      saves: r
    };
  
    //console.log(data);
    
    res.render("saves",data);
  
   })
   .catch(function(err) {
     // If an error occurs, send the error back to the client
     res.json(err);
   });
  });
  
  app.get("/putsave/:id", function(req, res) {
    News.findOneAndUpdate({_id:req.params.id},{$set:{saved:true}})
    .then(
      res.redirect('/')
    )
  });
  
  app.get("/removesave/:id", function(req, res) {
    News.findOneAndUpdate({_id:req.params.id},{$set:{saved:false}})
    .then(
      res.redirect('/saved')
    )
  });
  
  // TODO: make two more routes
  
  // Route 1
  // =======
  // This route will retrieve all of the data
  // from the scrapedData collection as a json (this will be populated
  // by the data you scrape using the next route)
  app.get("/all", function(req, res) {
   // Find all Notes
   News.find({})
   .then(function(dbNews) {
     // If all Notes are successfully found, send them back to the client
     res.json(dbNews);
   })
   .catch(function(err) {
     // If an error occurs, send the error back to the client
     res.json(err);
   });
  });
  // Route 2
  // =======
  // When you visit this route, the server will
  // scrape data from the site of your choice, and save it to
  // MongoDB.
  // TIP: Think back to how you pushed website data
  // into an empty array in the last class. How do you
  // push it into a MongoDB collection instead?
  
  /* -/-/-/-/-/-/-/-/-/-/-/-/- */
  
  app.get("/scrape", function(req, res) {
    console.log(dbresults);
  dbresults.forEach(function (elements){
      //console.log(elements.headline);
    var query  = News.where({ url: elements.url });
    query.findOne(function (err, n) {
     if (err) return handleError(err);
     if (!n) {
      News.create(elements)
      .then(function(dbNews) {
        // If saved successfully, send the the new User document to the client
        //res.json(dbNews);
        
      })
      .catch(function(err) {
        // If an error occurs, send the error to the client
        res.json(err);
      });
    }
  
  });
  })
  setTimeout(function(){
    // Move to a new location or you can do something else
    res.redirect('/');
  }, 3000);
      
    });

    app.post("/postcomment", function(req, res) {
        console.log(req.body);
            Comments.create(req.body)
            
            .then(function(dbComments) {
              // If saved successfully, send the the new User document to the client
              //res.json(dbComments);
              return News.findOneAndUpdate({_id:req.body.newsid}, { $push: { comments: dbComments._id } }, { new: true });
            })
            .then(function(dbComments) {
                // If the User was updated successfully, send it back to the client
                res.json(dbComments);
              })
            .catch(function(err) {
              // If an error occurs, send the error to the client
              res.json(err);
            });  
    });

    app.get("/removecomment/:id", function(req, res) {
        console.log(req.params.id);
        Comments.deleteOne({_id:req.params.id})
        .then(
          res.redirect('/saved')
        )
      });

};
