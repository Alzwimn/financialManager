const ValidationError = require("../errors/ValidationError")

module.exports = (app) => {
    const findAll = (filter = {}) => {
        return app.db("users").where(filter).select(["id", "name", "mail"]);
    }
    const save = async (user) => {
        if(!user.name) throw new ValidationError("Nome é um atributo obrigatório")
        if(!user.mail) throw new ValidationError("Email é um atributo obrigatório")
        if(!user.password) throw new ValidationError("Senha é um atributo obrigatório")

        const userDB = await findAll({ mail:user.mail })
        if(userDB && userDB.length > 0) throw new ValidationError("Já exisite um usuário com esse email") 

        return app.db("users").insert(user, ["id", "name", "mail"])
    }

    return {findAll, save}
}
