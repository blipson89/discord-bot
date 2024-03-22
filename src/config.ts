import dotenv from "dotenv";

dotenv.config();

const { CLIENT_TOKEN, OPENAI_API_KEY, ASSISTANT_ID } = process.env;

// if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
//   throw new Error("Missing environment variables");
// }

export const config = {
  CLIENT_TOKEN,
  OPENAI_API_KEY,
  ASSISTANT_ID
};