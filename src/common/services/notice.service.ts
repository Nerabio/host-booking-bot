import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Notice } from "@common/entity/notice.entity";
import { Repository } from "typeorm";
import { Host } from "@common/entity/host.entity";

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private noticeRepository: Repository<Notice>
  ) {}
  async save(notice: Notice): Promise<void> {
    await this.noticeRepository.insert(notice);
  }

  async findByHostId(host: Host): Promise<Notice> {
    return await this.noticeRepository.findOneBy(host);
  }

  async markCompleted(notice: Notice): Promise<void> {
    notice.status = "complete";
    notice.sendDateTime = new Date();
    await this.noticeRepository.save(notice);
  }
}
