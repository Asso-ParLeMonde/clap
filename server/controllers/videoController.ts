import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";

import { UserType } from "../entities/user";
import { Video } from "../entities/video";
import { AppError } from "../middlewares/handleErrors";

import { Controller, del, get, post, put } from "./controller";

function updateFromBody<T>(bodyValue: T | null | undefined, defaultValue: T, nullable: boolean = true): T | null {
  if (bodyValue !== undefined && (bodyValue !== null || nullable)) {
    return bodyValue;
  }
  return defaultValue;
}

export class VideosController extends Controller {
  constructor() {
    super("videos");
  }

  @get()
  public async getVideos(_req: Request, res: Response): Promise<void> {
    const videos = await getRepository(Video).find();
    res.sendJSON(videos);
  }

  @get({ path: "/:id" })
  public async getVideo(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    const video: Video | undefined = await getRepository(Video).findOne(id, { relations: ["theme"] });
    if (video === undefined) {
      next(); // will send 404 error
      return;
    }
    res.sendJSON(video);
  }

  @post({ userType: UserType.PLMO_ADMIN })
  public async addVideo(req: Request, res: Response): Promise<void> {
    const video: Video = new Video(); // create a new theme
    video.videoUrl = req.body.videoUrl || "";
    video.localPath = null;
    video.thumbnailUrl = req.body.thumbnailUrl || null;
    video.title = req.body.title || "";
    video.duration = req.body.duration || 0; // TODO GET FROM URL HERE
    video.themeId = req.body.themeId || null;
    if (!video.videoUrl || !video.title) {
      throw new AppError(`Invalid data: "videoUrl and title are mandatory"`, 0);
    }
    await getRepository(Video).save(video);
    res.sendJSON(video);
  }

  @put({ path: "/:id", userType: UserType.PLMO_ADMIN })
  public async editVideo(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    const video: Video | undefined = await getRepository(Video).findOne(id, { relations: ["theme"] });
    if (video === undefined) {
      next(); // will send 404 error
      return;
    }

    video.videoUrl = updateFromBody<string>(req.body.videoUrl, video.videoUrl, false);
    video.thumbnailUrl = updateFromBody<string>(req.body.thumbnailUrl, video.thumbnailUrl);
    video.title = updateFromBody<string>(req.body.thumbnailUrl, video.thumbnailUrl, false);
    video.duration = updateFromBody<number>(req.body.duration, video.duration, false); // TODO GET FROM URL HERE
    video.themeId = updateFromBody<number>(req.body.themeId, video.themeId);
    if (!video.videoUrl || !video.title) {
      throw new AppError(`Invalid data: "videoUrl, title and themeId can't be empty"`, 0);
    }
    await getRepository(Video).save(video);
    res.sendJSON(video);
  }

  @del({ path: "/:id", userType: UserType.PLMO_ADMIN })
  public async deleteVideo(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    await getRepository(Video).delete(id); // TODO, delete video in s3.
    res.status(204).send();
  }
}
