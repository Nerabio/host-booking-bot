import { Controller, Get, Logger } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: Logger
  ) {}

  @Get()
  getHello(): string {
    this.logger.debug("start method getHello");
    return this.appService.getHello();
  }
}
