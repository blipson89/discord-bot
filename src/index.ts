import { Client } from "discord.js";
import { config } from './config';
import * as AI from './ai';
import { Thread } from "openai/resources/beta/threads/threads";
import { TextContentBlock } from "openai/resources/beta/threads/messages/messages";

const client = new Client({ intents: ["GuildMessages", "DirectMessages", "MessageContent", "Guilds"] });
const maintenance = false;
let thread: Thread;

client.on('ready', async() => {
  console.log(`Logged in as ${client.user?.tag}!`);
  if(!maintenance) {
    thread = await AI.createThread();
    console.log(`Thread created: ${thread.id}`);
  }
});

client.on('messageCreate', async msg => {
  if (msg.author.id === client.application?.id) {
    return;
  }
  const tagged = msg.mentions.users.has(client.application?.id ?? '') || msg.mentions.roles.some(x => x.name === "GMBot");
  if (tagged) {
    if (maintenance) {
      msg.reply("I am currently in maintenance mode. Please check back later.");
      console.log(msg.cleanContent)
      return;
    }
    AI.sendMessage(thread, msg.cleanContent, msg.author.displayName);
    AI.createRun(thread, (message) => {
      const content = message.content[0] as TextContentBlock;
      msg.reply(content.text.value)
    });
    
  }
});
//this line must be at the very end
client.login(config.CLIENT_TOKEN); //signs the bot in with token