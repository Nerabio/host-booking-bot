const LocalSession = require("telegraf-session-local");

export const localSessionMiddleware = new LocalSession({
  database: "example_db.json",
}).middleware();
