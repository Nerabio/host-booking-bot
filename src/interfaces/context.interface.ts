import { Scenes } from "telegraf";
import { Update as UT } from "telegraf/typings/core/types/typegram";
import { User } from "@common/entity/user.entity";
import { Host } from "@common/entity/host.entity";

interface SessionData {
  count: number;
  currentUser: User;
  currentHost: Host;
}

export type Context = Scenes.SceneContext & {
  update: UT.CallbackQueryUpdate;
} & {
  session: SessionData;
};
