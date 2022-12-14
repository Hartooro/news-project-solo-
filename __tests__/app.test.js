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
                article_id: 5,
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
            expect(res.body.msg).toBe("Thats not gonna work, dude. Try inserting a number")
        })
    })
    test('testing for non existant endpoint', () => {
        return request(app).get("/api/articles/124152/comments").expect(404).then((res)=>{
            expect(res.body.msg).toBe("article not found!")
        })
    });
  });
  
  describe('6 post/api/articles/id/comments', () => {
    test('returns 201, with the added comment', () => {
        const comment = {
            author: "lurker",
            body : "Power of Water, Powers Unite! Six working together to fight evil!"
        }
        return request(app).post("/api/articles/4/comments").expect(201).send(comment).then((res)=>{
            expect(res.body.comment).toEqual(expect.objectContaining({
                article_id: 4,
                author: "lurker",
                body : "Power of Water, Powers Unite! Six working together to fight evil!",
                comment_id: expect.any(Number)
            }))
        })
    })
    test('returns 400, if article id is invalid', () => {
        const comment = {
            author: "lurker",
            body : "Power of Water, Powers Unite! Six working together to fight evil!"
        }
        return request(app).post("/api/articles/stonks/comments").expect(400).send(comment).then((res)=>{
            expect(res.body.msg).toBe("Thats not gonna work, dude. Try inserting a number")
        })
    })
    test('returns 400, if client tries to insert an empty object', () => {
        const comment = {}
        return request(app).post("/api/articles/4/comments").expect(400).send(comment).then((res)=>{
            expect(res.body.msg).toBe("Bad, bad Request")
        })
    })
    test('returns 404 if wanting to post in an article that doesnt exist', () => {
        const comment = {
            author: "lurker",
            body : "Power of Water, Powers Unite! Six working together to fight evil!"
        }
        return request(app).post("/api/articles/9999999/comments").expect(404).send(comment).then((res)=>{
            expect(res.body.msg).toBe("article not found!")
        })
    })
    test('returns 400 if wanting to post from a user that doesnt exist', () => {
        const comment = {
            author: "Blue power Ranger",
            body : "Power of Water, Powers Unite! Six working together to fight evil!"
        }
        return request(app).post("/api/articles/4/comments").send(comment).expect(404).then((res)=>{
    
            expect(res.body.msg).toBe("author is nonexistant")
        })
    })
    test('returns 400 if author is valid but body is empty', () => {
        const comment = {
            author: "Blue power Ranger"
        }
        return request(app).post("/api/articles/4/comments").send(comment).expect(400).then((res)=>{
            expect(res.body.msg).toBe("Bad, bad Request. Please make sure there's a body and an author")
        })
    })
  });

  describe('7 patch/api/articles/:id', () => {
    test('should update the votes property of an existing comment, increase by 100', () => {
        const newVote = { inc_votes : 100 
        }
        return request(app).patch("/api/articles/1").send(newVote).expect(200).then((res)=>{
            expect(res.body.article).toEqual(expect.objectContaining(
                {
                    article_id :1,
                    title : "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body : "I find this existence challenging",
                    created_at : "2020-07-09T20:11:00.000Z",
                    votes : 200
            }))
        })
    });
    test('should update the votes property of an existing comment, decreased by 50', () => {
        const newVote = { inc_votes : -50 }
        return request(app).patch("/api/articles/1").send(newVote).expect(200).then((res)=>{
            expect(res.body.article).toEqual(expect.objectContaining(
                {
                    article_id :1,
                    title : "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body : "I find this existence challenging",
                    created_at : "2020-07-09T20:11:00.000Z",
                    votes : 50
            }))
        })
    })
    test('testing what happens if we decrease too much ', () => {
        const newVote = { inc_votes : -500 }
        return request(app).patch("/api/articles/1").send(newVote).expect(400).then((res)=>{
            expect(res.body.msg).toEqual("votes cannot be negative.")
        })
    })
    test('should reject patch requests that attempt to edit other values', () => {
        const newVote = { inc_votes: 100,
            title : "Coding bootcamp for dummies" }
        return request(app).patch("/api/articles/1").send(newVote).expect(400).then((res)=>{
            expect(res.body.msg).toEqual("You can only edit the votes.")
        })
    })
    test('Very similar to previous test, but only attempts to change one property, not votes ', () => {
        const newVote = {
            title : "Coding bootcamp for dummies" }
        return request(app).patch("/api/articles/1").send(newVote).expect(400).then((res)=>{
            expect(res.body.msg).toEqual("You can only edit the votes.")
        })
    })
    test('rejects 400 if (a cheeky)user tries to patch votes with a non numerical value', () => {
        const newVote = {
           inc_votes: "DROP TABLE articles" }
        return request(app).patch("/api/articles/1").send(newVote).expect(400).then((res)=>{
            expect(res.body.msg).toEqual("Bad, bad Request")
        })
    })
    test('rejects 400 if a user tries to patch with an empty object', () => {
        const newVote = { }
         return request(app).patch("/api/articles/1").send(newVote).expect(400).then((res)=>{
             expect(res.body.msg).toEqual("You can only edit the votes.")
         })
    })
    test('rejects if user inserts valid id but non existant', () => {
        const newVote = { inc_votes : 25}
         return request(app).patch("/api/articles/234125").send(newVote).expect(404).then((res)=>{
             expect(res.body.msg).toEqual("article not found!")
         })
    })
    test('rejects if user inserts non numerical id', () => {
        const newVote = { inc_votes : 25}
         return request(app).patch("/api/articles/yoursonsandyourdaughtersarebeyondyourcommand").send(newVote).expect(400).then((res)=>{
             expect(res.body.msg).toEqual("Thats not gonna work, dude. Try inserting a number")
         })
    })
    
    });
