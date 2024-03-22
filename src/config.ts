import { ChatMode } from "@enums"
import dotenv from "dotenv";

dotenv.config();

const {
  AI_INSTRUCTIONS,
  ASSISTANT_ID,
  CHAT_MODE,
  CHAT_MODEL,
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_TOKEN,
  ECHO_CHAT,
  LOG_LEVEL,
  OPENAI_API_KEY,
} = process.env;


function assertPropertiesDefined(properties: string[]) {
  properties.forEach(v => {
    const value = process.env[v];
    if (value === undefined) {
      const msg = `${v} is required, but not defined`;
      console.error(`\x1b[31m${msg}\x1b[0m`);
      throw msg;
    }
  })
};

assertPropertiesDefined([
  'AI_INSTRUCTIONS',
  'ASSISTANT_ID',
  'CHAT_MODE',
  'CHAT_MODEL',
  'DISCORD_CLIENT_ID',
  'DISCORD_CLIENT_TOKEN',
  'OPENAI_API_KEY'
]);

export const config = {
  AI_INSTRUCTIONS: AI_INSTRUCTIONS!.replaceAll(' \n', ' ').replaceAll('\n', ' '),
  ASSISTANT_ID: ASSISTANT_ID!,
  CHAT_MODE: CHAT_MODE as ChatMode,
  CHAT_MODEL: CHAT_MODEL as 'gpt-3.5-turbo' | 'gpt-4-0125-preview',
  DISCORD_CLIENT_ID: DISCORD_CLIENT_ID!,
  DISCORD_CLIENT_TOKEN: DISCORD_CLIENT_TOKEN!,
  ECHO_CHAT: ECHO_CHAT?.toLowerCase() === 'true',
  LOG_LEVEL: LOG_LEVEL as LogLevels ?? 'info' as LogLevels,
  OPENAI_API_KEY: OPENAI_API_KEY!,
};