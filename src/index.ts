import dotenv from 'dotenv';
import path from 'path';
let dotenvPath = path.join(process.cwd(), '.env');
if (path.parse(process.cwd()).name === 'dist') dotenvPath = path.join(process.cwd(), '..', '.env');

dotenv.config({ path: dotenvPath });
import { SlashCreator, FastifyServer } from 'slash-create';
import { logger, pinoOptions, cache } from './utils';

const creator = new SlashCreator({
  applicationID: process.env.DISCORD_APP_ID,
  publicKey: process.env.DISCORD_PUBLIC_KEY,
  token: process.env.DISCORD_BOT_TOKEN,
  serverPort: Number(process.env.PORT)
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

// This should serve in localhost:8020/interactions
creator
  .withServer(new FastifyServer({ logger: pinoOptions }))
  .registerCommandsIn(path.join(__dirname, 'commands'))
  .syncCommands()
  .startServer();
