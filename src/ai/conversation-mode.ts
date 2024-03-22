import { config } from '@config';
import { Thread } from "openai/resources/beta/threads/threads";
import { openai } from './ai';
import logger from '@/util/logging';

function conversationMode(): AIChatMode {
  let thread: Thread;

  async function init() {
    thread = await createThread();
  }

  /**
   * Creates a thread that can be used by the Assistant
   * @returns a thread
   */
  const createThread = async () => await openai.beta.threads.create();

  /**
   * Creates a run for each message that gets sent
   * @param callback
   * @returns AssistantStream
   */
  const createRun = (callback: MessageCallback) => openai.beta.threads.runs.createAndStream(
    thread.id,
    {
      assistant_id: config.ASSISTANT_ID!,
      instructions: config.AI_INSTRUCTIONS,
      stream: true,

    }
  )
    .on('messageDone', callback)
    .on('error', (er) => {
      logger.error(er)
      process.exit(1);
    });

  const sendMessageWithCallback = async (message: string, username: string, callback: MessageCallback) => {
    await openai.beta.threads.messages.create(thread.id,
    {
      role: "user",
      content: `${username}: ${message}`,
    }
    );
    createRun(callback);
  }

  init();

  return {
    init,
    sendMessage: () => { throw "Not Supported. Use sendMessageWithCallback instead"; },
    sendMessageWithCallback
  }
}

export default conversationMode;