import CardMedia from "@material-ui/core/CardMedia";
import Paper from "@material-ui/core/Paper";
import { Typography } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";

import { useTranslation } from "src/frontend/i18n/useTranslation";

const colors = ["rgb(96, 105, 243)", "rgb(213, 89, 84)", "rgb(250, 225, 108)", "rgb(62, 65, 87)", "rgb(215, 213, 209)", "rgb(162, 220, 174)"];

interface ThemeCardProps {
  themeId?: string | number | null;
  theme?: {
    names: { [key: string]: string };
    image?: {
      path: string;
    } | null;
  } | null;
  onClick?: (event: React.MouseEvent) => void;
}

export const ThemeCard: React.FunctionComponent<ThemeCardProps> = ({ themeId = null, theme = null, onClick = () => {} }: ThemeCardProps) => {
  const img = useRef(null);
  const { t } = useTranslation();
  // const { selectedLanguage } = useContext(AppLanguageServiceContext);
  const selectedLanguage = "fr";
  const [imgHasError, setImgHasError] = useState(false);

  const themeName = theme === null ? t("create_new_theme") : theme.names[selectedLanguage] || theme.names.fr;
  const themeUrl = theme === null ? "/create/new-theme" : `/create/1-scenario-choice?themeId=${themeId}`;

  useEffect(() => {
    if (theme !== null && theme.image !== undefined && theme.image !== null) {
      const image = new Image();
      image.onload = () => {
        if (img && img.current) {
          img.current.src = image.src;
        }
      };
      image.onerror = () => {
        setImgHasError(true);
      };
      image.src = theme.image.path;
    }
  }, [theme]);

  return (
    <a className="theme-card-button" href={themeUrl} onClick={onClick}>
      <Paper className="theme-card-paper">
        {theme !== null && theme.image && !imgHasError ? (
          <CardMedia ref={img} component="img" alt={`picture of ${themeName} theme`} image="/classe_default.png" />
        ) : (
          <div
            className="theme-card-default"
            style={{
              backgroundColor: colors[(typeof themeId === "string" ? parseInt(themeId.split("_")[1], 10) || 0 : themeId) % 6],
            }}
          />
        )}
      </Paper>
      <Typography className="theme-card-title">{themeName}</Typography>
    </a>
  );
};
