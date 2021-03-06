import { Image } from "../entities/image";

import { FirebaseUtils } from "./firebase";
import { LocalUtils } from "./local";
import { Provider } from "./provider";
import { AwsS3 } from "./s3";

const providers: { [p: string]: Provider } = {
  firebase: new FirebaseUtils(),
  local: new LocalUtils(),
  s3: new AwsS3(),
};

export async function uploadImage(filename: string, filePath: string): Promise<string | null> {
  const provider: string = process.env.STOCKAGE_PROVIDER_NAME || "local";
  if (providers[provider] === undefined) {
    return null;
  } else {
    return await providers[provider].uploadImage(filename, filePath);
  }
}

export async function deleteImage(image: Image): Promise<void> {
  const provider: string = process.env.STOCKAGE_PROVIDER_NAME || "local";
  if (providers[provider] !== undefined) {
    return await providers[provider].deleteImage(image.uuid, image.localPath);
  }
}

export async function uploadFile(filename: string, filedata: Buffer): Promise<void> {
  const provider: string = process.env.STOCKAGE_PROVIDER_NAME || "local";
  if (providers[provider] === undefined) {
    return;
  } else {
    return await providers[provider].uploadFile(filename, filedata);
  }
}

export async function downloadFile(filename: string): Promise<Buffer | null> {
  const provider: string = process.env.STOCKAGE_PROVIDER_NAME || "local";
  if (providers[provider] === undefined) {
    return null;
  } else {
    return await providers[provider].getFile(filename);
  }
}
