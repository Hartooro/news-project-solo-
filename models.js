const db = require("./db/connection")
const {checkArticleExists, checkAuthorExists} = require("./db/seeds/utils")
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
            return Promise.reject({
                status :404,
                msg: "article not found"
            })
         } else {
            return result.rows[0]
         }
        })
 }



 exports.fetchCommentsByArticleId = (id) => {
    return checkArticleExists(id)
    .then(()=>{
        return db.query(
            `SELECT * FROM comments 
             WHERE article_id = $1
             ORDER BY created_at desc;
            `, [id]
        )
        .then((res)=>{
            return res.rows
        })
    })
 
}
exports.insertingComments = (body, id) => {
    return checkArticleExists(id)
    .then(()=>{

        if (Object.keys(body).length === 0){
            return Promise.reject({
                status : 400,
                msg: "Bad, bad Request"
            })
        }
        if ("author" in body && "body" in body ){
            return checkAuthorExists(body.author)
            .then(()=>{
               return db.query(`
                INSERT INTO comments (body,author,article_id)
                VALUES ($1, $2, $3)
                RETURNING *;
               `, [body.body, body.author, id])
               .then((result)=> {
                return result.rows[0]
               })
            })
        } else {
            return Promise.reject({
                status: 400,
                msg: "Bad, bad Request. Please make sure there's a body and an author"
            })
        }

    })
}


exports.modifyArticles = (id, updateValue ) => {
    if (Object.keys(updateValue).length === 1 && "inc_votes" in updateValue){
    return checkArticleExists(id).then(()=>{

        if (!updateValue){
            return Promise.reject({
                status:400,
                msg : "try again"
            })
        } 
            return db
            .query(`UPDATE articles 
            SET votes = votes + $2
            WHERE article_id = $1
            RETURNING*;`,[id, updateValue.inc_votes]).then((result)=>{
               if(result.rows[0].votes < 0){
                   return Promise.reject({
                       status : 400,
                       msg: "votes cannot be negative."
                   })
               }
               
              return result.rows[0]
            })
        
    })
    } else {
        return Promise.reject({
            status : 400, 
            msg : "You can only edit the votes."
        })
    }
}
