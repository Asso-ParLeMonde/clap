import { Hidden, Typography, Button, TextField, FormHelperText } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForwardIos";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";

import { Inverted } from "src/components/Inverted";
import { Trans } from "src/components/Trans";
import { Steps } from "src/components/create/Steps";
import { ThemeLink } from "src/components/create/ThemeLink";
import { useTranslation } from "src/i18n/useTranslation";
import { ProjectServiceContext } from "src/services/ProjectService";
import { UserServiceContext } from "src/services/UserService";
import { debounce } from "src/util";
import type { Scenario } from "types/models/scenario.type";

const NewScenario: React.FunctionComponent = () => {
  const router = useRouter();
  const { t, currentLocale } = useTranslation();
  const { isLoggedIn, axiosLoggedRequest } = useContext(UserServiceContext);
  const { project, updateProject } = useContext(ProjectServiceContext);
  const [newScenario, setNewScenario] = useState({
    name: "",
    description: "",
  });
  const [hasError, setHasError] = useState(false);
  const [descHasError, setDescHasError] = useState(false);
  const themeId = project.theme?.id || -1;

  const postNewScenario = async (): Promise<Scenario | null> => {
    const response = await axiosLoggedRequest({
      url: `/scenarios`,
      method: "POST",
      data: {
        ...newScenario,
        languageCode: currentLocale,
        themeId,
        userId: true,
      },
    });
    if (!response.error) {
      return response.data;
    }
    return null;
  };

  const handleSubmit = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (newScenario.name.length === 0) {
      setHasError(true);
      setTimeout(() => {
        setHasError(false);
      }, 1000);
    }
    let scenario: Scenario | null;
    if (newScenario.name.length > 0 && newScenario.description.length <= 280) {
      if (isLoggedIn && typeof themeId !== "string") {
        scenario = await postNewScenario();
      } else {
        const localScenarios = JSON.parse(localStorage.getItem("scenarios")) || [];
        scenario = {
          id: `local_${localScenarios.length}`,
          languageCode: currentLocale,
          name: newScenario.name,
          isDefault: false,
          description: newScenario.description,
          user: null,
          questionsCount: 0,
          themeId: themeId,
        };
        localScenarios.push(scenario);
        localStorage.setItem("scenarios", JSON.stringify(localScenarios));
      }
      updateProject({
        scenario,
      });
      router.push(scenario === null ? "/create/1-scenario-choice" : `/create/2-questions-choice`);
    }
  };

  const setDescError = debounce(
    () => {
      setDescHasError(true);
      setTimeout(() => {
        setDescHasError(false);
      }, 1000);
    },
    1000,
    true,
  );

  const handleChange = (inputName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (inputName) {
      default:
        break;
      case "NAME":
        setNewScenario({
          ...newScenario,
          name: event.target.value.slice(0, 50),
        });
        break;
      case "DESCRIPTION":
        if (event.target.value.length > 280) {
          setDescError();
        }
        setNewScenario({
          ...newScenario,
          description: event.target.value.slice(0, 280),
        });
        break;
    }
  };

  const handleBack = (event: React.MouseEvent) => {
    event.preventDefault();
    router.push(`/create/1-scenario-choice`);
  };

  React.useCallback(() => {
    if (themeId === -1) {
      router.push(`/create/1-scenario-choice`);
    }
  }, [router, themeId]);

  return (
    <div>
      <ThemeLink />
      <Steps activeStep={0} />
      <div style={{ maxWidth: "1000px", margin: "auto" }}>
        <div
          style={{
            maxWidth: "1000px",
            margin: "auto",
            paddingBottom: "2rem",
          }}
        >
          <Typography color="primary" variant="h1">
            <Inverted round>1</Inverted>{" "}
            <Trans i18nKey="new_scenario_title">
              Crée ton nouveau <Inverted>scénario</Inverted> !
            </Trans>
          </Typography>
          <Typography color="inherit" variant="h2">
            <Trans i18nKey="new_scenario_title_label">
              Choisis ton titre<span style={{ color: "red" }}>*</span> :
            </Trans>
            <div>
              <TextField
                value={newScenario.name || ""}
                onChange={handleChange("NAME")}
                required
                error={hasError}
                className={hasError ? "shake" : ""}
                id="scenarioName"
                placeholder={t("new_scenario_title_placeholder")}
                fullWidth
                style={{ marginTop: "0.5rem" }}
                variant="outlined"
                color="secondary"
                autoComplete="off"
              />
            </div>
          </Typography>

          <Typography color="inherit" variant="h2" style={{ marginTop: "1rem" }}>
            {t("new_scenario_desc_label")}
            <div>
              <TextField
                value={newScenario.description || ""}
                onChange={handleChange("DESCRIPTION")}
                required
                id="scenarioDescription"
                multiline
                placeholder={t("new_scenario_desc_placeholder")}
                fullWidth
                style={{ marginTop: "0.5rem" }}
                variant="outlined"
                color="secondary"
                autoComplete="off"
                error={descHasError}
                className={descHasError ? "shake" : ""}
              />
              <FormHelperText
                id="component-helper-text"
                style={{
                  marginLeft: "0.2rem",
                  marginTop: "0.2rem",
                  color: descHasError ? "red" : "inherit",
                }}
              >
                {newScenario.description.length || 0}/280
              </FormHelperText>
            </div>
          </Typography>
          <Typography color="inherit" variant="h2" style={{ marginTop: "1rem" }}>
            <Hidden smDown>
              <div style={{ width: "100%", textAlign: "right" }}>
                <Button component="a" variant="outlined" color="secondary" style={{ marginRight: "1rem" }} href={`/create/1-scenario-choice?themeId=${themeId}`} onClick={handleBack}>
                  {t("cancel")}
                </Button>
                <Button variant="contained" color="secondary" onClick={handleSubmit} endIcon={<ArrowForwardIcon />}>
                  {t("next")}
                </Button>
              </div>
            </Hidden>
            <Hidden mdUp>
              <Button variant="contained" color="secondary" style={{ width: "100%", marginTop: "2rem" }} onClick={handleSubmit}>
                {t("next")}
              </Button>
            </Hidden>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default NewScenario;
