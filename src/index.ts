import { Client } from "discord.js";
import { config } from './config';
import AI from './ai';

const client = new Client({ intents: ["GuildMessages", "DirectMessages", "MessageContent", "Guilds"] });
const maintenance = false;
client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('messageCreate', async msg => {
  if (msg.author.id === client.application?.id) {
    return;
  }

  const tagged = msg.mentions.users.has(client.application?.id ?? '') || msg.mentions.roles.some(x => x.name === "GMBot");
  if (tagged) {
    if (maintenance) {
      msg.reply("I am currently in maintenance mode. Please check back later.");
      console.log(msg.content)
      return;
    }
    const resp = await AI.getResponse(msg.content);
    msg.reply(resp.choices[0]?.message.content ?? "I had trouble determining an answer. Please try again.");
    //console.log(JSON.stringify(resp.choices, null, 2))
  }
});
//this line must be at the very end
client.login(config.CLIENT_TOKEN); //signs the bot in with token