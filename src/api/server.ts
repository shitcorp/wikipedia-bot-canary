import express from "express"
import morgan from "morgan"
import fs from "fs"
import path from "path"

export class api {
  app: express.Application
  port: number
  instance: any

  // instance is our instance id
  constructor(PORT: number, INSTANCE: any) {
    this.app = express()
    this.port = PORT
    this.instance = INSTANCE

    this.app.use(morgan("combined"))
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
              console.log(
                `[API] Registering the route /api/v1/${routeFile.route.name} [GET]`
              )
              break
            case "POST":
              this.app.post("/api/v1/" + routeFile.route.name, (req, res) =>
                routeFile.route.route(req, res)
              )
              console.log(
                `[API] Registering the route /api/v1/${routeFile.route.name} [POST]`
              )
              break
          }
        }
      })

    this.app.listen(PORT, () => {
      console.log(`[API] App is listening on port ${PORT}`)
    })
  }
}
