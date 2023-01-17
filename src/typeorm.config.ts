import { DataSource } from "typeorm";
import { DataSourceOptions } from "typeorm/data-source/DataSourceOptions";

export const dataSourceOptions: DataSourceOptions = {
  migrationsTableName: "migrations",
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "habrpguser",
  password: "pgpwd4habr",
  database: "postgres",
  synchronize: true,
  entities: ["/**/*.entity.js"],
  migrations: [__dirname + "/migrations/**/*.ts"],
  subscribers: [__dirname + "/subscriber/**/*.js"],
  extra: {
    charset: "utf8mb4_unicode_ci",
  },
  logging: true,
};

const connectionSource = new DataSource(dataSourceOptions);

connectionSource
  .initialize()
  .then(() => {
    console.log("connection bd initialize");
  })
  .catch(() => {
    console.log("Error connection bd");
  });

export default connectionSource;
