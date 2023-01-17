import { Logger, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { configuration } from "./config/configuration";
import { TelegrafModule } from "nestjs-telegraf";
import { EchoModule } from "./modules/echo/echo.module";
import { GreeterBotName } from "./app.constants";
import { DealerModule } from "./modules/dealer/dealer.module";
import { localSessionMiddleware } from "./middleware/session.middleware";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { dataSourceOptions } from "./typeorm.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${__dirname}/config/environments/${process.env.NODE_ENV}.env`,
      load: [configuration],
      cache: true,
    }),
    //TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TelegrafModule.forRootAsync({
      botName: GreeterBotName,
      useFactory: () => ({
        token: `${process.env.TOKEN_BOT}`,
        middlewares: [localSessionMiddleware],
        include: [DealerModule],
      }),
    }),
    EchoModule,
    DealerModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {
  constructor(private dataSource: DataSource) {
    console.log(dataSource);
  }
}
