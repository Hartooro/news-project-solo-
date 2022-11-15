\c nc_news

Select articles.* ,
(Select Count(*) From comments Where comments.article_id =articles.article_id)  CommentsCount
From articles
order by commentsCount desc ;


