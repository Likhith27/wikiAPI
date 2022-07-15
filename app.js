//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static( 'public') );

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
};

//model name

const Article = mongoose.model('Article',articleSchema);

///////////////////////////////////////////////////////////////////////////////////
//Chainable route handlers app.route handlers instead of using the same route handlers many time under one route use all methods 
//////////////////////////Request Targetting all articles

app.route('/articles')

.get(function(req,res) {
    Article.find({},function(err,foundArticles) {
        if (!err) {
            res.send(foundArticles);
        }
        else {
            res.send(err);
        }
    })
})

.post(function(req,res) {

    // console.log(req.body.title);
    // console.log(req.body.content);

    const article1 = new Article({
        title: "Warrior",
        content: "flop"
    });
     
    article1.save(function(err){
        if ( !err) {
            res.send("Successfully added a new article ");
        }else{
            res.send("Error adding a new article");
        }
    });
})

.delete(function(req, res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all articles ");
        } else{
            res.send(err);
        }
      });
});




//get method
app.get('/articles',);


//post method
app.post('/articles',);

//delete method
app.delete("/articles",);

///////////////////////////////////////////////Request targeting specific article

app.route('/articles/:articleTitle')


.get(function (req, res) {
    
    Article.findOne({title: req.params.articleTitle}, function(err,foundArticle){
        
        if(!foundArticle){
            res.send(foundArticle);
        }else{
            res.send("No articles found");
        }

    })
})
// a space in url form is represented as %20  w3schools/urlencode

//PUT requests
.put(function(req, res){
    Article.update(
        {title: req.params.articleTitle},
        {title: req.params.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if(!err){
                res.send("Successfully updated article");
            }
        }

    );
})

//PATCH requests
.patch(function(req, res){
    Article.update(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Updated article successfully");
            }else{
                res.send("Error updating article");

            }
        }
    );
})

.delete(function(req, res) {
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Deleted article successfully");
            }else{
                res.send("Error deleting article");
            }
        }
    )
});



app.listen(3000, function() {
    console.log('Server running on port 3000');
});

