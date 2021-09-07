import pino from 'pino';
import pinocolada from 'pino-colada';

export const pinoOptions = {
  level: process.env.DEBUG !== 'true' ? 'info' : 'debug' || 'info',
  prettyPrint: {},
  prettifier: pinocolada
};

export const pinoDestOptions = {
  dest: './wiki.log',
  // minLength: 4096, // Buffer before writing
  sync: false // Asynchronous logging
};

export const logger =
  process.env.NODE_ENV !== 'production' ? pino(pinoOptions) : pino(pino.destination(pinoDestOptions));
