import * as Sentry from "@sentry/node"
import * as Tracing from "@sentry/tracing"

import { api } from './api/server'

Sentry.init({
    dsn: "",

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

const startServer = Sentry.startTransaction({
    op: "start api",
    name: "Started the api server",
});

try {
    const server = new api(3420, 'INSTANCE001')
} catch (error) {
    Sentry.captureException(error);
} finally {
    startServer.finish()
}