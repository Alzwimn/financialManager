module.exports = (app) => {
    const findAll = (filter = {}) => {
        return app.db("users").where(filter).select();
    }
    const save = async (user) => {
        if(!user.name) return { error: "Nome é um atributo obrigatório"}
        if(!user.mail) return { error: "Email é um atributo obrigatório"}
        if(!user.password) return { error: "Senha é um atributo obrigatório"}

        const userDB = await findAll({ mail:user.mail })
        if(userDB && userDB.length > 0) return {error: "Já exisite um usuário com esse email"} 

        return app.db("users").insert(user, "*")
    }

    return {findAll, save}
}
