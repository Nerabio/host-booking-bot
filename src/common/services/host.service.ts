import { Injectable } from "@nestjs/common";
import { HostModel } from "../models/host.model";

@Injectable()
export class HostService {
  public getAllHost(): HostModel[] {
    return [
      { name: "dev.kion.ru", isBusy: true },
      { name: "prod.kion.ru", isBusy: false },
      { name: "s1.dev.kion.ru", isBusy: true },
      { name: "s2.dev.kion.ru", isBusy: true },
      { name: "s3.dev.kion.ru", isBusy: true },
      { name: "test.kion.ru", isBusy: true },
      { name: "hisense.kion.ru", isBusy: true },
    ];
  }
}
