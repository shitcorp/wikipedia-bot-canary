import dotenv from 'dotenv';
import path from 'path';
let dotenvPath = path.join(process.cwd(), '.env');
if (path.parse(process.cwd()).name === 'dist') dotenvPath = path.join(process.cwd(), '..', '.env');
dotenv.config({ path: dotenvPath });
import { SlashCreator, FastifyServer } from 'slash-create';
import { logger, pinoOptions, cache, CService as ConfigService, ZClient } from './utils';
import pino from 'pino';

import Fastify from 'fastify';
import helmet from 'fastify-helmet';

const creator = new SlashCreator({
  applicationID: process.env.DISCORD_APP_ID,
  publicKey: process.env.DISCORD_PUBLIC_KEY,
  token: process.env.DISCORD_BOT_TOKEN,
  serverPort: Number(process.env.PORT),
  allowedMentions: {
    everyone: false,
    roles: false,
    users: false
  }
});
cache.del('cat');
creator.on('debug', (message) => logger.debug(message));
creator.on('warn', (message) => logger.warn(message.toString()));
creator.on('error', (error) => logger.error(error));
creator.on('synced', () => logger.info('Commands synced!'));
creator.on('commandRun', (command, _, ctx) =>
  logger.info(`${ctx.user.username}#${ctx.user.discriminator} (${ctx.user.id}) ran command: ${command.commandName}`)
);
creator.on('commandRegister', (command) => logger.info(`Registered command: ${command.commandName}`));
creator.on('commandError', (command, error) => logger.error(`Command ${command.commandName}:`, error));

// create fastify server
const fastify = Fastify({ logger: pinoOptions });

// register helmet
fastify.register(helmet);

// This should serve in localhost:8020/interactions
creator
  .withServer(new FastifyServer(fastify))
  .registerCommandsIn(path.join(__dirname, 'commands'))
  .syncCommands()
  .startServer();

/**
 * Handle process events
 */

/**
 * Handles exit signal events
 * @param signal
 */
function handleSignal(signal: NodeJS.Signals) {
  // close zookeeper connection
  ZClient.getClient().close();
  // close cache connection
  cache.disconnect();
  // flush logs after log
  pino.final(logger).info({ signal }, `Received ${signal}, shutting down...`);
  // clean exit
  process.exit(0);
}

process.on('SIGINT', handleSignal);
process.on('SIGTERM', handleSignal);

process.on('beforeExit', (code) => {
  pino.final(logger).info({ code }, `Process beforeExit event with code ${code}`);
});

process.on('exit', (code) => {
  pino.final(logger).info({ code }, `Process exit event with code ${code}`);
});

// The process will still crash if no 'uncaughtException' listener is installed.
process.on('uncaughtExceptionMonitor', (error, origin) => {
  pino.final(logger).error({ error, origin }, 'Caught an uncaught exception');
  // // Uncaught Fatal Exception
  // process.exit(1);
});

process.on('multipleResolves', (type, promise, reason) => {
  pino.final(logger).error({ type, promise, reason }, 'Multiple resolves');
  // Uncaught Fatal Exception
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ promise, reason }, 'Unhandled rejection');
});

process.on('warning', (warning) => {
  logger.warn(warning);
});
