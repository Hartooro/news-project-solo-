const request = require("supertest")
const seed = require('../db/seeds/seed')
const app = require("../app")
const db = require("../db/connection")
const testData = require('../db/data/test-data')

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