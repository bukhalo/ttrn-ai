import 'dotenv/config';
import { Bot } from 'grammy';
import dialogflow from '@google-cloud/dialogflow';

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

const sessionClient = new dialogflow.SessionsClient();

bot.on('message', async ctx => {
  const projectId = process.env.PROJECT_ID!;
  const sessionId = `${ctx.chat?.id}:${ctx.from?.id}`;
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );
  const responses = await sessionClient.detectIntent({
    session: sessionPath,
    queryInput: {
      text: {
        text: ctx.message.text,
        languageCode: 'ru',
      },
    },
  });

  if (responses[0].queryResult?.fulfillmentText) {
    await ctx.reply(responses[0].queryResult.fulfillmentText);
  }
});

bot.start();
