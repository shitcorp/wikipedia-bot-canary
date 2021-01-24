import express from 'express';
import { readdirSync } from 'fs';
import { join } from 'path';
import * as Sentry from '@sentry/node';

import { expressLogger, logger } from '../utils';

export class api {
  app: express.Application;
  port: number;
  instance: any;

  // instance is our instance id
  constructor(PORT: number, INSTANCE: any) {
    this.app = express();
    this.port = PORT;
    this.instance = INSTANCE;

    const commands: Map<string, any> = new Map();

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
            `[${INSTANCE}] [API] Registering the route /api/v1/${routeFile.route.name} [POST]`,
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
          !file.startsWith('_') && file.endsWith('.js'),
      )
      .forEach(async (f) => {
        const interaction = await import(
          '../modules/interactions/commands/' + f
        );
        commands.set(
          interaction.command.id,
          interaction.command.execute,
        );
      });

    // RequestHandler creates a separate execution context using domains, so that every
    // transaction/span/breadcrumb is attached to its own Hub instance
    this.app.use(
      Sentry.Handlers.requestHandler({
        user: false,
        // timeout for fatal route errors to be delivered
        flushTimeout: 5000,
      }),
    );
    // // TracingHandler creates a trace for every incoming request
    this.app.use(Sentry.Handlers.tracingHandler());

    // winston logger
    this.app.use(expressLogger);

    this.app.use(
      express.json({
        verify: (req: any, res, buf) => {
          req.rawBody = buf;
        },
      }),
    );

    this.app.post('/api/:version/:endpoint', (req, res) => {
      const apiVersionn = req.params.version;
      if (
        routes.has(req.params.endpoint) &&
        apiVersionn === 'v1'
      )
        return routes.get(req.params.endpoint)(
          req,
          res,
          commands,
        );
    });

    // send all errors to sentry, must be last
    this.app.use(Sentry.Handlers.errorHandler());

    this.app.listen(PORT, () => {
      logger.info(
        `[${INSTANCE}] [API] App is listening on port ${PORT}`,
      );
    });
  }
}
