import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import express, { Response, Router } from "express";
import helmet from "helmet";
import morgan from "morgan";
import next from "next";

// Get environment variables before importing local functions
config();

import { removeTrailingSlash } from "./middlewares/trailingSlash";
import { logger } from "./utils/logger";
import { normalizePort, onError, getDefaultDirectives } from "./utils/server";

const dev = process.env.NODE_ENV !== "production";
const frontendHandler = next({ dev, dir: "./src/frontend" });
const handle = frontendHandler.getRequestHandler();

async function startApp() {
  // Prepare frontend routes
  await frontendHandler.prepare();

  const app = express();
  app.enable("strict routing");

  /* --- Middlewares --- */
  const directives = getDefaultDirectives();
  if (dev) {
    directives["default-src"] = ["'self'", "'unsafe-eval'", "'unsafe-inline'"];
    directives["script-src"] = ["'self'", "'unsafe-eval'", "'unsafe-inline'"];
  }
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives,
      },
    }),
  );
  app.use(cors());
  app.use(removeTrailingSlash);
  app.use(
    morgan("dev", {
      skip: function (req) {
        return req.path.split("/")[1] === "_next";
      },
    }),
  );
  app.use(bodyParser.json());

  /* --- BACKEND --- */
  const backRouter = Router();
  app.use("/api", backRouter);
  backRouter.get("/", (_, res: Response) => {
    res.status(200).send("Hello World PLMO1 !");
  });

  /* --- FRONTEND --- */
  app.get("/", (_req, res) => {
    res.redirect("/create");
  });
  app.get("*", (req, res) => {
    return handle(req, res);
  });

  /* --- Starting Server --- */
  const port = normalizePort(process.env.PORT || "5000");
  const server = app.listen(port);
  server.on("error", onError);
  server.on("listening", () => {
    logger.info(`App listening on port ${port}!`);
  });
}

startApp().catch((e: Error) => console.error(e));
