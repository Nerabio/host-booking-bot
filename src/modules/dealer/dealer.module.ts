import { Module } from "@nestjs/common";
import { DealerUpdate } from "./dealer.update";
import { RandomNumberScene } from "./scenes/random-number.scene";
import { HostService } from "../../common/services/host.service";
import { InfoScene } from "./scenes/info.scene";

@Module({
  providers: [DealerUpdate, RandomNumberScene, HostService, InfoScene],
})
export class DealerModule {}
