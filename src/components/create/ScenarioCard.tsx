// import { ReactComponent as Arrow } from "../../../../images/right-arrow.svg";
import { Typography, makeStyles } from "@material-ui/core";
import React from "react";

import { useTranslation } from "src/i18n/useTranslation";
import { ProjectServiceContext } from "src/services/ProjectService";
import type { Scenario } from "types/models/scenario.type";

const useStyles = makeStyles((theme) => ({
  greenBorder: {
    borderColor: (theme.palette.secondary || {}).main,
    border: "1px solid",
  },
}));

interface ScenarioCardProps {
  scenario: Scenario;
  isNew?: boolean;
}

export const ScenarioCard: React.FunctionComponent<ScenarioCardProps> = ({ scenario, isNew = false }: ScenarioCardProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { updateProject } = React.useContext(ProjectServiceContext);

  const path = ""; // todo

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    updateProject({ scenario });
    // history.push(shortPath);
  };

  return (
    <a className={[classes.greenBorder, "card-container"].join(" ")} tabIndex={0} href={path} onClick={handleClick} style={isNew ? { backgroundColor: "#f0fafa" } : {}}>
      <div>
        <Typography color="primary" variant="h3">
          {scenario.name}
        </Typography>
      </div>
      <div>
        <p>{scenario.description}</p>
      </div>
      {scenario.questionsCount > 0 && <div className="steps">{t("step", { count: scenario.questionsCount })}</div>}

      <div className="arrow">{/* <Arrow /> */}</div>
    </a>
  );
};
