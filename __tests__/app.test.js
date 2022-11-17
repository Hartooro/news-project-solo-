const request = require("supertest")
const seed = require('../db/seeds/seed')
const app = require("../app")
const db = require("../db/connection")
const testData = require('../db/data/test-data')
const { response } = require("../app")

beforeEach(() => seed(testData))

afterAll(()=>{
    if(db.end) db.end();
})

describe('1 GET/api/topics', () => {
    test('status 200, should respond with a topic objc with an array of topics', () => {
        return request(app).get("/api/topics").expect(200).then((response)=>{
            expect(response.body.topics).toEqual(expect.any(Array))
            expect(response.body.topics.length).not.toEqual(0)
            response.body.topics.forEach((topic)=>{
                expect(topic).toEqual(expect.objectContaining({
                    slug : expect.any(String),
                    description : expect.any(String)
                }))
                
            })
        })
    });
    test('404 STATUS if an invalid route is inserted', () => {
        return request(app)
        .get('/api/notAValidRoute')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('route does not exist')
        })
    });
});
describe('2. GET API ARTICLES', () => {
    test('status 200, should respond with an articles object with an array of articles', () => {
        return request(app).get("/api/articles").expect(200).then((response)=>{
            expect(response.body.articles.length).toBeGreaterThan(0)
            response.body.articles.forEach((article)=>{
                expect(article).toEqual(expect.objectContaining({
                    article_id : expect.any(Number),
                    title: expect.any(String),
                    topic : expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count : expect.any(String)
                }))
                
            })

            expect(response.body.articles).toBeSortedBy("created_at",{
                descending : true,
                coerce:true
            })
        })
    });
});
describe('4 get/api/articles/:article_id', () => {
    test('code 200, returns article with specific ID', () => {
        return request(app).get("/api/articles/1").expect(200).then(({body})=> {
           expect(body.article).toEqual(expect.objectContaining({
            article_id :1,
            title : "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body : "I find this existence challenging",
            created_at : "2020-07-09T20:11:00.000Z",
            votes : 100

           }))
           
        }
        
        )
    });
    
  test('when searching an id not present, returns 404', () => {
    return request(app).get('/api/articles/122').expect(404).then((res)=>{
      expect(res.body.msg).toBe("article not found")
    });
  })
  test('when inputted a different data type, returns status 400 ', () => {
    return request(app).get("/api/articles/nonsensicalgibberish").expect(400)
    })
  })


  describe('5 get/api/articles/id/comments', () => {
    test('returns 200, with the comments related to the article id', () => {
        return request(app).get("/api/articles/5/comments").expect(200)
        .then((res)=>{
            expect(res.body.comments.length).toBe(2)
            res.body.comments.forEach((comment)=>{
            
               expect(comment).toEqual(expect.objectContaining({
                comment_id: expect.any(Number),
                body : expect.any(String),
                author: expect.any(String),
                votes: expect.any(Number),
                created_at : expect.any(String)

               }))
               
            })
            expect(res.body.comments).toBeSortedBy("created_at",{
                descending:true,
                coerce: true
            })
        })
    })
    test('tests for a valid article, but no comments are found, so should return an empty array', () => {
        return request(app).get("/api/articles/4/comments").expect(200).then((res)=>{
            expect(res.body.comments.length).toBe(0)
            expect(res.body.comments).toEqual([])
        })
    })
    test('testing for invalid ID ', () => {
        return request(app).get("/api/articles/currentlyListeningToMasayoshiTakanaka/comments").expect(400).then((res)=>{
            expect(res.body.msg).toBe("What are you even searching for?")
        })
    })
    test('testing for non existant endpoint', () => {
        return request(app).get("/api/articles/124152/comments").expect(404).then((res)=>{
            expect(res.body.msg).toBe("article not found!")
        })
    });
  });
  