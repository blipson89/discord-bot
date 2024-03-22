import { config } from '@config';
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});