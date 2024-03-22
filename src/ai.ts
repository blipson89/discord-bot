import OpenAI from "openai";
import { config } from './config';
import { Thread } from "openai/resources/beta/threads/threads";

type CreateRunParams = {
  thread: Thread,
  callback: (content: OpenAI.Beta.Threads.Messages.Text) => void
};

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

const instructions = "";

/**
 * Creates a thread that can be used by the Assistant
 * @returns a thread
 */
const createThread = async() => await openai.beta.threads.create();
const createRun = ({thread, callback}: CreateRunParams) => openai.beta.threads.runs.createAndStream(
  thread.id,
  {
    assistant_id: config.ASSISTANT_ID!,
    instructions
  }
).on('textCreated', callback);

const sendMessage = async(thread: Thread, message: string) => await openai.beta.threads.messages.create(
  thread.id,
  {
    role: "user",
    content: message
  }
)

const getResponse = async (query: string) => await openai.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages: [
    {
      "role": "system",
      "content": instructions
    },
    {
      "role": "user",
      "content": query
    }
  ],
  temperature: 1,
  max_tokens: 256,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
});

export default {
  getResponse,
  createThread,
  createRun,
  sendMessage
};