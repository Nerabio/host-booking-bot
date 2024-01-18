import { Injectable } from "@nestjs/common";
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
    return this.hostsRepository
      .createQueryBuilder("host")
      .leftJoinAndSelect("host.user", "user")
      .getMany();
  }

  findOne(id: number): Promise<Host> {
    return this.hostsRepository
      .createQueryBuilder("host")
      .leftJoinAndSelect("host.notices", "notice", "notice.status = :status", {
        status: "expect",
      })
      .leftJoinAndSelect("host.user", "user")
      .where("host.id = :hostId")
      .setParameters({ hostId: id })
      .getOne();
  }

  findByName(title: string): Promise<Host> {
    return this.hostsRepository
      .createQueryBuilder("host")
      .leftJoinAndSelect("host.user", "user")
      .where("host.title = :title")
      .setParameters({ title: title })
      .getOne();
  }

  async save(host: Host): Promise<void> {
    await this.hostsRepository.save(host);
  }

  async insert(host: Host): Promise<void> {
    await this.hostsRepository.insert(host);
  }

  async remove(id: string): Promise<void> {
    await this.hostsRepository.delete(id);
  }
}
