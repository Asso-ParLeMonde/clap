import express from "express";
import next from "next";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, dir: "./src/frontend" });
const handle = app.getRequestHandler();

async function startApp() {
  await app.prepare();
  const server = express();
  server.get("*", (req, res) => {
    return handle(req, res);
  });
  server.listen(port, (err) => {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.log("> Ready on http://localhost:3000");
  });
}

startApp().catch((e: Error) => console.error(e));
