import { Scene, SceneEnter, SceneLeave, Command } from "nestjs-telegraf";
import { Context } from "../../../interfaces/context.interface";
import { SceneEnum } from "../../../common/enums/scene.enum";

@Scene(SceneEnum.HELLO_SCENE)
export class RandomNumberScene {
  @SceneEnter()
  onSceneEnter(): string {
    console.log("Enter to scene");
    return "Welcome on scene ✋ RandomNumberScene";
  }

  @SceneLeave()
  onSceneLeave(): string {
    console.log("Leave from scene");
    return "Bye Bye 👋";
  }

  @Command(["rnd", "random"])
  onRandomCommand(): number {
    console.log('Use "random" command');
    return Math.floor(Math.random() * 11);
  }

  @Command("leave")
  async onLeaveCommand(ctx: Context): Promise<void> {
    await ctx.scene.leave();
  }
}
