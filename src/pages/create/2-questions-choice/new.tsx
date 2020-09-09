import { Typography, TextField, FormHelperText, Hidden, Button } from "@material-ui/core";
import { useRouter } from "next/router";
import React from "react";

import { Inverted } from "src/components/Inverted";
import { Trans } from "src/components/Trans";
import { Steps } from "src/components/create/Steps";
import { ThemeLink } from "src/components/create/ThemeLink";
import { useTranslation } from "src/i18n/useTranslation";
import { ProjectServiceContext } from "src/services/ProjectService";

const QuestionNew: React.FunctionComponent = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { project, updateProject } = React.useContext(ProjectServiceContext);
  const [hasError, setHasError] = React.useState<boolean>(false);
  const [newQuestion, setNewQuestion] = React.useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setNewQuestion(event.target.value.slice(0, 280));
  };

  const handleBack = (event: React.MouseEvent) => {
    event.preventDefault();
    router.push(`/create/2-questions-choice`);
  };

  const handleSubmit = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (newQuestion.length === 0) {
      setHasError(true);
      setTimeout(() => {
        setHasError(false);
      }, 1000);
      return;
    }

    const questions = [...project.questions];
    questions.push({
      id: Math.max(...questions.map((q) => q.id)) + 1,
      isDefault: false,
      question: newQuestion,
      scenarioId: project.scenario.id,
      languageCode: project.scenario.languageCode,
      index: questions.length,
    });
    updateProject({
      questions,
    });
    // TODO save if projectid is not null??
    router.push(`/create/2-questions-choice`);
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
          {t("part2_add_question")}
        </Typography>
        <Typography color="inherit" variant="h2" style={{ marginTop: "1rem" }}>
          <div>
            <TextField
              value={newQuestion}
              onChange={handleChange}
              required
              error={hasError}
              className={hasError ? "shake" : ""}
              id="scenarioDescription"
              multiline
              placeholder={t("part2_add_question_placeholder")}
              fullWidth
              style={{ marginTop: "0.5rem" }}
              variant="outlined"
              color="secondary"
              autoComplete="off"
            />
            <FormHelperText id="component-helper-text" style={{ marginLeft: "0.2rem", marginTop: "0.2rem" }}>
              {newQuestion.length}/280
            </FormHelperText>
          </div>
        </Typography>
        <Hidden smDown implementation="css">
          <div style={{ width: "100%", textAlign: "right" }}>
            <Button component="a" variant="outlined" color="secondary" style={{ marginRight: "1rem" }} href={`/create/2-questions-choice`} onClick={handleBack}>
              {t("cancel")}
            </Button>
            <Button variant="contained" color="secondary" onClick={handleSubmit}>
              {t("add")}
            </Button>
          </div>
        </Hidden>
        <Hidden mdUp implementation="css">
          <Button variant="contained" color="secondary" onClick={handleSubmit} style={{ width: "100%", marginTop: "2rem" }}>
            {t("add")}
          </Button>
        </Hidden>
      </div>
    </div>
  );
};

export default QuestionNew;
