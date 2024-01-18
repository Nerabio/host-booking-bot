import { Action, Ctx, Scene, SceneEnter } from "nestjs-telegraf";
import { Context } from "../../../interfaces/context.interface";
import { Markup } from "telegraf";
import { HostService } from "@common/services/host.service";
import { SceneEnum } from "@common/enums/scene.enum";
import { Host } from "@common/entity/host.entity";
import { User } from "@common/entity/user.entity";
import { format } from "date-fns";
import { NoticeService } from "@common/services/notice.service";
import { Notice } from "@common/entity/notice.entity";
import { NotFoundException, UseInterceptors } from "@nestjs/common";
import { NavigationService } from "@common/services/navigation.service";
import { NavigationInterceptor } from "@common/interceptors/navigation-interceptor.service";
import { MenuService } from "@common/services/menu.service";

export enum ActionPrefix {
  HOST = "select_host->",
}

export enum ActionHost {
  HOLD = "hold",
  REQUEST = "request",
  EDIT = "edit",
  ALL_HOST = "allHost",
  DISMISS = "dismiss",
  NOTICE = "notice",
  FREE_HOST = "freeHost",
  MAIN = "main",
}

export function hostsKeyboard() {
  return Markup.inlineKeyboard(
    [
      { text: "Все хосты", callback_data: ActionHost.ALL_HOST },
      { text: "Все свободные", callback_data: ActionHost.FREE_HOST },
      // { text: "Поиск по названию", callback_data: "search" },
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
      { text: "🔔 Следить", callback_data: ActionHost.NOTICE },
      { text: "📝 Редактировать", callback_data: ActionHost.EDIT },
      { text: "↩️ Назад", callback_data: ActionHost.ALL_HOST },
    ],
    { columns: 2 }
  );
}

export function simpleBtnMenu(title: string, actionName: string) {
  return Markup.inlineKeyboard([{ text: title, callback_data: actionName }], {
    columns: 1,
  });
}

export function getHostMenu(hosts: Host[], refreshCommand: ActionHost) {
  const callbackButtons = [
    {
      text: "♻️ Обновить",
      callback_data: refreshCommand,
    },
  ];
  return Markup.inlineKeyboard(
    hosts
      .sort((a, b) => (a.title < b.title ? -1 : 1))
      .map((h) => ({
        text: `${h.title} [${h?.user?.id ? "❌" : "✅"}]`,
        callback_data: ActionPrefix.HOST + h.title,
      }))
      .concat([...callbackButtons]),
    { columns: 2 }
  );
}

@UseInterceptors(NavigationInterceptor)
@Scene(SceneEnum.INFO_SCENE)
export class InfoScene {
  constructor(
    private hostService: HostService,
    private noticeService: NoticeService,
    private menuService: MenuService
  ) {}

  @SceneEnter()
  @Action(["main"])
  async onSceneEnter(@Ctx() ctx: Context) {
    await this.deleteMessage(ctx);
    await ctx.replyWithHTML("Я могу помочь с управлением", hostsKeyboard());
  }

  @Action(["allHost"])
  async onAllHost(ctx: Context) {
    await this.deleteMessage(ctx);
    const allHost = await this.hostService.findAll();
    await ctx.replyWithHTML(
      "<b>Вот все мои хосты</b>",
      this.menuService.getHostMenu(allHost)
    );
  }

  @Action(["freeHost"])
  async onFreeHost(ctx: Context) {
    await this.deleteMessage(ctx);
    const allFreeHost = await this.hostService.findAll();
    await ctx.replyWithHTML(
      "<b>Вот все мои свободные хосты</b>",
      this.menuService.getHostMenu(
        allFreeHost.filter((host) => !host?.user?.id)
      )
    );
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
    const rows: string[] = [`<b>${host?.title}</b>`];

    if (host?.user) {
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
    return !!host?.user;
  }

  isOwner(host: Host, telegramId: string): boolean {
    return host?.user?.telegramId === telegramId;
  }

  @Action(ActionHost.HOLD)
  async holdHost(@Ctx() ctx: Context) {
    const currentHost: Host = ctx.session.currentHost;
    const currentUser: User = ctx.session.currentUser;
    const host = await this.hostService.findOne(currentHost.id);

    if (!host) {
      throw new NotFoundException();
    }
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

    console.log(host?.notices);
    await this.sendNotice(ctx, host);
  }

  @Action(ActionHost.NOTICE)
  async saveNoticeHost(@Ctx() ctx: Context) {
    const currentHost: Host = ctx.session.currentHost;
    const host = await this.hostService.findOne(currentHost.id);
    const notice = new Notice();
    notice.host = host;
    notice.message = `Хост ${host.title} освободился, успейте его занять`;
    notice.chatId = ctx.from.id.toString();

    await this.noticeService.save(notice);
    await this.onAllHost(ctx);
  }

  async sendNotice(ctx: Context, host: Host): Promise<void> {
    host.notices.forEach((notice) => {
      setTimeout(() => {
        ctx.telegram.sendMessage(
          notice.chatId,
          notice.message,
          simpleBtnMenu("Выбрать этот хост'", ActionPrefix.HOST + host.title)
        );
        this.noticeService.markCompleted(notice);
      }, 5000);
    });
  }
  async deleteMessage(ctx: Context): Promise<void> {
    try {
      await ctx.deleteMessage();
    } catch (e) {
      console.log("deleteMessage");
    }
  }
}
