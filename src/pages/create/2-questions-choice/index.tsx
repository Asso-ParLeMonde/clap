import { useRouter } from "next/router";
import { ReactSortable } from "react-sortablejs";
import React from "react";

import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";
import Hidden from "@material-ui/core/Hidden";
import Typography from "@material-ui/core/Typography";

import { Inverted } from "src/components/Inverted";
import { Modal } from "src/components/Modal";
import { Trans } from "src/components/Trans";
import { QuestionCard } from "src/components/create/QuestionCard";
import { Steps } from "src/components/create/Steps";
import { ThemeLink } from "src/components/create/ThemeLink";
import { useTranslation } from "src/i18n/useTranslation";
import { UserServiceContext } from "src/services/UserService";
import { ProjectServiceContext } from "src/services/useProject";
import type { Question } from "types/models/question.type";

const QuestionChoice: React.FunctionComponent = () => {
  const router = useRouter();
  const { t, currentLocale } = useTranslation();
  const { axiosLoggedRequest } = React.useContext(UserServiceContext);
  const { project, updateProject } = React.useContext(ProjectServiceContext);
  const [deleteIndex, setDeleteIndex] = React.useState<number | null>(null);

  const setQuestions = React.useCallback(
    (questions: Question[] | null) => {
      updateProject({
        questions,
      });
    },
    [updateProject],
  );

  const getDefaultQuestions = React.useCallback(async () => {
    if (project.scenario === null || typeof project.scenario.id === "string") {
      setQuestions([]);
      return;
    }
    const url: string = `/questions?isDefault=true&scenarioId=${project.scenario.id}&languageCode=${currentLocale}`;
    const response = await axiosLoggedRequest({
      method: "GET",
      url,
    });
    if (!response.error) {
      const defaultQuestions = response.data;
      for (const question of defaultQuestions) {
        question.plans = [
          {
            id: 0,
            index: 0,
            description: "",
            image: null,
            url: null,
          },
        ];
      }
      setQuestions(defaultQuestions);
    }
  }, [setQuestions, project.scenario, axiosLoggedRequest, currentLocale]);

  React.useEffect(() => {
    if (project.questions === null) {
      getDefaultQuestions().catch();
    }
  }, [project.questions, getDefaultQuestions]);

  const handleNew = (event: React.MouseEvent) => {
    event.preventDefault();
    router.push(`/create/2-questions-choice/new`);
  };

  const handleNext = (event: React.MouseEvent) => {
    event.preventDefault();
    // TODO: set questions to project and save it?
    router.push(`/create/3-storyboard-and-filming-schedule`);
  };

  const handleEdit = (index: number) => (event: React.MouseEvent) => {
    event.preventDefault();
    router.push(`/create/2-questions-choice/edit?question=${index}`);
  };

  const handleDelete = (index: number) => (event: React.MouseEvent) => {
    event.preventDefault();
    setDeleteIndex(index);
  };

  const handleClose = (remove: boolean) => async () => {
    if (remove) {
      const questions = project.questions;
      if (questions === null) {
        return;
      }
      questions.splice(deleteIndex, 1);
      updateProject({
        questions,
      });
    }
    setDeleteIndex(null);
  };

  const toDeleteQuestion = project.questions !== null && deleteIndex !== null && deleteIndex < project.questions.length ? project.questions[deleteIndex].question : "";

  return (
    <div>
      <ThemeLink />
      <Steps activeStep={1} />
      <div style={{ maxWidth: "1000px", margin: "auto", paddingBottom: "2rem" }}>
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

        {project.questions !== null && (
          <ReactSortable tag="div" list={project.questions} setList={setQuestions} animation={200} handle=".question-index">
            {project.questions.map((q, index) => (
              <QuestionCard key={q.id} index={index} question={q.question} handleDelete={handleDelete(index)} handleEdit={handleEdit(index)} />
            ))}
          </ReactSortable>
        )}

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

        <Modal
          open={project.questions !== null && deleteIndex !== null}
          onClose={handleClose(false)}
          onConfirm={handleClose(true)}
          confirmLabel={t("delete")}
          cancelLabel={t("cancel")}
          title={t("part2_delete_question_title")}
          error={true}
          ariaLabelledBy="delete-dialog-title"
          ariaDescribedBy="delete-dialog-description"
          fullWidth
        >
          <DialogContentText id="delete-dialog-description">
            {t("part2_delete_question_desc")}
            <br />
            &quot;{toDeleteQuestion}&quot; ?
          </DialogContentText>
        </Modal>
      </div>
    </div>
  );
};

export default QuestionChoice;
