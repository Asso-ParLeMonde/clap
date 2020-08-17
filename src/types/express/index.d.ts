declare namespace Express {
  interface Request {
    locales?: { [key: string]: string };
  }
  interface Response {
    sendJSON: (object: any) => void;
  }
}
