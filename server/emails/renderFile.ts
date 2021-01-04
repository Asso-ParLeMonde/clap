import fs from "fs";

import { tFunction } from "../translations/translateFunction";

const optionsRegex = /{{(.+?)}}/gm;

function getFileData(path: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", function (err, data) {
      if (err) {
        reject(null);
        return;
      }
      resolve(data);
    });
  });
}

export async function renderFile(path: string, options: { [key: string]: string }, t: tFunction): Promise<string> {
  const data = await getFileData(path);
  if (data === null) {
    throw new Error("Error, could not read file " + path);
  }
  return data.replace(optionsRegex, (_match: string, group: string) => `${group.startsWith("translate_") ? t(group.slice(10), options) : options[group] !== undefined ? options[group] : group}`);
}
