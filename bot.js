const { Telegraf, session, Markup } = require("telegraf");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session({}));

const initSession = (ctx) => {
  if (!ctx.session) ctx.session = {};
  if (!ctx.session.likes) ctx.session.likes = 0;
  if (!ctx.session.dislikes) ctx.session.dislikes = 0;
};

bot.start(async (ctx) => {
  ctx.reply(`<b>Assalomu alaykum!\nBotga xush kelibsiz</b>`, {
    parse_mode: "HTML",
  });
});

bot.hears("like", async (ctx) => {
  initSession(ctx);

  ctx.reply(
    "Like or dislike this message",
    Markup.inlineKeyboard([
      Markup.button.callback("👍", "like"),
      Markup.button.callback("👎", "dislike"),
    ])
  );
});

bot.action("like", async (ctx) => {
  initSession(ctx);

  ctx.session.likes += 1;

  await ctx.editMessageReplyMarkup({
    inline_keyboard: [
      [
        Markup.button.callback(`👍 ${ctx.session.likes}`, "like"),
        Markup.button.callback(
          `👎 ${ctx.session.dislikes == 0 ? "" : ctx.session.dislikes}`,
          "dislike"
        ),
      ],
    ],
  });

  await ctx.answerCbQuery();
});

bot.action("dislike", async (ctx) => {
  initSession(ctx);

  ctx.session.dislikes += 1;

  await ctx.editMessageReplyMarkup({
    inline_keyboard: [
      [
        Markup.button.callback(
          `👍 ${ctx.session.likes == 0 ? "" : ctx.session.likes}`,
          "like"
        ),
        Markup.button.callback(`👎 ${ctx.session.dislikes}`, "dislike"),
      ],
    ],
  });

  ctx.answerCbQuery();
});

bot.launch(() => {
  console.log("Bot has successfully started!");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
