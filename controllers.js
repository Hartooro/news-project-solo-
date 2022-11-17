const {selectTopics, selectArticles, fetchArticleById, fetchCommentsByArticleId} = require("./models")

exports.getTopics = (req,res,next) => {
    selectTopics().then((result)=>{
        res.status(200).send({topics:result})
        
    })
    .catch(next)
}

exports.getArticles = (req,res,next) => {
    selectArticles().then((result)=>{
        
        res.status(200).send({articles:result})
    })
    .catch(next)
}

exports.getArticleById = (req, res,next) => {
    const {id}= req.params;
    fetchArticleById(id)
    .then((result)=>{
        res.status(200).send({article : result})
    })
    .catch((err) => {
        next(err);
    });
}

exports.getCommentsByArticleId = (req,res,next) => {
    const {id} = req.params;
    fetchCommentsByArticleId(id)
    .then((result)=>{
        res.status(200).send({comments:result});
    })
    .catch((err)=>{
        next(err);
    })

}