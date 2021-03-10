import express from 'express';
import helmet from 'helmet';
import { readdirSync } from 'fs';
import { join } from 'path';
import { expressLogger, logger } from '../utils';
import { Command } from '../@types/cmd';

export class api {
  app: express.Application;
  port: number;
  instance: number;

  // instance is our instance id
  constructor(PORT: number, INSTANCE: number) {
    this.app = express();
    this.port = PORT;
    this.instance = INSTANCE;

    const commands: Map<string, Command> = new Map();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const routes: Map<string, any> = new Map();

    readdirSync(join(__dirname + '/routes/api/v1'))
      .filter(
        (f) => f.endsWith('.js') && !f.startsWith('_'),
      )
      .forEach(async (file) => {
        const routeFile = await import(
          join(__dirname + '/routes/api/v1/' + file)
        );

        if (!routeFile.route) return;

        if (
          routeFile.route.name &&
          routeFile.route.method &&
          routeFile.route.route
        ) {
          routes.set(
            routeFile.route.name,
            routeFile.route.route,
          );

          logger.info(
            `[${INSTANCE}] [API] Registering the route: /api/v1/${routeFile.route.name} [POST]`,
          );
        }
      });

    readdirSync(
      join(
        __dirname + '../../modules/interactions/commands',
      ),
    )
      .filter(
        (file) =>
          !file.startsWith('_') &&
          !file.endsWith('.js.map') &&
          file.endsWith('.js'),
      )
      .forEach(async (f) => {
        const interaction = await import(
          `../modules/interactions/commands/${f}`
        );
        // for some reason its still importing the
        // source maps even tho I tried to filter it
        if (interaction.default) return;

        if (
          interaction.command.id === 'ID' ||
          interaction.command.id === ''
        )
          return;
        commands.set(
          interaction.command.id,
          interaction.command,
        );
        logger.info(
          `[${INSTANCE}] [CMD] Registering command: ${interaction.command.name}`,
        );
      });

    // use helmet
    this.app.use(helmet());
    // RequestHandler creates a separate execution context using domains, so that every
    // transaction/span/breadcrumb is attached to its own Hub instance
    // this.app.use(
    //   Sentry.Handlers.requestHandler({
    //     user: false,
    //     // timeout for fatal route errors to be delivered
    //     flushTimeout: 5000,
    //   }),
    // );
    // // TracingHandler creates a trace for every incoming request
    // this.app.use(Sentry.Handlers.tracingHandler());

    // winston logger
    this.app.use(expressLogger);
    this.app.use(
      express.json({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        verify: (req: any, res, buf) => {
          req.rawBody = buf;
        },
      }),
    );

    this.app.post('/api/:version/:endpoint', (req, res) => {
      const apiVersion = req.params.version;
      if (
        routes.has(req.params.endpoint) &&
        apiVersion === 'v1'
      )
        return routes.get(req.params.endpoint)(
          req,
          res,
          commands,
        );
    });

    this.app.get('/healthy', (req, res) => {
      res.send('Server is healthy');
    });

    // send all errors to sentrys
    // this.app.use(Sentry.Handlers.errorHandler());

    this.app.listen(PORT, () => {
      logger.info(
        `[${INSTANCE}] [API] App is listening on port ${PORT}`,
      );
    });
  }
}
