import { Injectable } from "@nestjs/common";
import { NavigationService } from "@common/services/navigation.service";
import { Host } from "@common/entity/host.entity";
import { Markup } from "telegraf";
import { ActionPrefix } from "../../modules/dealer/scenes/info.scene";

@Injectable()
export class MenuService {
  constructor(private navigationService: NavigationService) {}

  private getGroupButtons(): { text: string; callback_data: string }[] {
    return [
      {
        text: "♻️ Обновить" + this.navigationService.getCurrentRout(),
        callback_data: this.navigationService.getCurrentRout(),
      },
      {
        text: "<- Назад " + this.navigationService.getPrevAction(),
        callback_data: this.navigationService.getPrevAction(),
      },
      // {
      //   text: this.navigationService.getAllRoute(),
      //   callback_data: this.navigationService.getPrevRout(),
      // },
    ];
  }

  getHostMenu(hosts: Host[]) {
    const callbackButtons = this.getGroupButtons();
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
}
