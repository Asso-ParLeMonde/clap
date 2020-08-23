declare namespace Express {
  interface Request {
    locales?: { [key: string]: string };
    user?: import("../../entities/user").User;
    getCsrfToken(): string;
    csrfToken: string;
    isCsrfValid: boolean;
  }
  interface Response {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendJSON: (object: any) => void;
  }
}
