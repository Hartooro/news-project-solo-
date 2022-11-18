const { request } = require("./app");

describe('9 get api users', () => {
    test('status 200 should return an array of users containing user, name, avatar_url properties', () => {
        return request(app).get("/api/users").expect(200).then((response)=>{
            response.body.users.forEach((user)=>{
                expect(user).toEqual(expect.objectContaining({
                    username: expect.any(String),
                    name : expect.any(String),
                    avatar_url : expect.any(String)
                }))
            })
        })
    })
    test('bad request if added any parameters ', () => {
        return request(app).get("/api/users/124").expect(400).then((response)=>{
            expect(response.body.msg).toBe("notreallysure")
        })
    });;
});