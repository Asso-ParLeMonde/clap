import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography } from "@material-ui/core";
import classnames from "classnames";
import React from "react";

import { ThemeCard } from "src/frontend/components/Create/ThemeCard";
import { Inverted } from "src/frontend/components/Inverted";

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.down(600)]: {
      gridTemplateColumns: "1fr 1fr",
    },
  },
}));
// import { useTranslation } from "src/frontend/i18n/useTranslation";

const Create: React.FunctionComponent = () => {
  const classes = useStyles();
  // const { t } = useTranslation();
  return (
    <Container maxWidth="lg">
      <Typography color="primary" variant="h1">
        {/* <Trans i18nKey="create_theme_title"> */}
        Sur quel <Inverted>thème</Inverted> sera votre vidéo ?{/* </Trans> */}
      </Typography>
      <div className={classnames(classes.container, "theme-cards-container")}>
        <div key="new">
          <ThemeCard />
        </div>
      </div>
    </Container>
  );
};

export default Create;
