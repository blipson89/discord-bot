import winston from "winston";
import { config } from '@config';

const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: winston.format.cli(),
  transports: [
    new winston.transports.Console({format: winston.format.cli()})
  ]
});

export function logChat(sender: string, message: string) {
  if (config.ECHO_CHAT) {
    logger.info(`${sender}: "${message}"`);
  }
}

export default logger;