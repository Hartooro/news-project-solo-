//TEST TEST
const app = require("./app");
const { request } = require("./app");

describe('7 patch/api/articles/:id', () => {
    test('should update the votes property of an existing comment, increase by one', () => {
        const newVote = { inc_votes : 1 
        }
        return request(app).patch("/api/articles/1").expect(200).send(newVote).then((res)=>{
            expect(res.body.article).toEqual(expect.ObjectContaining(
                {
                    article_id :1,
                    title : "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body : "I find this existence challenging",
                    created_at : "2020-07-09T20:11:00.000Z",
                    votes : 101
            }))
        })
    });
});

// now appAPPAPPAPPAPP



//CANTROLLAS


// NOW MODELMODELMODEL

