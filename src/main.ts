import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { createLogger } from "winston";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";
import { utilities as nestWinstonModuleUtilities } from "nest-winston";
import * as path from "path";

async function bootstrap() {
  const instance = createLogger({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console({
        level: "debug",
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          nestWinstonModuleUtilities.format.nestLike("Bot", {
            // options
          })
        ),
      }),
      new winston.transports.File({
        dirname: path.join(__dirname, "./../log/debug/"), //path to where save loggin result
        filename: "debug.log", //name of file where will be saved logging result
        level: "debug",
      }),
      new winston.transports.File({
        dirname: path.join(__dirname, "./../log/info/"),
        filename: "info.log",
        level: "info",
      }),
    ],
  });
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance,
    }),
  });
  await app.listen(process.env.PORT ? parseInt(process.env.PORT) : 3000);
}
bootstrap();
