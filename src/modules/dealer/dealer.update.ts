import {
  Command,
  Ctx,
  Hears,
  Start,
  Update,
  Sender,
  Action,
  Message,
  On,
} from "nestjs-telegraf";
import { UpdateType as TelegrafUpdateType } from "telegraf/typings/telegram-types";
import { HELLO_SCENE_ID, NODE_SCENE_ID } from "../../app.constants";
import { Context } from "../../interfaces/context.interface";
import { Update as UT } from "telegraf/typings/core/types/typegram";
import { UpdateType } from "../../common/decorators/update-type.decorator";
import { Markup } from "telegraf";
import { ReverseTextPipe } from "../../common/pipes/reverse-text.pipe";

export function getMainMenu() {
  return Markup.keyboard([
    ["Мои задачи", "Добавить задачу"],
    ["Смотивируй меня"],
  ]).resize();
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

@Update()
export class DealerUpdate {
  @Start()
  onStart(): string {
    return "Say hello to me";
  }

  @Hears(["hi", "hello", "hey", "qq"])
  onGreetings(
    @UpdateType() updateType: TelegrafUpdateType,
    @Sender("first_name") firstName: string
  ): string {
    return `Hey ${firstName}`;
  }

  @Hears(["Смотивируй меня"])
  motivation(@Ctx() ctx: Context, @Sender("first_name") firstName: string) {
    ctx.replyWithPhoto(
      "https://img2.goodfon.ru/wallpaper/nbig/7/ec/justdoit-dzhastduit-motivaciya.jpg",
      {
        caption: "Не вздумай сдаваться!",
      }
    );
  }

  @Command("scene")
  async onSceneCommand(
    @Ctx() ctx: Context,
    @Message("text") text: string
  ): Promise<void> {
    console.log(ctx);
    if (text === "rnd") {
      await ctx.scene.enter(HELLO_SCENE_ID);
    } else {
      await ctx.scene.enter(HELLO_SCENE_ID);
      //await ctx.scene.enter(NODE_SCENE_ID);
    }
  }

  @Command("name")
  async enter(@Ctx() ctx: Context) {
    ctx.reply("2+2 = ?", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Может быть 4?", callback_data: "4" }],
          [{ text: "Точно пять!", callback_data: "5" }],
        ],
      },
    });
  }

  @Command("key")
  async key(@Ctx() ctx: Context) {
    //await ctx.reply("Welcome, bro", getMainMenu());
    await ctx.replyWithHTML(
      "Приветсвую в <b>TaskManagerBot</b>\n\n" +
        "Чтобы быстро добавить задачу, просто напишите ее и отправьте боту",
      getMainMenu()
    );
  }

  @Action(/4|5/)
  async onAnswer(@Ctx() context: Context & { update: UT.CallbackQueryUpdate }) {
    const cbQuery = context.update.callback_query;
    const userAnswer = "data" in cbQuery ? cbQuery.data : null;
    context.answerCbQuery();
    if (userAnswer === "4") {
      context.reply("верно! ✅");
      context.scene.enter(HELLO_SCENE_ID);
    } else {
      context.reply("подумай еще ❌");
    }
  }

  @On("text")
  onMessage(@Ctx() ctx: Context, @Message("text") text: string) {
    ctx.replyWithHTML(
      `Вы действительно хотите добавить задачу:\n\n` + `<i>${text}</i>`,
      yesNoKeyboard()
    );
  }

  @Action(["yes", "no"])
  async onAc(@Ctx() ctx: Context & { update: UT.CallbackQueryUpdate }) {
    const cbQuery = ctx.update.callback_query;
    const userAnswer = "data" in cbQuery ? cbQuery.data : null;
    if (userAnswer === "yes") {
      ctx.editMessageText("Ваша задача успешно добавлена");
    } else {
      ctx.deleteMessage();
    }
  }
}
