// eslint-disable-next-line @typescript-eslint/no-var-requires
const apm = require('elastic-apm-node').start({
  serviceName: 'WikipediaBot',
  // Set custom APM Server URL (default: http://localhost:8200)
  // fill later or use env variables
  // serverUrl: '',
});

(async () => {
  (await import('dotenv')).config();
})();

import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { inspect } from 'util';
import cluster from 'cluster';

import { api } from './api/server';
import { i18nextLogger, logger } from './utils';
import { cpus } from 'os';

//TODO: FIXME refactor this!
// context has to be an object yo
const errorBoi = async (err: Error, context: string) => {
  apm.captureError(err);
  context
    ? apm.setCustomContext({ exceptiontype: context })
    : null;
};

// Capture unhandledRejections
process.on('unhandledRejection', (error: Error) => {
  // Log
  logger.error(`Unhandled Rejection: ${inspect(error)}`);
  // Send to elastic apm server
  errorBoi(error, 'unhandledRejection');
});

// Capture uncaughtExceptionMonitors
process.on(
  'uncaughtExceptionMonitor',
  (error: Error, origin: string) => {
    // Log
    logger.error(
      `Uncaught Exception Monitor: ${inspect(
        error,
      )}\n${origin}`,
    );
    errorBoi(error, 'uncaughtExceptionMonitor' + origin);
  },
);

// Capture warnings
process.on('warning', (warning: Error) => {
  // Log
  logger.warn(`Warning: ${inspect(warning)}`);
  // Send to sentry
  errorBoi(warning, '#warning');
});

const numCPUs = cpus().length;
// const numCPUs = 1;

if (cluster.isMaster) {
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('online', (worker) => {
    logger.info(`Worker ${worker.id} is online`);
  });

  cluster.on('exit', (worker, code, signal) => {
    logger.info(
      `Worker ${worker.id} died; code: ${code}; signal: ${signal}`,
    );
  });
} else {
  // init internationalization
  i18next
    .use(Backend)
    .use(i18nextLogger)
    .init({
      lng: 'en',
      fallbackLng: 'en',
      preload: ['en'],
      ns: ['translation'],
      defaultNS: 'translation',
      backend: {
        // path where resources get loaded from, or a function
        // returning a path:
        // function(lngs, namespaces) { return customPath; }
        // the returned path will interpolate lng, ns if provided like giving a static path
        loadPath: 'src/locales/{{lng}}/{{ns}}.json',

        // path to post missing resources
        addPath: 'src/locales/{{lng}}/{{ns}}.missing.json',
      },
      debug: false,
    });

  // specify lang ex:
  // t('welcome', { lng: 'en' })

  try {
    new api(3420, cluster.worker.id);
  } catch (error) {
    console.log(error);
    errorBoi(
      error,
      'Error captured when trying to start server',
    );
    logger.error(inspect(error));
  }
}
