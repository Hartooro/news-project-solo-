const db = require("./db/connection")

exports.selectTopics = () => {
  

    let queryStr = ` SELECT * FROM topics;`
   
    return db.query(queryStr).then((result)=> {
        return result.rows})
}

exports.selectArticles = () => {

    let queryStr = ` 
    Select articles.* ,
    (Select Count(*) From comments Where comments.article_id =articles.article_id)  comment_count
    From articles
    order by created_at desc


   ;`
    return db.query(queryStr).then((result)=>{
        return result.rows })
}