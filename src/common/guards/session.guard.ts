import { CanActivate, ExecutionContext } from "@nestjs/common";
import { TelegrafExecutionContext } from "nestjs-telegraf";
import { Context } from "../../interfaces/context.interface";
import { Markup } from "telegraf";

export class SessionGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log("SessionGuard");
    const ctx = TelegrafExecutionContext.create(context);
    //const currentUser = ctx.getContext<Context>()?.session?.currentUser;
    //if (!currentUser) {
    //console.log(currentUser);
    console.log("Current user lost 😡");
    await ctx
      .getContext<Context>()
      .replyWithHTML(
        "drgdrgdr",
        Markup.inlineKeyboard([{ text: "↩️ Назад", callback_data: "start" }])
      );
    await ctx.getContext<Context>().scene.reset();
    return Promise.resolve(false);
  }
}
