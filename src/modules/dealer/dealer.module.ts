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

@Module({
  imports: [TypeOrmModule.forFeature([User, Host])],
  providers: [
    DealerUpdate,
    RandomNumberScene,
    HostService,
    InfoScene,
    AdminScene,
    UsersService,
  ],
})
export class DealerModule {}
