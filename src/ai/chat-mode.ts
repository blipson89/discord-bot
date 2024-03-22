import { Message } from "openai/resources/beta/threads/messages/messages";
import { openai } from "./ai";
import { config } from '@config';
import { ChatCompletion } from "openai/resources";

function chatmode(): AIChatMode {
  /**
   * Sends a message to the AI and gets the response
   * @param message message to send
   * @param username username of sender
   * @param callback callback to execute
   */
  const sendMessage = async (message: string, username: string) => await openai.chat.completions.create({
    model: config.CHAT_MODEL,
    messages: [
      {
        "role": "system",
        "content": config.AI_INSTRUCTIONS
      },
      {
        "role": "user",
        "content": `${username}: ${message}`,
      }
    ],
    temperature: 1,
    max_tokens: 512,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  /**
   * Converts a ChatCompletion into a Message
   * @param chat chat response
   * @returns a Message
   */
  function convertToMessage(chat: ChatCompletion): Message {
    return {
      id: chat.id,
      assistant_id: null,
      completed_at: null,
      content: [{
        text: {
          annotations: [],
          value: chat.choices[0].message.content ?? ''
        },
        type: 'text'
      }],
      created_at: Date.now()/1000,
      file_ids: [],
      incomplete_at: null,
      incomplete_details: null,
      metadata: null,
      role: 'assistant',
      status: 'completed',
      thread_id: '',
      run_id: null,
      object: 'thread.message'
    };
  }

  const sendMessageWithCallback = async (message: string, username: string, callback: MessageCallback) => {
    const msg = await sendMessage(message, username);
    const callbackMsg = convertToMessage(msg);
    callback(callbackMsg);
  }

  return {
    init: () => Promise.resolve(),
    sendMessage,
    sendMessageWithCallback
  }
}

export default chatmode;