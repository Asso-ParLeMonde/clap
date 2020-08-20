import React from "react";

import { useTranslation } from "src/frontend/i18n/useTranslation";

export interface TransProps {
  i18nKey: string;
  i18nParams?: { [key: string]: string | number };
  children: React.ReactNodeArray;
}

function getTranslatedChild(child: React.ReactNode, childIndex: number, str: string): React.ReactNode {
  if (typeof child === "string") {
    return str;
  }
  if (React.isValidElement(child)) {
    const childChildren = child.props.children;
    return React.cloneElement(child, { ...child.props, key: childIndex }, getTranslatedChild(childChildren, childIndex, str));
  }
  return null;
}

export const Trans: React.FunctionComponent<TransProps> = ({ i18nKey, i18nParams = {}, children }: TransProps) => {
  const { t } = useTranslation();
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [translatedStrings, setTranslatedStrings] = React.useState<string[]>([]);

  const translatedStr = t(i18nKey, i18nParams)
    .replace(/<\d>/gm, "<div>")
    .replace(/<\/\d>/gm, "</div>");

  React.useEffect(() => {
    const el = document.createElement("div");
    el.innerHTML = translatedStr;

    setTranslatedStrings([...el.childNodes].map((node) => node.textContent));
    setLoaded(true);
  }, [translatedStr]);

  if (!loaded) {
    return null;
  }

  const newChildren: React.ReactNodeArray = children.slice(0, translatedStrings.length).map((child, childIndex) => getTranslatedChild(child, childIndex, translatedStrings[childIndex]));
  return <>{newChildren}</>;
};
