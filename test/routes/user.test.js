const { TestScheduler } = require("jest")
const request = require("supertest")

const app = require("../../src/app")
const mail = `${Date.now()}@mail.com`

test("Deve listar todos os usuarios", () => {
    return request(app).get("/users")
    .then((res) => {
        expect(res.status).toBe(200)
        expect(res.body.length).toBeGreaterThan(0)
    })
})

test.skip("Deve inserir usuário com sucesso", () => {
    return request(app).post("/users")
        .send({name: "Walter Mitty", mail, password:"123456"})
        .then((res) => {
            expect(res.status).toBe(201)
            expect(res.body.name).toBe("Walter Mitty")
        })
})

test("Não deve inserir usuário sem nome", () => {
    return request(app).post("/users")
        .send({mail:"teste@email.com", password:"123456"})
        .then((response) => {
            expect(response.status).toBe(400)
            expect(response.body.error).toBe("Nome é um atributo obrigatório")
        })

})

test("Não deve inserir usuário sem email", async () => {
    const result = await request(app).post("/users")
        .send( { name: "Teste email", password: "123456"} )
    expect(result.status).toBe(400)
    expect(result.body.error).toBe("Email é um atributo obrigatório")

})

test("Usuário sem senha", (done) => {
    request(app).post("/users")
        .send({ name: "Teste Senha", mail: "teste@mail.com"})
        .then((result) => {
            expect(result.status).toBe(400)
            expect(result.body.error).toBe("Senha é um atributo obrigatório")
            done()
        })
})

test("Não deve inserir usuário com email existente", () => {
    return request(app).post("/users")
        .send({name: "Walter Mitty", mail, password:"123456"})
        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body.error).toBe("Já exisite um usuário com esse email")
        })
})
