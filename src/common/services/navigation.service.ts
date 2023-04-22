import { Injectable } from "@nestjs/common";

@Injectable()
export class NavigationService {
  private route: string[] = [];

  setCurrentRoute(route: string): void {
    if (route !== this.route[0]) {
      this.route.push(route);
    }
  }

  getCurrentRout(): string | null {
    return this.route.length > 0 ? this.route[0] : null;
  }

  getPrevRout(): string | null {
    return this.route.length > 1 ? this.route[1] : null;
  }
}
