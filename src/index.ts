import { Client } from "discord.js";
import { config } from '@/config';
import { chatMode, conversationMode } from "@/ai";
import { commands } from "@/commands";
import { Message, TextContentBlock } from "openai/resources/beta/threads/messages/messages";
import logger, { logChat } from "@/util/logging";

const client = new Client({ intents: ["GuildMessages", "DirectMessages", "MessageContent", "Guilds"] });
let ai: AIChatMode;

client.once('ready', async() => {
  logger.info(`Logged in as ${client.user?.tag}!`);
  logger.info(`Beginning in ${config.CHAT_MODE} mode using ${config.CHAT_MODEL}.`)

  if (config.CHAT_MODE === 'chat') {
    ai = chatMode();
  } else if(config.CHAT_MODE === 'conversation') {
    ai = conversationMode();
  } else {
    throw "CHAT_MODE not set in .env"
  }
});

client.on('messageCreate', async msg => {
  if (msg.author.id === client.application?.id) {
    return;
  }
  const tagged = msg.mentions.users.has(client.application?.id ?? '') || msg.mentions.roles.some(x => x.name === config.BOT_NAME);

  if (tagged) {
    logChat(msg.author.displayName, msg.cleanContent);
    
    const callback = (message: Message) => {
      const content = message.content[0] as TextContentBlock;
      logChat(config.BOT_NAME, content.text.value);
      msg.reply(content.text.value);
    };

    ai.sendMessageWithCallback(msg.cleanContent, msg.author.displayName, callback);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
});

client.login(config.DISCORD_CLIENT_TOKEN);