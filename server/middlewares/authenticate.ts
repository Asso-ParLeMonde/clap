import * as argon2 from "argon2";
import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { getRepository, MoreThan } from "typeorm";

import { Token } from "../entities/token";
import { UserType, User } from "../entities/user";
import { getHeader } from "../utils/utils";

const secret: string = process.env.APP_SECRET || "";

export function authenticate(userType: UserType | undefined): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token: string = "";
    if (req.cookies && req.cookies["access-token"]) {
      if (!req.isCsrfValid && req.method !== "GET") {
        // check cookie was not stolen
        res.status(401).send("bad csrf token");
        return;
      }
      token = req.cookies["access-token"];
    } else if (req.cookies && req.cookies["refresh-token"]) {
      if (!req.isCsrfValid && req.method !== "GET") {
        // check cookie was not stolen
        res.status(401).send("bad csrf token");
        return;
      }
      const rToken = req.cookies["refresh-token"];
      const refreshTokenID: string = rToken.split("-")[0];
      const refreshTokenToken: string = rToken.slice(refreshTokenID.length + 1);
      const expiredDate = new Date(new Date().getTime() - 31536000000); // now minus 1year
      const refreshToken = await getRepository(Token).findOne({
        where: {
          id: parseInt(refreshTokenID, 10) || 0,
          date: MoreThan(expiredDate),
        },
      });
      if (refreshToken === undefined || !(await argon2.verify(refreshToken.token, refreshTokenToken))) {
        res.cookie("access-token", "", { maxAge: 0, expires: new Date(0), httpOnly: true });
        res.cookie("refresh-token", "", { maxAge: 0, expires: new Date(0), httpOnly: true });
      } else {
        token = jwt.sign({ userId: refreshToken.userId }, secret, { expiresIn: "1h" });
        // send new token
        res.cookie("access-token", token, { maxAge: 60 * 60000, expires: new Date(Date.now() + 60 * 60000), httpOnly: true });
      }
    } else {
      token = getHeader(req, "x-access-token") || getHeader(req, "authorization") || "";
    }

    if (token.startsWith("Bearer ")) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }
    if (secret.length === 0) {
      res.status(401).send("invalid access token");
      return;
    }

    // no authentication
    if (userType === undefined && token.length === 0) {
      next();
      return;
    }

    // authenticate
    try {
      const decoded: string | { userId: number; iat: number; exp: number } = jwt.verify(token, secret) as string | { userId: number; iat: number; exp: number };
      let data: { userId: number; iat: number; exp: number };
      if (typeof decoded === "string") {
        try {
          data = JSON.parse(decoded);
        } catch (e) {
          res.status(401).send("invalid access token");
          return;
        }
      } else {
        data = decoded;
      }
      const user = await getRepository(User).findOne(data.userId);
      if (user === undefined && userType !== undefined) {
        res.status(401).send("invalid access token");
        return;
      } // class: 0 < admin: 1 < superAdmin: 2
      if (userType !== undefined && user !== undefined && user.type < userType) {
        res.status(403).send("Forbidden");
        return;
      }
      req.user = user !== undefined ? user.userWithoutPassword() : undefined;
    } catch (_e) {
      res.status(401).send("invalid access token");
      return;
    }
    next();
  };
}
