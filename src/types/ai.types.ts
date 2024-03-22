interface AIChatMode {

  /**
   * Initializes the Chat Mode
   */
  init: () => Promise<void>;

  /**
   * Sends a message and returns the chat completion.
   * @param message 
   * @param user 
   * @returns ChatCompletion
   */
  sendMessage: (message: string, user: string) => Promise<import("openai").OpenAI.ChatCompletion>;
  
  /**
   * Sends a message and then executes the callback
   * @param message message to send
   * @param username username of sender
   * @param callback callback to execute
   */
  sendMessageWithCallback: (message: string, user: string, callback: MessageCallback) => Promise<void>;
}

type MessageCallback = (message: import("openai").OpenAI.Beta.Threads.Messages.Message) => void;