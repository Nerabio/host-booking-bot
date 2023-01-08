import { DataSource } from "typeorm";
import { DataSourceOptions } from "typeorm/data-source/DataSourceOptions";

const options: DataSourceOptions = {
  migrationsTableName: "migrations",
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "habrpguser",
  password: "pgpwd4habr",
  database: "postgres",
  synchronize: true,
  entities: [__dirname + "/common/entity/**/*.entity.js"],
  migrations: [__dirname + "/migrations/**/*.ts"],
  subscribers: [__dirname + "/subscriber/**/*.js"],
  extra: {
    charset: "utf8mb4_unicode_ci",
  },
  logging: true,
};
export const connectionSource = new DataSource(options);
