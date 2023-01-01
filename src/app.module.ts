import { Logger, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { configuration } from "./config/configuration";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${__dirname}/config/environments/${process.env.NODE_ENV}.env`,
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
