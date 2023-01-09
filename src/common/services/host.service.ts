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
    return this.hostsRepository.find({
      relations: {
        user: true,
      },
    });
  }

  findOne(id: number): Promise<Host> {
    return this.hostsRepository.findOneBy({ id });
  }

  findByName(title: string): Promise<Host> {
    return this.hostsRepository.findOneBy({ title });
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
