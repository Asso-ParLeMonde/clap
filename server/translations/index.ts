import { getLocales } from "./getLocales";
import { tFunction, Translator } from "./translateFunction";

export async function getI18n(language: string): Promise<tFunction | null> {
  try {
    const locales = await getLocales(language);
    const translator = new Translator();
    translator.init(language, locales);
    return translator.translate;
  } catch (e) {
    return null;
  }
}
