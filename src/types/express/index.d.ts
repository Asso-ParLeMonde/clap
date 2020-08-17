declare namespace Express {
  interface Response {
    sendJSON: (object: any) => void;
  }
}
