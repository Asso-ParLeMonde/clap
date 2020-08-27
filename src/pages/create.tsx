import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import type { AxiosRequestConfig } from "axios";
import classnames from "classnames";
import type { NextPage, NextPageContext } from "next";
import React from "react";

import { Inverted } from "src/components/Inverted";
import { Trans } from "src/components/Trans";
import { ThemeCard } from "src/components/create/ThemeCard";
import { axiosRequest } from "src/util/axiosRequest";
import { getInitialData } from "src/util/data";
import type { Theme } from "types/entities/theme.type";

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.down(600)]: {
      gridTemplateColumns: "1fr 1fr",
    },
  },
}));

interface CreateProps {
  themes: Theme[];
}

const Create: NextPage<CreateProps> = ({ themes }: CreateProps) => {
  const classes = useStyles();

  return (
    <>
      <Typography color="primary" variant="h1">
        <Trans i18nKey="create_theme_title">
          Sur quel <Inverted>thème</Inverted> sera votre vidéo ?
        </Trans>
      </Typography>
      <div className={classnames(classes.container, "theme-cards-container")}>
        <div key="new">
          <ThemeCard />
        </div>
        {themes.map((t, index) => (
          <div key={index}>
            <ThemeCard {...t} />
          </div>
        ))}
      </div>
    </>
  );
};

Create.getInitialProps = async (ctx: NextPageContext): Promise<CreateProps> => {
  const { user, csrfToken } = getInitialData(ctx);
  const url: string = `/themes?isPublished=true${user ? "&user" : ""}`;
  const params: AxiosRequestConfig = {
    method: "GET",
    url,
    headers: {
      "csrf-token": csrfToken,
    },
  };
  // server call
  if (ctx.req !== undefined) {
    params.baseURL = "http://localhost:5000/api";
  }
  const response = await axiosRequest(params);
  return {
    themes: response.error ? [] : response.data,
  };
};

export default Create;
