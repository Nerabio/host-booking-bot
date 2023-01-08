import { Action, Ctx, Scene, SceneEnter, SceneLeave } from "nestjs-telegraf";
import { Context } from "../../../interfaces/context.interface";
import { Markup } from "telegraf";
import { HostService } from "@common/services/host.service";
import { HostModel } from "@common/models/host.model";
import { SceneEnum } from "@common/enums/scene.enum";
import { UsersService } from "@common/services/users.service";
import { Host } from "@common/entity/host.entity";

export enum ActionPrefix {
  HOST = "select_host->",
}

export function hostsKeyboard() {
  return Markup.inlineKeyboard(
    [
      { text: "Все хосты", callback_data: "allHost" },
      { text: "Все свободные", callback_data: "freeHost" },
      { text: "Поиск по названию", callback_data: "search" },
    ],
    { columns: 2 }
  );
}

export function eventMenuHost() {
  return Markup.inlineKeyboard(
    [
      { text: "Занять", callback_data: "hold" },
      { text: "Запросить", callback_data: "request" },
      { text: "Назад", callback_data: "allHost" },
    ],
    { columns: 2 }
  );
}

export function getSimpleMenu(buttons: HostModel[]) {
  return Markup.keyboard(
    buttons.map((b) => `${b.name} -> [${b.isBusy ? "❌" : "✅"}]`)
  ).resize();
}

export function getHostMenu(buttons: Host[]) {
  return Markup.inlineKeyboard(
    buttons.map((h) => ({
      text: h.title,
      callback_data: ActionPrefix.HOST + h.title,
    })),
    { columns: 2 }
  );
}

@Scene(SceneEnum.INFO_SCENE)
export class InfoScene {
  constructor(
    private hostService: HostService,
    private usersService: UsersService
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    await ctx.replyWithHTML("Я могу помочь с управлением", hostsKeyboard());
  }

  @Action(["allHost"])
  async onAllHost(ctx: Context) {
    await ctx.deleteMessage();
    const allHost = await this.hostService.findAll();
    await ctx.replyWithHTML("<b>Вот все мои хосты</b>", getHostMenu(allHost));
  }

  @Action(new RegExp(`^${ActionPrefix.HOST}`))
  async selectHost(@Ctx() ctx: Context) {
    ctx.session.count = 123;

    ctx.state.m = 1;
    console.log(ctx.session);
    console.log(ctx.state);
    const cbQuery = ctx.update.callback_query;
    const userAnswer = "data" in cbQuery ? cbQuery.data : null;

    await ctx.deleteMessage();

    const allUser = await this.usersService.findAll();
    console.log(allUser);
    const hostName = userAnswer.replace(ActionPrefix.HOST, "");
    await ctx.replyWithHTML(`<b>${hostName}</b>`, eventMenuHost());
  }
}
