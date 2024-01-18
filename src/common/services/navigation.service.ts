import { Injectable } from "@nestjs/common";
import { ActionHost } from "../../modules/dealer/scenes/info.scene";

const MAX_COUNT_ROUTE = 5;
@Injectable()
export class NavigationService {
  private allowedAction: ActionHost[] = [
    ActionHost.ALL_HOST,
    ActionHost.FREE_HOST,
    ActionHost.MAIN,
  ];
  private route: string[] = [];

  addActionToChain(actionName: string): void {
    const isNotAllowedAction = !this.allowedAction.some(
      (action) => action === actionName
    );
    if (isNotAllowedAction) {
      return;
    }
    if (actionName !== this.route[0]) {
      this.route.unshift(actionName);
    }
    if (this.route.length >= MAX_COUNT_ROUTE) {
      //delete this.route[this.route.length - 1];
      this.route.pop();
    }
  }

  getCurrentRout(): string | null {
    return this.route.length > 0 ? this.route[0] : ActionHost.MAIN;
  }

  getPrevAction(): string | null {
    return this.route.length > 1 ? this.route[1] : ActionHost.MAIN;
  }

  getAllRoute(): string {
    return this.route.join(",");
  }
}
