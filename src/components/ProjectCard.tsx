import React from "react";

import { Typography, ButtonBase } from "@material-ui/core";

import { useTranslation } from "src/i18n/useTranslation";

// import "./workInProgressCard.css";

interface ProjectCardProps {
  title?: string;
  themeName?: string;
  onClick?(event: React.MouseEvent): void;
}

export const ProjectCard: React.FunctionComponent<ProjectCardProps> = ({ title = "", themeName = "", onClick = () => {} }: ProjectCardProps) => {
  const { t } = useTranslation();

  return (
    <ButtonBase focusRipple onClick={onClick} className="wip-container-container">
      <div className="wip-container">
        <Typography color="primary" variant="h3" className="text-center">
          {title}
        </Typography>
        {themeName !== "" && (
          <div className="theme-name">
            <label>{t("my_videos_themes")}</label> {themeName}
          </div>
        )}
      </div>
    </ButtonBase>
  );
};
