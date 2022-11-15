\c nc_news

Select *, Count(*) cocomment
From comments
join  articles
on comments.article_id =articles.article_id 
group by articles.article_id , comment.comment_id ;


