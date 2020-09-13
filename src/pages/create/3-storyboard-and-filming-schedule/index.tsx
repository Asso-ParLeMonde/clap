import { useRouter } from "next/router";
import React from "react";

import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";
import Hidden from "@material-ui/core/Hidden";
import Typography from "@material-ui/core/Typography";

import { Inverted } from "src/components/Inverted";
import { Modal } from "src/components/Modal";
import { Trans } from "src/components/Trans";
import { Scene } from "src/components/create/Scene";
import { Steps } from "src/components/create/Steps";
import { ThemeLink } from "src/components/create/ThemeLink";
import { useTranslation } from "src/i18n/useTranslation";
import { ProjectServiceContext } from "src/services/ProjectService";
import { getQuestions } from "src/util";
import type { Question } from "types/models/question.type";

const PlanAll: React.FunctionComponent = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { project, updateProject } = React.useContext(ProjectServiceContext);
  const [deleteIndexes, setDeleteIndexes] = React.useState<{ questionIndex: number; planIndex: number; showNumber: number } | null>(null);

  const questions = getQuestions(project);

  const handleNext = (event: React.MouseEvent) => {
    event.preventDefault();
    router.push(`/create/4-to-your-camera`);
  };

  const updateQuestion = (index: number, newQuestion: Partial<Question>) => {
    const questions = project.questions || [];
    const prevQuestion = project.questions[index];
    questions[index] = { ...prevQuestion, ...newQuestion };
    updateProject({ questions });
  };

  const handleAddPlan = (index: number) => (event: React.MouseEvent) => {
    event.preventDefault();
    const plans = questions[index].plans || [];
    plans.push({
      id: 0,
      index: plans.length,
      description: "",
      image: null,
      url: null,
    });
    updateQuestion(index, { plans });
  };

  const handleDeletePlan = (questionIndex: number) => (planIndex: number) => (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDeleteIndexes({
      questionIndex,
      planIndex,
      showNumber: (questions[questionIndex].planStartIndex || 0) + planIndex,
    });
  };

  const handleClose = (confirmDelete: boolean) => () => {
    if (confirmDelete && deleteIndexes !== null) {
      const plans = questions[deleteIndexes.questionIndex].plans;
      plans.splice(deleteIndexes.planIndex, 1);
      updateQuestion(deleteIndexes.questionIndex, { plans });
    }
    setDeleteIndexes(null);
  };

  return (
    <div>
      <ThemeLink />
      <Steps activeStep={2} />
      <div style={{ maxWidth: "1000px", margin: "auto", paddingBottom: "2rem" }}>
        <Typography color="primary" variant="h1">
          <Inverted round>3</Inverted>{" "}
          <Trans i18nKey="part3_title">
            Création du <Inverted>Storyboard</Inverted> et du <Inverted>plan de tournage</Inverted>
          </Trans>
        </Typography>
        <Typography color="inherit" variant="h2">
          {t("part3_desc")}
        </Typography>

        {questions.map((q, index) => (
          <Scene q={q} index={index} addPlan={handleAddPlan(index)} removePlan={handleDeletePlan(index)} key={index} />
        ))}

        <Modal
          open={project.questions !== null && deleteIndexes !== null}
          onClose={handleClose(false)}
          onConfirm={handleClose(true)}
          confirmLabel={t("delete")}
          cancelLabel={t("cancel")}
          title={t("part3_delete_plan_question")}
          error={true}
          ariaLabelledBy="delete-dialog-title"
          ariaDescribedBy="delete-dialog-description"
          fullWidth
        >
          <DialogContentText id="delete-dialog-description">
            {t("part3_delete_plan_desc", {
              planNumber: deleteIndexes?.showNumber || 0,
            })}
          </DialogContentText>
        </Modal>

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

export default PlanAll;
