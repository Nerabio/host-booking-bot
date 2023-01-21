import { Action, Ctx, Scene, SceneEnter } from "nestjs-telegraf";
import { Context } from "../../../interfaces/context.interface";
import { Markup } from "telegraf";
import { HostService } from "@common/services/host.service";
import { SceneEnum } from "@common/enums/scene.enum";
import { Host } from "@common/entity/host.entity";
import { User } from "@common/entity/user.entity";
import { format } from "date-fns";

export enum ActionPrefix {
  HOST = "select_host->",
}

export enum ActionHost {
  HOLD = "hold",
  REQUEST = "request",
  EDIT = "edit",
  ALL_HOST = "allHost",
  DISMISS = "dismiss",
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

export function eventMenuHost(isBusy: boolean) {
  return Markup.inlineKeyboard(
    [
      {
        text: `${isBusy ? "🔑 Освободить" : "🔒 Занять"}`,
        callback_data: isBusy ? ActionHost.DISMISS : ActionHost.HOLD,
      },
      { text: "📝 Редактировать", callback_data: ActionHost.EDIT },
      { text: "↩️ Назад", callback_data: "allHost" },
    ],
    { columns: 2 }
  );
}

export function simpleBtnMenu(title: string, actionName: string) {
  return Markup.inlineKeyboard([{ text: title, callback_data: actionName }], {
    columns: 1,
  });
}

export function getHostMenu(hosts: Host[]) {
  const refresh = [
    {
      text: "♻️ REFRESH",
      callback_data: "allHost",
    },
  ];
  return Markup.inlineKeyboard(
    hosts
      .sort((a, b) => (a.title < b.title ? -1 : 1))
      .map((h) => ({
        text: `${h.title} [${h?.user?.id ? "❌" : "✅"}]`,
        callback_data: ActionPrefix.HOST + h.title,
      }))
      .concat([...refresh]),
    { columns: 2 }
  );
}

@Scene(SceneEnum.INFO_SCENE)
export class InfoScene {
  constructor(private hostService: HostService) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    await ctx.replyWithHTML("Я могу помочь с управлением", hostsKeyboard());
  }

  @Action(["allHost"])
  async onAllHost(ctx: Context) {
    await this.deleteMessage(ctx);
    const allHost = await this.hostService.findAll();
    await ctx.replyWithHTML("<b>Вот все мои хосты</b>", getHostMenu(allHost));
  }

  @Action(new RegExp(`^${ActionPrefix.HOST}`))
  async selectHost(@Ctx() ctx: Context) {
    const cbQuery = ctx.update.callback_query;
    const userAnswer = "data" in cbQuery ? cbQuery.data : null;

    await this.deleteMessage(ctx);

    const hostTitle = userAnswer.replace(ActionPrefix.HOST, "");
    const host: Host = await this.hostService.findByName(hostTitle);
    ctx.session.currentHost = host;
    await ctx.replyWithHTML(
      this.renderCartHost(host),
      eventMenuHost(!!host?.user?.id)
    );
  }

  renderCartHost(host: Host): string {
    const rows: string[] = [`<b>${host.title}</b>`];

    if (host.user) {
      rows.push(`<b>👨‍🦰 Пользователем:</b> ${host?.user?.telegramName}`);
      rows.push(
        `<b>⌛ Время:</b> ${format(
          new Date(host?.busyDateTime),
          "dd.MM.yyyy HH:mm"
        )}`
      );
    }
    return rows.join("\n\n");
  }

  isBusy(host: Host): boolean {
    return !!host.user;
  }

  isOwner(host: Host, telegramId: number): boolean {
    return host?.user?.telegramId === telegramId;
  }

  @Action(ActionHost.HOLD)
  async holdHost(@Ctx() ctx: Context) {
    const currentHost: Host = ctx.session.currentHost;
    const currentUser: User = ctx.session.currentUser;
    const host = await this.hostService.findOne(currentHost.id);

    if (this.isBusy(host)) {
      await this.deleteMessage(ctx);
      await ctx.replyWithHTML(
        `⛔ Хост ${host.title} уже занят!!! <b>Пользователем:</b> ${host?.user?.telegramName}`,
        simpleBtnMenu("Выбрать другой хост", "allHost")
      );
      return;
    }

    host.take(currentUser);
    await this.hostService.save(host);
    await ctx.editMessageText(`Вы заняли хост ${host.title}`);
    await this.onAllHost(ctx);
  }

  @Action(ActionHost.DISMISS)
  async dismissHost(@Ctx() ctx: Context) {
    const currentHost: Host = ctx.session.currentHost;
    const currentUser: User = ctx.session.currentUser;
    const host = await this.hostService.findOne(currentHost.id);
    if (!this.isOwner(host, currentUser.telegramId)) {
      console.log(host);
      console.log(currentUser.telegramId);
      await this.deleteMessage(ctx);
      await ctx.replyWithHTML(
        `⛔ Хост ${host.title} занят <b>пользователем:</b> ${host?.user?.telegramName} только он может освободить хост.`,
        simpleBtnMenu("Выбрать другой хост", "allHost")
      );
      return;
    }
    host.dismiss();
    await this.hostService.save(host);
    await ctx.editMessageText(`Хост ${host.title}  свободен!`);
    await this.onAllHost(ctx);
  }

  async deleteMessage(ctx: Context): Promise<void> {
    try {
      await ctx.deleteMessage();
    } catch (e) {
      console.log("deleteMessage");
    }
  }
}
