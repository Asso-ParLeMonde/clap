import QRCode from "qrcode";
import React from "react";

import Backdrop from "@material-ui/core/Backdrop";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import VideocamIcon from "@material-ui/icons/Videocam";

import { Inverted } from "src/components/Inverted";
import { Trans } from "src/components/Trans";
import { Steps } from "src/components/create/Steps";
import { ThemeLink } from "src/components/create/ThemeLink";
import { useTranslation } from "src/i18n/useTranslation";
import { UserServiceContext } from "src/services/UserService";
import { ProjectServiceContext } from "src/services/useProject";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const ToCamera: React.FunctionComponent = () => {
  const classes = useStyles();
  const { t, currentLocale } = useTranslation();
  const { axiosLoggedRequest } = React.useContext(UserServiceContext);
  const { project } = React.useContext(ProjectServiceContext);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [isLoading] = React.useState<boolean>(false);

  const generatePDF = async () => {
    event.preventDefault();
    // setIsLoading(true);
    const response = await axiosLoggedRequest({
      method: "POST",
      url: "/projects/pdf",
      data: {
        projectId: project.id,
        themeId: project.theme.id,
        themeName: project.theme.names[currentLocale] || project.theme.names.fr || "",
        scenarioId: project.scenario.id,
        scenarioName: project.scenario.name,
        scenarioDescription: "",
        questions: project.questions,
        languageCode: currentLocale,
      },
    });
    // setIsLoading(false);
    if (!response.error) {
      window.open(`/static/pdf/${response.data.url}`);
    }
  };

  // generate qr-code
  React.useEffect(() => {
    if (canvasRef.current === null || project.id === null) {
      return;
    }
    const url = `https://par-le-monde-1.herokuapp.com/create/3-storyboard-and-filming-schedule?project=${project.id}`;
    QRCode.toCanvas(canvasRef.current, url, (error?: Error) => {
      if (error) console.error(error);
    });
  }, [project.id]);

  return (
    <div>
      <ThemeLink />
      <Steps activeStep={3} />
      <div style={{ maxWidth: "1000px", margin: "auto", paddingBottom: "2rem" }}>
        <Typography color="primary" variant="h1">
          <Inverted round>4</Inverted>{" "}
          <Trans i18nKey="part4_title">
            À votre <Inverted>caméra</Inverted> !
          </Trans>
          <VideocamIcon
            fontSize="large"
            color="primary"
            style={{
              transform: "translateY(0.5rem)",
              marginLeft: "1.5rem",
            }}
          />
        </Typography>

        <Backdrop className={classes.backdrop} open={isLoading} onClick={() => {}}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Typography variant="h2" style={{ marginBottom: "1rem" }}>
          {t("part4_subtitle1")}
        </Typography>
        <div className="text-center">
          <Button className="mobile-full-width" variant="contained" color="secondary" onClick={generatePDF}>
            {t("part4_pdf_button")}
          </Button>
        </div>

        {project.id !== null && (
          <>
            <Typography variant="h2" style={{ margin: "1rem 0" }}>
              {t("part4_subtitle2")}
            </Typography>
            <div className="text-center">
              <canvas ref={canvasRef} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ToCamera;
