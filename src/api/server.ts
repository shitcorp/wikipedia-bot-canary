import express from "express";
import fs from "fs";
import path from "path";
import bodyparser from 'body-parser';
import * as Sentry from "@sentry/node";

import { expressLogger, logger } from "../utils";

export class api {
  app: express.Application;
  port: number;
  instance: any;

  // instance is our instance id
  constructor(PORT: number, INSTANCE: any) {
    this.app = express();
    this.port = PORT;
    this.instance = INSTANCE;

    const commands:Map<String, any> = new Map();
    
    const routes:Map<String, any> = new Map()
    
    fs.readdirSync(path.join(__dirname + "/routes/api/v1"))
      .filter((f) => f.endsWith(".js") && !f.startsWith("_"))
      .forEach((file) => {
        const routeFile = require(path.join(
          __dirname + "/routes/api/v1/" + file
        ));

        if (!routeFile.route) return;

        if (routeFile.route.name && routeFile.route.method && routeFile.route.route) {

          
          routes.set(routeFile.route.name, routeFile.route.route)
          
          logger.info(
            `[${INSTANCE}] [API] Registering the route /api/v1/${routeFile.route.name} [POST]`
          );
        }
      });
      
      
      
      fs.readdirSync(path.join(__dirname + "../../modules/interactions/commands"))
        .filter((file) => !file.startsWith("_") && file.endsWith(".js"))
        .forEach((f) => {
          const interaction = require("../modules/interactions/commands/" + f);
          commands.set(interaction.command.id, interaction.command.execute);
        });
      

      this.app.use(bodyparser.json({
        verify: (req:any, res, buf) => {
          req.rawBody = buf
        }
      }))
      
      
      this.app.post("/api/:version/:endpoint", (req, res) => {
        const apiVersionn = req.params.version
        if (routes.has(req.params.endpoint) && apiVersionn === 'v1') return (routes.get(req.params.endpoint))(req, res, commands)
      })
      
      

    // RequestHandler creates a separate execution context using domains, so that every
    // transaction/span/breadcrumb is attached to its own Hub instance
    // this.app.use(Sentry.Handlers.requestHandler({
    //   user: false,
    //   // timeout for fatal route errors to be delivered
    //   flushTimeout: 5000,
    // }));
    // // TracingHandler creates a trace for every incoming request
    // this.app.use(Sentry.Handlers.tracingHandler());

    this.app.use(expressLogger);
    this.app.use(express.json());


    


    
    

    // send all errors to sentry
    this.app.use(Sentry.Handlers.errorHandler());

    this.app.listen(PORT, () => {
      logger.info(`[${INSTANCE}] [API] App is listening on port ${PORT}`);
    });
  }
}
