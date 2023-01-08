import { Injectable } from "@nestjs/common";
import { HostModel } from "../models/host.model";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Host } from "@common/entity/host.entity";

@Injectable()
export class HostService {
  constructor(
    @InjectRepository(Host)
    private hostsRepository: Repository<Host>
  ) {}

  findAll(): Promise<Host[]> {
    return this.hostsRepository.find();
  }

  findOne(id: number): Promise<Host> {
    return this.hostsRepository.findOneBy({ id });
  }

  async create(host: Host): Promise<void> {
    await this.hostsRepository.save(host);
  }

  async remove(id: string): Promise<void> {
    await this.hostsRepository.delete(id);
  }
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
