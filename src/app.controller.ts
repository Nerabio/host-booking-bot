import { Controller, Get, Logger } from "@nestjs/common";
import { AppService } from "./app.service";
import { ConfigService } from "@nestjs/config";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    private readonly logger: Logger
  ) {}

  @Get()
  getHello(): string {
    this.logger.debug("start method getHello");
    console.log(this.configService.get<string>("jwt.secret"));
    console.log(this.configService.get<string>("tokenBot"));
    console.log(process.env.TOKEN_BOT);

    return this.appService.getHello();
  }
}
