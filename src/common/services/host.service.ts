import { Injectable } from "@nestjs/common";
import { HostModel } from "../models/host.model";

@Injectable()
export class HostService {
  public getAllHost(): HostModel[] {
    return [
      { name: "dev.kion.ru", status: "free" },
      { name: "prod.kion.ru", status: "busy" },
      { name: "s1.dev.kion.ru", status: "free" },
      { name: "s2.dev.kion.ru", status: "free" },
      { name: "s3.dev.kion.ru", status: "free" },
      { name: "test.kion.ru", status: "free" },
      { name: "hisense.kion.ru", status: "free" },
    ];
  }
}
