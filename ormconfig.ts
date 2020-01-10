const config = require("dotenv-safe").config().required;
module.exports = {
  type: config.DB_TYPE,
  host: config.HOST,
  database: config.DB,
  port: config.DB_PORT,
  username: config.DB_USER,
  password: config.DB_PASSWORD,
  entities: ["dist/entities/*.js"],
  logging: true,
  synchronize: false,
  migrationsRun: true,
  cli: {
    entitiesDir: "src/entities"
  },
  extra: {
    connectionLimit: 20
  }
};
