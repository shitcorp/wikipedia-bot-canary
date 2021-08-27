import dotenv from 'dotenv';
import { SlashCreator, FastifyServer, GatewayServer } from 'slash-create';
import path from 'path';
import { logger } from './utils';

// Discord js things
import Discord from 'discord.js';
const client = new Discord.Client({
  intents: ['GUILD_INTEGRATIONS']
});

let dotenvPath = path.join(process.cwd(), '.env');
if (path.parse(process.cwd()).name === 'dist') dotenvPath = path.join(process.cwd(), '..', '.env');

dotenv.config({ path: dotenvPath });

const creator = new SlashCreator({
  applicationID: process.env.DISCORD_APP_ID,
  publicKey: process.env.DISCORD_PUBLIC_KEY,
  token: process.env.DISCORD_BOT_TOKEN,
  serverPort: 8020
});

creator.on('debug', (message) => logger.debug(message));
creator.on('warn', (message) => logger.warn(message.toString()));
creator.on('error', (error) => logger.error(error));
creator.on('synced', () => logger.info('Commands synced!'));
creator.on('commandRun', (command, _, ctx) =>
  logger.info(`${ctx.user.username}#${ctx.user.discriminator} (${ctx.user.id}) ran command ${command.commandName}`)
);
creator.on('commandRegister', (command) => logger.info(`Registered command ${command.commandName}`));
creator.on('commandError', (command, error) => logger.error(`Command ${command.commandName}:`, error));

creator
  // .withServer(new FastifyServer({logger: true}))
  .withServer(new GatewayServer((handler) => client.ws.on('INTERACTION_CREATE', handler)))
  .registerCommandsIn(path.join(__dirname, 'commands'))
  .syncCommands();
// .startServer();

// This should serve in localhost:8020/interactions

client.login(process.env.DISCORD_BOT_TOKEN);
