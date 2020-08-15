module.exports = {
    test: {
        client: "pg",
        version: "9.6",
        connection: {
            host: "127.0.0.1",
            user: "postgres",
            password: "123456",
            database: "financial"
        },
        migrations: {
            directory: "src/migrations"
        }
    }
} 