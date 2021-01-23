import winston from "winston"
import {NextFunction, Request, Response} from "express";
import DailyRotateFile from 'winston-daily-rotate-file';

const dailyRotateFile = new DailyRotateFile({
  filename: './logs/%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

const dailyRotatErrorFile = new DailyRotateFile({
  filename: './logs/%DATE%-Error.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'error',
});

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    dailyRotateFile,
    dailyRotatErrorFile,
  ],
})

//
// If we're not in production then log to the `console`
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
      new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
        ),
      }),
  );
}

export const expressLogger = (req: Request, res: Response, done: NextFunction) => {
logger.info(`${req.method} ${req.url} ${req.statusCode}`)
}