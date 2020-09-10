const bycrpt = require("bcrypt-nodejs")
const ValidationError = require("../errors/ValidationError")

module.exports = (app) => {
    const findAll = () => {
        return app.db("users").select(["id", "name", "mail"]);
    }

    const findOne = (filter = {}) => {
        return app.db("users").where(filter).first()
    }

    const getPasswordHash = (pass) => {
        const salt = bycrpt.genSaltSync(10)
        return bycrpt.hashSync(pass, salt)
    }

    const save = async (user) => {
        if(!user.name) throw new ValidationError("Nome é um atributo obrigatório")
        if(!user.mail) throw new ValidationError("Email é um atributo obrigatório")
        if(!user.password) throw new ValidationError("Senha é um atributo obrigatório")

        const userDB = await findOne({ mail:user.mail })
        if(userDB) throw new ValidationError("Já exisite um usuário com esse email") 

        const newUser = { ...user}
        newUser.password = getPasswordHash(user.password)

        return app.db("users").insert(newUser, ["id", "name", "mail"])
    }

    return {findAll, save, findOne}
}
