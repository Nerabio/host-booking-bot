import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class AppService {
  constructor(private readonly logger: Logger) {}
  getHello(): string {
    return "Hello World!";
  }

  //@Cron("45 * * * * *")
  handleCron() {
    this.logger.debug("start method getHello");
  }
}
