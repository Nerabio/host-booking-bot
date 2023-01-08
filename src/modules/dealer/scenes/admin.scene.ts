import { Ctx, Scene, SceneEnter } from "nestjs-telegraf";
import { SceneEnum } from "@common/enums/scene.enum";
import { Context } from "../../../interfaces/context.interface";

@Scene(SceneEnum.ADMIN)
export class AdminScene {
  constructor() {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: Context) {
    await ctx.replyWithHTML("Управление");
  }
}
