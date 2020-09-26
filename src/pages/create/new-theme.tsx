import { useRouter } from "next/router";
import React from "react";

import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ArrowForwardIcon from "@material-ui/icons/ArrowForwardIos";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import { Inverted } from "src/components/Inverted";
import { Trans } from "src/components/Trans";
import { useTranslation } from "src/i18n/useTranslation";
import { UserServiceContext } from "src/services/UserService";
import { ProjectServiceContext } from "src/services/useProject";
import type { Theme } from "types/models/theme.type";

const NewTheme: React.FunctionComponent = () => {
  const { t, currentLocale } = useTranslation();
  const { isLoggedIn, axiosLoggedRequest } = React.useContext(UserServiceContext);
  const { updateProject } = React.useContext(ProjectServiceContext);
  const router = useRouter();
  const [themeName, setThemeName] = React.useState("");
  const [hasError, setHasError] = React.useState(false);

  const handleHome = (event: React.MouseEvent) => {
    event.preventDefault();
    router.push("/create");
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setThemeName(event.target.value);
    setHasError(false);
  };

  const handleSubmit = async () => {
    if (themeName.length === 0) {
      setHasError(true);
      return;
    }
    const newTheme: Theme = {
      id: 0,
      order: 0,
      image: null,
      names: {
        fr: themeName,
        [currentLocale]: themeName,
      },
      isDefault: false,
    };
    if (isLoggedIn) {
      const response = await axiosLoggedRequest({
        method: "POST",
        url: "/themes",
        data: {
          ...newTheme,
          userId: true,
        },
      });
      if (response.error) {
        console.error(console.error);
        // TODO
        router.push(`/create`);
        return;
      }
      newTheme.id = response.data.id;
    } else {
      const localThemes = JSON.parse(localStorage.getItem("themes")) || [];
      newTheme.id = `local_${localThemes.length + 1}`;
      localThemes.push(newTheme);
      localStorage.setItem("themes", JSON.stringify(localThemes));
    }
    updateProject({
      theme: newTheme,
    });
    router.push(`/create/1-scenario-choice`);
  };

  return (
    <div>
      <Hidden smDown implementation="css">
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          <Link color="inherit" href="/create" onClick={handleHome}>
            {t("all_themes")}
          </Link>
          <Typography color="textPrimary">{t("create_new_theme")}</Typography>
        </Breadcrumbs>
      </Hidden>

      <div
        style={{
          maxWidth: "1000px",
          margin: "auto",
          paddingBottom: "2rem",
        }}
      >
        <Hidden mdUp implementation="css">
          <Button size="medium" onClick={handleHome} style={{ paddingLeft: "0!important", margin: "1rem 0 0 0" }}>
            <KeyboardArrowLeft />
            {t("back")}
          </Button>
        </Hidden>
        <Typography color="primary" variant="h1" style={{ marginTop: "1rem" }}>
          <Trans i18nKey="new_theme_title">
            Créer votre <Inverted>thème</Inverted> :
          </Trans>
        </Typography>
        <Typography color="inherit" variant="h2">
          <Trans i18nKey="new_theme_title_label">
            Nom du thème<span style={{ color: "red" }}>*</span> :
          </Trans>
          <div>
            <TextField
              value={themeName}
              onChange={handleInputChange}
              required
              error={hasError}
              className={hasError ? "shake" : ""}
              id="themeName"
              placeholder={t("new_theme_title_placeholder")}
              fullWidth
              style={{ marginTop: "0.5rem" }}
              variant="outlined"
              color="secondary"
              autoComplete="off"
            />
          </div>
        </Typography>

        <div style={{ marginTop: "2rem" }}>
          <Hidden smDown implementation="css">
            <div style={{ width: "100%", textAlign: "right" }}>
              <Button component="a" variant="outlined" color="secondary" style={{ marginRight: "1rem" }} href={`/create`} onClick={handleHome}>
                {t("cancel")}
              </Button>
              <Button variant="contained" color="secondary" onClick={handleSubmit} endIcon={<ArrowForwardIcon />}>
                {t("next")}
              </Button>
            </div>
          </Hidden>
          <Hidden mdUp implementation="css">
            <Button variant="contained" color="secondary" style={{ width: "100%", marginTop: "2rem" }} onClick={handleSubmit}>
              {t("next")}
            </Button>
          </Hidden>
        </div>
      </div>
    </div>
  );
};

export default NewTheme;
