import { Command, Ctx, Start, Update, Action } from "nestjs-telegraf";
import { Context } from "../../interfaces/context.interface";
import { Update as UT } from "telegraf/typings/core/types/typegram";
import { Markup } from "telegraf";
import { HostModel } from "@common/models/host.model";
import { SceneEnum } from "@common/enums/scene.enum";
import { UsersService } from "@common/services/users.service";
import { User } from "@common/entity/user.entity";

export function getMainMenu() {
  return Markup.keyboard([
    ["Мои задачи", "Добавить задачу"],
    ["Смотивируй меня"],
  ]).resize();
}

export function getSimpleMenu(buttons: HostModel[]) {
  return Markup.keyboard(buttons.map((b) => b.name)).resize();
}

export function yesNoKeyboard() {
  return Markup.inlineKeyboard(
    [
      { text: "Да", callback_data: "yes" },
      { text: "Нет", callback_data: "no" },
    ],
    { columns: 2 }
  );
}

export function mainNavigation() {
  return Markup.inlineKeyboard(
    [
      { text: "Хосты", callback_data: "hosts" },
      { text: "Админка", callback_data: "admin" },
    ],
    { columns: 2 }
  );
}

@Update()
export class DealerUpdate {
  //private gCtx: Context;

  constructor(private usersService: UsersService) {}
  @Start()
  async onStart(@Ctx() ctx: Context) {
    let user = await this.usersService.findOneByTelegramId(
      ctx.from.id.toString()
    );
    if (!user) {
      user = new User();
      user.telegramId = ctx.from.id.toString();
      user.firstName = ctx.from?.first_name;
      user.lastName = ctx.from?.last_name;
      user.telegramName = ctx.from?.username ?? user?.firstName;
      await this.usersService.save(user);
    }
    ctx.session.currentUser = user;
    ctx.replyWithHTML(
      "Приветсвую! Я твой <b>Хост Диллер</b>\n\n" +
        ctx.from.first_name +
        "\n\n" +
        ctx.from.last_name +
        "\n\n" +
        ctx.from.username +
        "\n\n" +
        ctx.from.id +
        "\n\n" +
        "Вот что у меня для тебя есть",
      mainNavigation()
    );
  }

  @Action(["hosts", "admin"])
  async onAc(@Ctx() ctx: Context & { update: UT.CallbackQueryUpdate }) {
    const cbQuery = ctx.update.callback_query;
    const userAnswer = "data" in cbQuery ? cbQuery.data : null;
    //ctx.editMessageText("Ваша задача успешно добавлена");
    await ctx.deleteMessage();
    switch (userAnswer) {
      case "hosts":
        await ctx.scene.enter(SceneEnum.INFO_SCENE);
        break;
      case "admin":
        await ctx.scene.enter(SceneEnum.ADMIN);
        break;
    }
  }

  // @Hears(["hi", "hello", "hey", "qq"])
  // onGreetings(
  //   @UpdateType() updateType: TelegrafUpdateType,
  //   @Sender("first_name") firstName: string
  // ): string {
  //   return `Hey ${firstName}`;
  // }

  // @Hears(["Смотивируй меня"])
  // motivation(@Ctx() ctx: Context, @Sender("first_name") firstName: string) {
  //   ctx.replyWithPhoto(
  //     "https://img2.goodfon.ru/wallpaper/nbig/7/ec/justdoit-dzhastduit-motivaciya.jpg",
  //     {
  //       caption: "Не вздумай сдаваться!",
  //     }
  //   );
  // }

  @Command("whereiam")
  async whereIAm(@Ctx() ctx: Context): Promise<void> {
    const sceneId = ctx.scene.current?.id;
    await ctx.reply(`Вы сейчас на сцене с ид: ${sceneId}`);
  }

  // @Command("scene")
  // async onSceneCommand(
  //   @Ctx() ctx: Context,
  //   @Message("text") text: string
  // ): Promise<void> {
  //   console.log(ctx);
  //   if (text === "rnd") {
  //     await ctx.scene.enter(HELLO_SCENE_ID);
  //   } else {
  //     await ctx.scene.enter(HELLO_SCENE_ID);
  //     //await ctx.scene.enter(NODE_SCENE_ID);
  //   }
  // }

  // @Command("info")
  // async onSceneInfo(
  //   @Ctx() ctx: Context,
  //   @Message("text") text: string
  // ): Promise<void> {
  //   await ctx.scene.enter(INFO_SCENE_ID);
  // }

  // @Command("name")
  // async enter(@Ctx() ctx: Context) {
  //   ctx.reply("2+2 = ?", {
  //     reply_markup: {
  //       inline_keyboard: [
  //         [{ text: "Может быть 4?", callback_data: "4" }],
  //         [{ text: "Точно пять!", callback_data: "5" }],
  //       ],
  //     },
  //   });
  // }

  // @Command("key")
  // async key(@Ctx() ctx: Context) {
  //   //await ctx.reply("Welcome, bro", getMainMenu());
  //   await ctx.replyWithHTML(
  //     "Приветсвую в <b>TaskManagerBot</b>\n\n" +
  //       "Чтобы быстро добавить задачу, просто напишите ее и отправьте боту",
  //     getMainMenu()
  //   );
  // }

  // @Action(/4|5/)
  // async onAnswer(@Ctx() context: Context & { update: UT.CallbackQueryUpdate }) {
  //   const cbQuery = context.update.callback_query;
  //   const userAnswer = "data" in cbQuery ? cbQuery.data : null;
  //   context.answerCbQuery();
  //   if (userAnswer === "4") {
  //     context.reply("верно! ✅");
  //     context.scene.enter(HELLO_SCENE_ID);
  //   } else {
  //     context.reply("подумай еще ❌");
  //   }
  // }

  //@Cron("45 * * * * *")
  //@Cron(CronExpression.EVERY_30_SECONDS)
  // time() {
  //   if (this.gCtx) {
  //     this.gCtx.reply("подумай еще ❌");
  //   }
  // }
  // @On("text")
  // onMessage(@Ctx() ctx: Context, @Message("text") text: string) {
  //   ctx.replyWithHTML(
  //     `Вы действительно хотите добавить задачу:\n\n` + `<i>${text}</i>`,
  //     yesNoKeyboard()
  //   );
  // }
  //
  // @Action(["yes", "no"])
  // async onAc(@Ctx() ctx: Context & { update: UT.CallbackQueryUpdate }) {
  //   const cbQuery = ctx.update.callback_query;
  //   const userAnswer = "data" in cbQuery ? cbQuery.data : null;
  //   if (userAnswer === "yes") {
  //     ctx.editMessageText("Ваша задача успешно добавлена");
  //   } else {
  //     ctx.deleteMessage();
  //   }
  // }
}
