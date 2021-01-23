require('dotenv').config()

import * as Sentry from "@sentry/node"
import * as Tracing from "@sentry/tracing"
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { platform, version, release } from 'os';
import { inspect } from 'util';

import { api } from './api/server'
import { i18nextLogger, logger } from "./utils";


// init internationalization
i18next.use(Backend).use(i18nextLogger).init({
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
        addPath: 'src/locales/{{lng}}/{{ns}}.missing.json'
    },
    debug: false,
})

// specify lang ex:
// t('welcome', { lng: 'en' })


// init sentry
Sentry.init({
    dsn: "",
    release: `wikipedia-bot-canary@${process.env.npm_package_version}`,
    environment: process.env.NODE_ENV || 'dev',
    maxBreadcrumbs: 100,
    serverName: process.env.SERVER_NAME || 'dev',

    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express(),
    ],

    // clean any possibly present sensitive user data
    beforeSend(event) {
        // if user
        if (event.user) {
            // scrub any possible sensitive data

            // don't send email address
            delete event.user.email;
            // don't send username
            delete event.user.username;
            // don't send ip address
            delete event.user.ip_address;
        }
        return event;
    },

    // how much of each `event` we want
    tracesSampler: (samplingContext) => {
        switch (samplingContext.transactionContext.op) {
            case 'start api':
                return 1;
            case 'shutdown':
                return 1;
            default:
                return 0.5;
        }
    },
});

// set sentry tags
Sentry.setTag('platform', platform());
Sentry.setTag('os.name', version());
Sentry.setTag('os', version() + ' ' + release());
Sentry.setTag('node', process.version);

const startServer = Sentry.startTransaction({
    op: "start api",
    name: "Started the api server",
});

try {
    new api(3420, 'INSTANCE001')

} catch (error) {
    console.log(error)
    Sentry.captureException(error);
    logger.error(inspect(error));
} finally {
    startServer.finish()
}

// Capture unhandledRejections
process.on('unhandledRejection', (error: Error) => {
        // Log
        logger.error(`Unhandled Rejection: ${inspect(error)}`);
        // Send to sentry
        Sentry.captureException(error);
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
        // Send to sentry
        Sentry.captureException(error);
    },
);

// Capture warnings
process.on('warning', (warning: Error) => {
    // Log
    logger.warn(`Warning: ${inspect(warning)}`);
    // Send to sentry
    Sentry.captureException(warning);
});