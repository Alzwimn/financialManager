const request = require("supertest")
const jwt = require("jwt-simple")

const app = require("../../src/app")
const MAIN_ROUTE = "/v1/users"

const mail = `${Date.now()}@mail.com`
let user;

beforeAll( async () => {
    const response = await app.services.user.save({name: "User Acount", mail: `${Date.now()}@mail`, password:"123456"} )
    user = { ...response[0] }
    user.token = jwt.encode(user, "Segredo")
})

test("Deve listar todos os usuarios", () => {
    return request(app).get(MAIN_ROUTE)
    .set("authorization", `bearer ${user.token}`)
    .then((res) => {
        expect(res.status).toBe(200)
        expect(res.body.length).toBeGreaterThan(0)
    })
})

test("Deve inserir usuário com sucesso", () => {
    return request(app).post(MAIN_ROUTE)
        .send({name: "Walter Mitty", mail, password:"123456"})
        .set("authorization", `bearer ${user.token}`)
        .then((res) => {
            expect(res.status).toBe(201)
            expect(res.body.name).toBe("Walter Mitty")
            expect(res.body).not.toHaveProperty("password")
        })
})

test("Deve armazenar senha criptografada", async () => {
    const response = await request(app).post(MAIN_ROUTE)
                        .send({name: "Walter Mitty", mail:`${Date.now()}@mail.com`, password:"123456"})
                        .set("authorization", `bearer ${user.token}`)
    expect(response.status).toBe(201)
    
    const {id} = response.body
    const userDB = await app.services.user.findOne({id})
    expect(userDB.password).not.toBeUndefined()
    expect(userDB.password).not.toBe("123456")
})

test("Não deve inserir usuário sem nome", () => {
    return request(app).post(MAIN_ROUTE)
        .send({mail:"teste@email.com", password:"123456"})
        .set("authorization", `bearer ${user.token}`)
        .then((response) => {
            expect(response.status).toBe(400)
            expect(response.body.error).toBe("Nome é um atributo obrigatório")
        })

})

test("Não deve inserir usuário sem email", async () => {
    const result = await request(app).post(MAIN_ROUTE)
        .send( { name: "Teste email", password: "123456"} )
        .set("authorization", `bearer ${user.token}`)
    expect(result.status).toBe(400)
    expect(result.body.error).toBe("Email é um atributo obrigatório")

})

test("Usuário sem senha", (done) => {
    request(app).post(MAIN_ROUTE)
        .send({ name: "Teste Senha", mail: "teste@mail.com"})
        .set("authorization", `bearer ${user.token}`)
        .then((result) => {
            expect(result.status).toBe(400)
            expect(result.body.error).toBe("Senha é um atributo obrigatório")
            done()
        })
})

test("Não deve inserir usuário com email existente", () => {
    return request(app).post(MAIN_ROUTE)
        .send({name: "Walter Mitty", mail, password:"123456"})
        .set("authorization", `bearer ${user.token}`)
        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body.error).toBe("Já exisite um usuário com esse email")
        })
})
