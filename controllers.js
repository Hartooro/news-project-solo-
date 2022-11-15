const {selectTopics, selectArticles} = require("./models")

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
