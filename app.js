const express = require("express")
const app = express()
const {getTopics, getArticles, getArticleById, getCommentsByArticleId, postComment, patchArticles} = require("./controllers")
app.use(express.json());


app.get("/api/topics", getTopics)
app.get("/api/articles", getArticles)
app.get("/api/articles/:id", getArticleById)
app.get("/api/articles/:id/comments", getCommentsByArticleId)
app.post("/api/articles/:id/comments", postComment)
app.patch("/api/articles/:id", patchArticles)

app.use((err,req,res,next)=>{
    if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg});
    }else if(err.code === '22P02'){
        res.status(400).send({msg:'Bad, bad Request'})
    }else res.status(500).send({msg:'Internal Server Error'})
})
app.get("*", function(req, res){
    res.status(404).send({msg:"route does not exist"})
})
app.get("*", function(req, res){
    res.status(404).send({msg:"route does not exist"})
})
module.exports = app;