import OpenAI from "openai";
import { config } from './config';
import { Thread } from "openai/resources/beta/threads/threads";

type MessageCallback = (message: OpenAI.Beta.Threads.Messages.Message) => void;

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});
const instructions = "";
/**
 * Creates a thread that can be used by the Assistant
 * @returns a thread
 */
export const createThread = async() => await openai.beta.threads.create();
export const createRun = (thread: Thread, callback: MessageCallback) => openai.beta.threads.runs.createAndStream(
  thread.id,
  {
    assistant_id: config.ASSISTANT_ID!,
    instructions,
    stream: true,
    
  }
)
//.on('messageCreated', (e) => console.log(e))
.on('messageDone', callback)
.on('error', (er) => {
  console.error(er);
  process.exit(1);
});

export const sendMessage = async(thread: Thread, message: string, username: string) => await openai.beta.threads.messages.create(
  thread.id,
  {
    role: "user",
    content: `${username}: ${message}`,
  }
)

export const getResponse = async (query: string) => await openai.chat.completions.create({
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