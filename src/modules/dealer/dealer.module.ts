import { Module } from "@nestjs/common";
import { DealerUpdate } from "./dealer.update";
import { RandomNumberScene } from "./scenes/random-number.scene";

@Module({
  providers: [DealerUpdate, RandomNumberScene],
})
export class DealerModule {}
