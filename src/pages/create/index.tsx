import classnames from "classnames";
import { useRouter } from "next/router";
import React from "react";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import { Inverted } from "src/components/Inverted";
import { Trans } from "src/components/Trans";
import { ThemeCard } from "src/components/create/ThemeCard";
import { ProjectServiceContext } from "src/services/ProjectService";
import { UserServiceContext } from "src/services/UserService";
import type { Theme } from "types/models/theme.type";

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.down(600)]: {
      gridTemplateColumns: "1fr 1fr",
    },
  },
}));

const Create: React.FunctionComponent = () => {
  const classes = useStyles();
  const router = useRouter();
  const { isLoggedIn, axiosLoggedRequest } = React.useContext(UserServiceContext);
  const { updateProject } = React.useContext(ProjectServiceContext);
  const [themes, setThemes] = React.useState<Theme[]>([]);

  const getThemes = React.useCallback(async () => {
    let url: string = "/themes?isDefault=true";
    if (isLoggedIn) {
      url += "&user";
    }
    const response = await axiosLoggedRequest({
      method: "GET",
      url,
    });
    if (!response.error) {
      const localThemes: Theme[] = isLoggedIn ? [] : JSON.parse(localStorage.getItem("themes")) || [];
      setThemes([...response.data, ...localThemes]);
    }
  }, [isLoggedIn, axiosLoggedRequest]);

  React.useEffect(() => {
    getThemes().catch();
  }, [getThemes]);

  const handleThemeClick = (index: number) => (path: string): void => {
    if (index >= 0) {
      updateProject({
        theme: themes[index],
      });
    }
    router.push(path);
  };

  return (
    <>
      <Typography color="primary" variant="h1">
        <Trans i18nKey="create_theme_title">
          Sur quel <Inverted>thème</Inverted> sera votre vidéo ?
        </Trans>
      </Typography>
      <div className={classnames(classes.container, "theme-cards-container")}>
        <div key="new">
          <ThemeCard onClick={handleThemeClick(-1)} />
        </div>
        {themes.map((t, index) => (
          <div key={index}>
            <ThemeCard {...t} onClick={handleThemeClick(index)} />
          </div>
        ))}
      </div>
    </>
  );
};

export default Create;
