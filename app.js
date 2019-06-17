const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikidb',{useNewUrlParser:true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model('articles',articleSchema);


/////////////////////////All Articles///////////////////////////////////


app.route('/articles')
  .get(function(req,res){
    Article.find(function(err,foundArticles){
       if(err){
            console.log(err)
       }else{
             res.send(foundArticles);
        }
    });
})

 .post(function(req,res){
    // console.log(req.body.title);
     //console.log(req.body.content);

     const newArticle = new Article({
         title: req.body.title,
         content: req.body.content
     });
     newArticle.save(function(err){
         if(err){
             res.send(err);
         }else{
             res.send('Successfully Added');
         }
     });
})
  .delete(function(req,res){
    Article.deleteMany(function(err){
        if(err){
            res.send(err);
        }else{
            res.send('Successfully deleted');
        }
    });
});
/////////////////////////Individual Articles///////////////////////////////////

app.route('/articles/:articleTitle')
   .get(function(req,res){
       Article.findOne({title: req.params.articleTitle},function(err,foundArticle){
            if(foundArticle){
                res.send(foundArticle);
            }else{
                res.send('No article of given title was found.');
            }
       });
   })
   .put(function(req,res){
       Article.update(
           {title: req.params.articleTitle},
           {title:req.body.title,content:req.body.content},
           {overwrite:true},
           function(err){
               if(!err){
                   res.send('Successfully updated.');
               }
           }
       )
   })
   .patch(function(req,res){
       Article.update(
           {title: req.params.articleTitle},
           {$set: req.body},
           function(err){
               if(!err){
                   res.send('Successfully update on patch req');
               }else{
                   res.send(err);
               }
           }
       )
   })
   .delete(function(req,res){
       Article.deleteOne(
           {title:req.params.articleTitle},
           function(err){
               if(!err){
                   res.send('Successfully deleted');
               }else{
                   res.send(err);
               }
           }
       )
   })

app.listen(3000,function(){
    console.log('Server started om 3000');
})




// /*/* 1 */
// {
//     "_id" : ObjectId("5c139771d79ac8eac11e754a"),
//     "title" : "API",
//     "content" : "API stands for Application Programming Interface. It is a set of subroutine definitions, communication protocols, and tools for building software. In general terms, it is a set of clearly defined methods of communication among various components. A good API makes it easier to develop a computer program by providing all the building blocks, which are then put together by the programmer."
// }

// /* 2 */
// {
//     "_id" : ObjectId("5c1398aad79ac8eac11e7561"),
//     "title" : "Bootstrap",
//     "content" : "This is a framework developed by Twitter that contains pre-made front-end templates for web design"
// }

// /* 3 */
// {
//     "_id" : ObjectId("5c1398ecd79ac8eac11e7567"),
//     "title" : "DOM",
//     "content" : "The Document Object Model is like an API for interacting with our HTML"
// }

// /* 4 */
// {
//     "_id" : ObjectId("5d028d75bef6050d105331e4"),
//     "title" : "'First Article'",
//     "content" : "Gibberish stufffff\n   ",
//     "__v" : 0
// }*/