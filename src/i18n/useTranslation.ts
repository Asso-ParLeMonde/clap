import React, { useContext } from "react";

import { translator, tFunction } from "./translateFunction";

type useTranslationContextReturn = {
  t: tFunction;
  translationContext: React.Context<{ t: tFunction; currentLocale: string }>;
};

const translationContext = React.createContext<{ t: tFunction; currentLocale: string }>(undefined);

export const useTranslationContext = (language: string, locales: { [key: string]: string }): useTranslationContextReturn => {
  translator.init(language, locales);
  return { t: translator.translate, translationContext };
};

export const useTranslation = (): { t: tFunction; currentLocale: string } => {
  const { t, currentLocale } = useContext(translationContext);
  return { t, currentLocale };
};
