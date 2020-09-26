import { useRouter } from "next/router";
import React from "react";

import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Hidden from "@material-ui/core/Hidden";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import { useTranslation } from "src/i18n/useTranslation";
import { ProjectServiceContext } from "src/services/useProject";

export const ThemeLink: React.FunctionComponent = () => {
  const router = useRouter();
  const { t, currentLocale } = useTranslation();
  const { project } = React.useContext(ProjectServiceContext);

  const handleHome = (event: React.MouseEvent) => {
    event.preventDefault();
    router.push("/create");
  };

  const themeName = project.theme?.names[currentLocale] || project.theme?.names["fr"] || "";

  return (
    <Hidden smDown>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        <Link color="inherit" href="/create" onClick={handleHome}>
          {t("all_themes")}
        </Link>
        <Typography color="textPrimary">{themeName}</Typography>
      </Breadcrumbs>
    </Hidden>
  );
};
