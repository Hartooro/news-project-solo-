const express = require("express")
const app = express()
const {getTopics, getArticles} = require("./controllers")

app.get("/api/topics", getTopics)
app.get("/api/articles", getArticles)


app.get("*", function(req, res){
    res.status(404).send({msg:"route does not exist"})
})
module.exports = app;