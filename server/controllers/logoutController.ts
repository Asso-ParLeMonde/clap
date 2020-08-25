import { Request, Response } from "express";
import { getRepository } from "typeorm";

import { Token } from "../entities/token";

import { Controller, post } from "./controller";

export class LogoutController extends Controller {
  constructor() {
    super("logout");
  }

  @post()
  public async logout(req: Request, res: Response): Promise<void> {
    if (req.cookies && req.cookies["refresh-token"]) {
      const refreshTokenID: string = req.cookies["refresh-token"].split("-")[0];
      const refreshToken = await getRepository(Token).findOne({
        where: {
          id: refreshTokenID,
        },
      });
      if (refreshToken === undefined) {
        await getRepository(Token).delete(refreshToken.id);
      }
    }

    // send empty expired cookies to delete them
    res.cookie("access-token", "", { maxAge: 0, expires: new Date(0), httpOnly: true });
    res.cookie("refresh-token", "", { maxAge: 0, expires: new Date(0), httpOnly: true });
    res.status(204).send();
  }
}
