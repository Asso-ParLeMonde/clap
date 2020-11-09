import React from "react";

import Typography from "@material-ui/core/Typography";
import { NoSsr } from "@material-ui/core";

import { Inverted } from "src/components/Inverted";
import { VideoCarousel } from "src/components/inspiration/VideoCarousel";

const Inspiration: React.FunctionComponent = () => {
  return (
    <div>
      <Typography color="primary" variant="h1">
        Quelques vidéos pour vous <Inverted>inspirer</Inverted>
      </Typography>
      <NoSsr>
        <div className="section">
          <VideoCarousel themeName="Ma classe" videos={10} />
        </div>
        <div className="section">
          <VideoCarousel themeName="Jeux vidéos" videos={6} />
        </div>
      </NoSsr>
    </div>
  );
};

export default Inspiration;
