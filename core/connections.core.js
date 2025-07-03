const pg = require('pg')

require('dotenv').config();

const sequelize = (seq) => {
    const sequel = new seq(
        connString.DB,
        connString.USER,
        connString.PASSWORD,
        {
            host: connString.HOST,
            port: connString.PORT,
            dialect: connString.DIALECT,
            dialectModule: pg,
            schema: connString.SCHEMA,
            logging: false,
            define: {
                timestamps: true,
                underscored: true,
            }
        }
    )
    return sequel;
}

const connString = {
    DB: process.env.PGSQL_DB,
    USER: process.env.PGSQL_USER,
    PASSWORD: process.env.PGSQL_PASSWORD,
    HOST: process.env.PGSQL_HOST,
    PORT: process.env.PGSQL_PORT,
    SCHEMA: process.env.PGSQL_SCHEMA,
    DIALECT: process.env.PGSQL_DIALECT,
}

module.exports = { sequelize }