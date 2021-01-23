import express from "express"
import fs from "fs"
import path from "path"
import * as Sentry from "@sentry/node"

import {expressLogger, logger} from "../utils";

export class api {
  app: express.Application
  port: number
  instance: any

  // instance is our instance id
  constructor(PORT: number, INSTANCE: any) {
    this.app = express()
    this.port = PORT
    this.instance = INSTANCE

    // RequestHandler creates a separate execution context using domains, so that every
    // transaction/span/breadcrumb is attached to its own Hub instance
    this.app.use(Sentry.Handlers.requestHandler({
      user: false,
      // timeout for fatal route errors to be delivered
      flushTimeout: 5000,
    }));
    // TracingHandler creates a trace for every incoming request
    this.app.use(Sentry.Handlers.tracingHandler());

    this.app.use(expressLogger)
    this.app.use(express.json())

    fs.readdirSync(path.join(__dirname + "/routes/api/v1"))
      .filter((f) => f.endsWith(".js") && !f.startsWith("_"))
      .forEach(async (file) => {
        const routeFile = require(path.join(
          __dirname + "/routes/api/v1/" + file
        ))

        if (!routeFile.route) return

        if (
          routeFile.route.name &&
          routeFile.route.method &&
          routeFile.route.route
        ) {
          switch (routeFile.route.method) {
            case "GET":
              //console.log(routeFile.route.route)
              this.app.get("/api/v1/" + routeFile.route.name, (req, res) =>
                routeFile.route.route(req, res)
              )
              logger.info(
                `[API] Registering the route /api/v1/${routeFile.route.name} [GET]`
              )
              break
            case "POST":
              this.app.post("/api/v1/" + routeFile.route.name, (req, res) =>
                routeFile.route.route(req, res)
              )
              logger.info(
                `[API] Registering the route /api/v1/${routeFile.route.name} [POST]`
              )
              break
          }
        }
      })

    // send all errors to sentry
    this.app.use(Sentry.Handlers.errorHandler());

    this.app.listen(PORT, () => {
      logger.info(`[API] App is listening on port ${PORT}`)
    })
  }
}
