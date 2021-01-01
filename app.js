const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://localhost:27017/wikiDB', { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

//////////////////////////////////Request Targeting All Articles///////////////////////
app.route("/articles")
.get(function (req, res) {
    Article.find({}, function (err, foundArticles) {
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    })
})
.post(function(req, res){
    const title = req.body.title;
    const content = req.body.content;

    const article = new Article({
        title: title,
        content: content

    })
    article.save(function (err) {
            if (!err) {
                res.send("Successfully posted! ");
            } else {
                res.send(err);
            }
        });
})

.delete(function (req, res) {
    Article.deleteMany(function (err) {
        if (!err) {
            res.send("Successfully deleted all articles!");
        } else {
            res.send(err);
        }
    })
});
//////////////////////////////////Request Targeting Specific Articles//////////////////

app.route("/articles/:articleTitle")

.get(function(req,res){
    const title = req.params.articleTitle;

    Article.findOne({title: title}, function(err, foundArticle){
        if(foundArticle){
            res.send(foundArticle)
        }else{
            res.send("Requested Article not found");
        }
    })

})

.put(function(req, res){
    Article.update(
        { title: req.params.articleTitle},
        {title: req.body.title,
        content: req.body.content},
        {overwrite: true}, function(err){
            if(!err){
                res.send("Successfully Updated Article")
            }
        } )
})

.patch(function(req, res){
    Article.update(
        { title: req.params.articleTitle },
        { $set: req.body
        }, function (err) {
            if (!err) {
                res.send("Successfully Updated!")
            }else{
                res.send(err);
            }
        })
})

.delete(function(req,res){
    Article.deleteOne(
        { title: req.params.articleTitle },
        function(err){
            if(!err){
                res.send("Successfully Deleted Requested Article")
            }else{
                res.send(err);
            }
        })
});

app.listen(3000, function(){
    console.log("Server is listening on Port 3000");
})