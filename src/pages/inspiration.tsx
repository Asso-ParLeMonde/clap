import React from "react";

import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { NoSsr } from "@material-ui/core";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import { Inverted } from "src/components/Inverted";
import { InspirationNoSSR } from "src/components/inspiration/InspirationNoSSR";
import { useTranslation } from "src/i18n/useTranslation";
import type { Video } from "types/models/video.type";

const Inspiration: React.FunctionComponent = () => {
  const [selectedVideo, setSelectedVideo] = React.useState<Video | null>(null);
  const { t } = useTranslation();
  const onBackAllVideo = (event: React.MouseEvent) => {
    event.preventDefault();
    setSelectedVideo(null);
  };

  return (
    <div>
      {selectedVideo !== null && (
        <>
          <Hidden smDown implementation="css">
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
              <Link color="inherit" href="/inspiration" onClick={onBackAllVideo}>
                Toutes les vidéos
              </Link>
              <Typography color="textPrimary">{selectedVideo.title}</Typography>
            </Breadcrumbs>
          </Hidden>
          <Hidden mdUp implementation="css">
            <div style={{ position: "relative", height: "1rem", marginTop: "0.5rem" }}>
              <Button size="medium" onClick={onBackAllVideo} className="back-button">
                <KeyboardArrowLeft />
                {t("back")}
              </Button>
            </div>
          </Hidden>
        </>
      )}
      <Typography color="primary" variant="h1">
        Quelques vidéos pour vous <Inverted>inspirer</Inverted>
      </Typography>
      <NoSsr>
        <InspirationNoSSR selectedVideo={selectedVideo} setSelectedVideo={setSelectedVideo} />
      </NoSsr>
    </div>
  );
};

export default Inspiration;
