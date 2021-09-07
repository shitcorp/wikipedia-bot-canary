import { pino } from 'pino';
import pinocolada from 'pino-colada';

export const pinoOptions = {
  level: process.env.DEBUG !== 'true' ? 'info' : 'debug' || 'info',
  prettyPrint: {},
  prettifier: pinocolada
};

export default process.env.NODE_ENV !== 'production' ? pino(pinoOptions) : pino();
