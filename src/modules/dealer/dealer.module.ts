import { Module } from "@nestjs/common";
import { DealerUpdate } from "./dealer.update";
import { RandomNumberScene } from "./scenes/random-number.scene";
import { HostService } from "@common/services/host.service";
import { InfoScene } from "./scenes/info.scene";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@common/entity/user.entity";
import { UsersService } from "@common/services/users.service";
import { AdminScene } from "./scenes/admin.scene";
import { Host } from "@common/entity/host.entity";
import { NoticeService } from "@common/services/notice.service";
import { Notice } from "@common/entity/notice.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Host, Notice])],
  providers: [
    DealerUpdate,
    RandomNumberScene,
    HostService,
    InfoScene,
    AdminScene,
    UsersService,
    NoticeService,
  ],
})
export class DealerModule {}
