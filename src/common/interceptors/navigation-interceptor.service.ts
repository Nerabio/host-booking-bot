import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { Context } from "../../interfaces/context.interface";
import { Context as TelegrafContext } from "telegraf";
import { NavigationService } from "@common/services/navigation.service";

@Injectable()
export class NavigationInterceptor implements NestInterceptor {
  constructor(private navigationService: NavigationService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log("TestInterceptor...");
    const args = context.getArgs<[Context]>();
    if (args.length > 0) {
      const telegrafContext: TelegrafContext = args[0];
      const actionName = telegrafContext["match"][0];
      this.navigationService.addActionToChain(actionName);
      console.log(this.navigationService.getAllRoute());
    }

    return next.handle();
  }
}
