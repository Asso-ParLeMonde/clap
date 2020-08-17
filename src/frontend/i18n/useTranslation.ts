import React, { useContext } from "react";

import { translator, tFunction } from "./translateFunction";

type useTranslationContextReturn = {
  t: tFunction;
  translationContext: React.Context<(key: string) => string>;
};

const translationContext = React.createContext<tFunction>((key: string) => key);

export const useTranslationContext = (language: string, locales: { [key: string]: string }): useTranslationContextReturn => {
  translator.init(language, locales);
  return { t: translator.translate, translationContext };
};

export const useTranslation = (): { t: tFunction } => {
  const t = useContext(translationContext);
  return { t };
};
