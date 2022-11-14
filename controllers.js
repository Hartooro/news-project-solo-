const {selectTopics} = require("./models")

exports.getTopics = (req,res,next) => {
    selectTopics().then((result)=>{
        res.status(200).send({topics:result})
        console.log({topics:result})
    })
    .catch(next)
}