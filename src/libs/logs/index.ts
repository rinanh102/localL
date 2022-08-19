import winston from "winston";
const levels = process.env.LOG_LEVEL || "debug";
const myFormat = winston.format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`);

const winstonLogger = winston.createLogger({
  format: winston.format.combine(winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
    winston.format.colorize(),
    myFormat),
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/warn.log",
      level: "warn",
    }),
    new winston.transports.File({
      filename: "logs/info.log",
      level: "info",
    }),
    new winston.transports.File({
      filename: "logs/debug.log",
      level: "debug",
    }),
    new winston.transports.File({
      filename: "logs/verbose.log",
      level: "verbose",
    }),
    new winston.transports.File({
      filename: "logs/silly.log",
      level: "silly",
    }),
  ],
});

// Write log to console when run on mode is not production
if (process.env.NODE_ENV !== "production") {
  winstonLogger.add(
    new winston.transports.Console({
      level: levels,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    })
  );
}

import tracer from 'tracer';

export const logger = tracer.colorConsole();

/**
 * 
 * @param text 
 * @param type 
 */
const winstonLog = (text: any, type = 'log') => {
  if (type == "log") {
    winstonLogger.debug(text);
  }
  if (type == "debug") {
    winstonLogger.debug(text);
  }
  if (type == "info") {
    winstonLogger.info(text);
  }
  if (type == "warn") {
    winstonLogger.warn(text);
  }
  if (type == "error") {
    winstonLogger.error(text);
  }
  // winstonLogger.verbose(text);
};
/**
 * Log data
 * @param text message
 * @param shop shop domain
 */
const log = (text: any, type = 'log') => {
  logger[type](text)
  winstonLog(text, type);
};

export default log;