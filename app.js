const express = require("express")
const app = express()
const {getTopics, getArticles, getArticleById, getCommentsByArticleId} = require("./controllers")
app.use(express.json());


app.get("/api/topics", getTopics)
app.get("/api/articles", getArticles)
app.get("/api/articles/:id", getArticleById)
app.get("/api/articles/:id/comments", getCommentsByArticleId)

app.use((err,req,res,next)=>{
    if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg});
    }
})
app.get("*", function(req, res){
    res.status(404).send({msg:"route does not exist"})
})

module.exports = app;