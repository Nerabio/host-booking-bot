import { Logger, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { configuration } from "./config/configuration";
import { TelegrafModule } from "nestjs-telegraf";
import { EchoModule } from "./modules/echo/echo.module";
import { GreeterBotName } from "./app.constants";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${__dirname}/config/environments/${process.env.NODE_ENV}.env`,
      load: [configuration],
      cache: true,
    }),
    TelegrafModule.forRoot({
      botName: GreeterBotName,
      token: `${process.env.TOKEN_BOT}`,
      include: [EchoModule],
    }),
    EchoModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
