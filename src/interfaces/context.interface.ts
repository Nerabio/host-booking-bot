import { Scenes } from "telegraf";
import { Update as UT } from "telegraf/typings/core/types/typegram";

interface SessionData {
  count: number;
}

export type Context = Scenes.SceneContext & {
  update: UT.CallbackQueryUpdate;
} & {
  session: SessionData;
};
