const request = require("supertest");
const app = require("../../src/app")

const MAIN_ROUTE = "/accounts"
let user;

beforeAll( async () => {
    const response = await app.services.user.save({name: "User Acount", mail: `${Date.now()}@mail`, password:"123456"} )
    user = { ...response[0] }
})

test("Deve inserir uma conta com sucesso", ()=>{
    return request(app).post(MAIN_ROUTE)
            .send({name: "Acc #1", user_id: user.id})
            .then((result) => {
                expect(result.status).toBe(201)
                expect(result.body.name).toBe("Acc #1")
            })
}) 

test("Deve listar todas as contas", () => {
    return app.db("accounts")
            .insert({name: "Acc list", user_id: user.id})
            .then(() => request(app).get(MAIN_ROUTE))
            .then((response) => {
                expect(response.status).toBe(200)
                expect(response.body.length).toBeGreaterThan(0)
            })
})

test("Deve retornar uma conta por ID", () => {
    return app.db("accounts")
            .insert({name: "Acc By Id", user_id: user.id}, ["id"])
            .then(acc => request(app).get(`${MAIN_ROUTE}/${acc[0].id}`))
            .then( result => {
                expect(result.status).toBe(200)
                expect(result.body.name).toBe("Acc By Id")
                expect(result.body.user_id).toBe(user.id)
            })
})

test("Deve alterar uma conta", () => {
    return app.db("accounts")
            .insert({name: "Acc to Update", user_id: user.id}, ["id"])
            .then(acc => request(app).put(`${MAIN_ROUTE}/${acc[0].id}`)
                .send({name:"Acc Updated"}))
            .then(result => {
                expect(result.status).toBe(200)
                expect(result.body.name).toBe("Acc Updated")
            })    
})

test("Deve remover uma conta", () => {
    return app.db("accounts")
            .insert({name: "Acc to remove", user_id: user.id}, ["id"])
            .then(acc => request(app).delete(`${MAIN_ROUTE}/${acc[0].id}`))
            .then(result => {
                expect(result.status).toBe(204)
            })

})