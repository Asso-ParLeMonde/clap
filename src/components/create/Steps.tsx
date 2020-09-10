import { useRouter } from "next/router";
import React from "react";

import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import MobileStepper from "@material-ui/core/MobileStepper";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import { withStyles } from "@material-ui/core/styles";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";

import type { tFunction } from "src/i18n/translateFunction";
// import ProjectTitle from "../ProjectTitle";
import { useTranslation } from "src/i18n/useTranslation";
import { ProjectServiceContext } from "src/services/ProjectService";
import { getQueryString } from "src/util";
import type { Project } from "types/models/project.type";

const steps = [
  {
    name: (t: tFunction, activeStep: number, project: Project) => (activeStep > 0 ? project.scenario?.name || t("step1") : t("step1")),
    back: "/create/1-scenario-choice",
  },
  {
    name: (t: tFunction) => t("step2"),
    back: "/create/2-questions-choice",
  },
  {
    name: (t: tFunction) => t("step3"),
    back: "/create/3-storyboard-and-filming-schedule",
  },
  {
    name: (t: tFunction) => t("step4"),
    back: "/create",
  },
  {
    name: (t: tFunction) => t("step5"),
    back: "/create",
  },
];

const StyleMobileStepper = withStyles((theme) => ({
  root: {
    position: "relative",
    margin: "1rem 0",
  },
  dot: {
    backgroundColor: "white",
    borderColor: (theme.palette.secondary || {}).main,
    border: "1px solid",
    width: "13px",
    height: "13px",
    margin: "0 4px",
  },
  dotActive: {
    backgroundColor: (theme.palette.secondary || {}).main,
  },
}))(MobileStepper);

interface StepsProps {
  activeStep: number;
}

export const Steps: React.FunctionComponent<StepsProps> = ({ activeStep }: StepsProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { project } = React.useContext(ProjectServiceContext);
  const [isNewPage, setIsNewPage] = React.useState(false);
  const [isDrawPage, setIsDrawPage] = React.useState(false);

  React.useEffect(() => {
    setIsNewPage(router.pathname.indexOf("new") !== -1 || router.pathname.indexOf("edit") !== -1);
    setIsDrawPage(router.pathname.indexOf("draw") !== -1);
  }, [router.pathname]);

  const handleBack = (index: number) => (event: React.MouseEvent) => {
    event.preventDefault();
    if (index < 0) {
      router.push("/create");
    } else if (index === 2 && isDrawPage) {
      const questionIndex = parseInt(getQueryString(router.query.question)) || 0;
      const planIndex = parseInt(getQueryString(router.query.plan)) || 0;
      router.push(`/create/3-storyboard-and-filming-schedule/edit?question=${questionIndex}&plan=${planIndex}`);
    } else if (index < activeStep || (index === activeStep && isNewPage)) {
      router.push(steps[index].back);
    }
  };

  // const handleProjectTitleClick = () => {
  //   router.push(`/create/edit-project/${project.id}`);
  // };

  return (
    <div>
      <Hidden smDown>
        {/* {activeStep > 0 && <ProjectTitle onClick={handleProjectTitleClick} />} */}
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={step.name(t, activeStep, project)} style={{ cursor: "pointer" }} onClick={handleBack(index)}>
              <StepLabel>{step.name(t, activeStep, project)}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Hidden>
      <Hidden mdUp>
        <StyleMobileStepper
          variant="dots"
          steps={steps.length}
          position="top"
          activeStep={activeStep}
          backButton={
            <Button size="medium" onClick={handleBack(isNewPage || isDrawPage ? activeStep : activeStep - 1)} className="back-button">
              <KeyboardArrowLeft />
              {t("back")}
            </Button>
          }
          nextButton={null}
        />
        {/* {activeStep > 0 && <ProjectTitle onClick={handleProjectTitleClick} smaller />} */}
      </Hidden>
    </div>
  );
};
