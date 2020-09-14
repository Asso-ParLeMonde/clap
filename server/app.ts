import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express, { Response, Router } from "express";
import helmet from "helmet";
import morgan from "morgan";
import next from "next";
import path from "path";
import { Connection } from "typeorm";

import { authenticate } from "./middlewares/authenticate";
import { crsfProtection } from "./middlewares/csrfCheck";
import { handleErrors } from "./middlewares/handleErrors";
import { removeTrailingSlash } from "./middlewares/trailingSlash";
import { routes } from "./routes/routes";
import { connectToDatabase } from "./utils/database";
import { getLocales } from "./utils/getLocales";
import { logger } from "./utils/logger";
import { normalizePort, onError, getDefaultDirectives } from "./utils/server";

config();

const dev = process.env.NODE_ENV !== "production";
const frontendHandler = next({ dev });
const handle = frontendHandler.getRequestHandler();

async function startApp() {
  // Connect to DB
  const connection: Connection | null = await connectToDatabase();
  if (connection === null) {
    throw new Error("Could not connect to database...");
  }
  logger.info(`Database connection established: ${connection.isConnected}`);

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
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(crsfProtection());

  /* --- BACKEND --- */
  const backRouter = Router();
  backRouter.use(morgan("dev"));
  backRouter.get("/", (_, res: Response) => {
    res.status(200).send("Hello World PLMO1 !");
  });
  backRouter.use(routes);
  backRouter.use((_, res: Response) => {
    res.status(404).send("Error 404 - Not found.");
  });
  app.use("/api", backRouter);

  /* --- FRONTEND --- */
  app.get("/", (_req, res) => {
    res.redirect("/create");
  });
  app.get("/creer", (_req, res) => {
    res.redirect("/create");
  });
  app.get("/admin", (_req, res) => {
    res.redirect("/admin/themes");
  });
  app.use(`/static/images`, express.static(path.join(__dirname, "./static/images")));
  app.use(express.static(path.join(__dirname, "../../public"))); // app.js is located at ./dist/server and public at ./public
  app.get("/_next/*", (req, res) => {
    handle(req, res).catch((e) => console.error(e));
  });
  app.get(
    "*",
    morgan("dev"),
    handleErrors(authenticate(undefined)),
    handleErrors(async (req, res) => {
      req.currentLocale = req.cookies?.["app-language"] || req.user?.languageCode || "fr";
      req.locales = await getLocales(req.currentLocale);
      req.csrfToken = req.getCsrfToken();
      return handle(req, res).catch((e) => console.error(e));
    }),
  );
  // last fallback
  app.use(morgan("dev"), (_, res: Response) => {
    res.status(404).send("Error 404 - Not found.");
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
