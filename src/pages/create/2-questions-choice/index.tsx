import { Typography, Button, Hidden } from "@material-ui/core";
import { useRouter } from "next/router";
import React from "react";

import { Inverted } from "src/components/Inverted";
import { Trans } from "src/components/Trans";
import { Steps } from "src/components/create/Steps";
import { ThemeLink } from "src/components/create/ThemeLink";
import { useTranslation } from "src/i18n/useTranslation";

const QuestionChoice: React.FunctionComponent = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleNew = (event: React.MouseEvent) => {
    event.preventDefault();
    router.push(`/create/2-questions-choice/new`);
  };

  const handleNext = (event: React.MouseEvent) => {
    event.preventDefault();
    // TODO: set questions to project and save it?
    router.push(`/create/3-storyboard-and-filming-schedule`);
  };

  return (
    <div>
      <ThemeLink />
      <Steps activeStep={1} />
      <div style={{ maxWidth: "1000px", margin: "auto" }}>
        <Typography color="primary" variant="h1">
          <Inverted round>2</Inverted>{" "}
          <Trans i18nKey="part2_title">
            Mes <Inverted>questions</Inverted>
          </Trans>
        </Typography>
        <Typography color="inherit" variant="h2">
          {t("part2_desc")}
        </Typography>
        <Button
          component="a"
          variant="outlined"
          href={`/create/2-questions-choice/new`}
          color="secondary"
          onClick={handleNew}
          style={{
            textTransform: "none",
            marginTop: "2rem",
          }}
        >
          {t("add_question")}
        </Button>

        {/* TODO: Questions */}

        <Hidden smDown implementation="css">
          <div style={{ width: "100%", textAlign: "right", marginTop: "2rem" }}>
            <Button component="a" href={`/create/3-storyboard-and-filming-schedule`} color="secondary" onClick={handleNext} variant="contained" style={{ width: "200px" }}>
              {t("next")}
            </Button>
          </div>
        </Hidden>
        <Hidden mdUp>
          <Button component="a" href={`/create/3-storyboard-and-filming-schedule`} color="secondary" onClick={handleNext} variant="contained" style={{ width: "100%", marginTop: "2rem" }}>
            {t("next")}
          </Button>
        </Hidden>
      </div>
    </div>
  );
};

export default QuestionChoice;
