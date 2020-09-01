import { Typography } from "@material-ui/core";
import React from "react";

import { Inverted } from "src/components/Inverted";
import { Trans } from "src/components/Trans";
import { ScenarioCard } from "src/components/create/ScenarioCard";
import { Steps } from "src/components/create/Steps";
import { ThemeLink } from "src/components/create/ThemeLink";
import { useTranslation } from "src/i18n/useTranslation";
import { ProjectServiceContext } from "src/services/ProjectService";
import { UserServiceContext } from "src/services/UserService";
import { Scenario } from "types/models/scenario.type";

const ScenarioChoice: React.FunctionComponent = () => {
  const { t, currentLocale } = useTranslation();
  const { isLoggedIn, axiosLoggedRequest } = React.useContext(UserServiceContext);
  const { project } = React.useContext(ProjectServiceContext);
  const [scenarios, setScenarios] = React.useState<Scenario[]>([]);

  const getScenarios = React.useCallback(async () => {
    if (project.theme === null) {
      setScenarios([]);
      return;
    }

    const localScenarios: Scenario[] = (JSON.parse(localStorage.getItem("scenarios")) || []).filter((s: Scenario) => s.themeId === project.theme.id);
    // local only
    if (typeof project.theme.id === "string") {
      setScenarios(localScenarios);
      return;
    }

    let url: string = `/scenarios?isDefault=true&themeId=${project.theme.id}&languageCode=${currentLocale}`; // fetch scenarios
    if (isLoggedIn) {
      url += "&user";
    }
    const response = await axiosLoggedRequest({
      method: "GET",
      url,
    });
    if (!response.error) {
      setScenarios([...response.data, ...localScenarios]);
    }
  }, [isLoggedIn, axiosLoggedRequest, project.theme, currentLocale]);

  React.useEffect(() => {
    getScenarios().catch();
  }, [getScenarios]);

  return (
    <div>
      <ThemeLink />
      <Steps activeStep={0} />
      <div style={{ maxWidth: "1000px", margin: "auto" }}>
        <Typography color="primary" variant="h1">
          <Inverted round>1</Inverted>{" "}
          <Trans i18nKey="part1_title">
            Quel <Inverted>scénario</Inverted> choisir ?
          </Trans>
        </Typography>
        <Typography color="inherit" variant="h2">
          {t("part1_subtitle2")}
        </Typography>
        <div className="scenarios-container">
          <ScenarioCard scenario={{ id: "new", languageCode: "fr", isDefault: true, name: t("new_scenario_card_title"), description: t("new_scenario_card_desc"), questionsCount: 0, user: null }} isNew />
          {scenarios.map((scenario, index) => (
            <ScenarioCard scenario={scenario} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScenarioChoice;
