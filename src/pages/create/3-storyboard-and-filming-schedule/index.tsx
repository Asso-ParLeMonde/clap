import { useRouter } from "next/router";
import React from "react";

import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import Typography from "@material-ui/core/Typography";

import { Inverted } from "src/components/Inverted";
import { Trans } from "src/components/Trans";
import { Steps } from "src/components/create/Steps";
import { ThemeLink } from "src/components/create/ThemeLink";
import { useTranslation } from "src/i18n/useTranslation";

const PlanEdit: React.FunctionComponent = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleNext = (event: React.MouseEvent) => {
    event.preventDefault();
    router.push(`/create/4-to-your-camera`);
  };

  return (
    <div>
      <ThemeLink />
      <Steps activeStep={2} />
      <div style={{ maxWidth: "1000px", margin: "auto" }}>
        <Typography color="primary" variant="h1">
          <Inverted round>3</Inverted>{" "}
          <Trans i18nKey="part3_title">
            Création du <Inverted>Storyboard</Inverted> et du <Inverted>plan de tournage</Inverted>
          </Trans>
        </Typography>
        <Typography color="inherit" variant="h2">
          {t("part3_desc")}
        </Typography>

        {/* TODO SCENES */}

        {/* TODO DELETE MODAL */}

        <Hidden smDown implementation="css">
          <div style={{ width: "100%", textAlign: "right", marginTop: "2rem" }}>
            <Button component="a" href={`/create/4-to-your-camera`} color="secondary" onClick={handleNext} variant="contained" style={{ width: "200px" }}>
              {t("next")}
            </Button>
          </div>
        </Hidden>
        <Hidden mdUp implementation="css">
          <Button component="a" href={`/create/4-to-your-camera`} color="secondary" onClick={handleNext} variant="contained" style={{ width: "100%", marginTop: "2rem" }}>
            {t("next")}
          </Button>
        </Hidden>
      </div>
    </div>
  );
};

export default PlanEdit;
