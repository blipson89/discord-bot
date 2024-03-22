import { REST, Routes } from "discord.js";
import { config } from "@/config";
import { commands } from "@/commands";
import * as readline from "readline";
import logger from "@/util/logging";

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST({ version: "10" }).setToken(config.DISCORD_CLIENT_TOKEN!);

type DeployCommandsProps = {
  guildId?: string;
};

async function deployCommands({ guildId }: DeployCommandsProps) {
  try {
    logger.info("Started refreshing application (/) commands.");

    if (guildId) {
      await rest.put(
        Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID!, guildId),
        {
          body: commandsData,
        }
      );
    } else {
      await rest.put(
        Routes.applicationCommands(config.DISCORD_CLIENT_ID!),
        {
          body: commandsData,
        }
      );
    }

    logger.info("Successfully reloaded application (/) commands.");
  } catch (error) {
    logger.error(error)
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('please provide a guildId or write "global"\n> ', async(guildId) => {
  rl.close();
  if (guildId === 'global') {
    await deployCommands({});
  } else {
    await deployCommands({ guildId })
  }
})