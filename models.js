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

exports.fetchArticleById = (id) => {
    //first if checks if NaN

     if(!id.match(/^\d+$/)){
          return Promise.reject({
              status:400,
              msg:'wrong data type for article id'
          })
     }

     return db
     .query(`SELECT * FROM articles 
      WHERE article_id = $1;
      `,[id]).then((result)=>{
        if (result.rows.length === 0){
            return []
        } else {
            return result.rows[0]
        }
         })
 }