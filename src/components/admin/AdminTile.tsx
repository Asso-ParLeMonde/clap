import React from "react";

interface AdminTileProps {
  title: string;
  children?: React.ReactNode | React.ReactNodeArray | null;
  toolbarButton?: React.ReactNode | null;
  style?: React.CSSProperties;
}

import Paper from "@material-ui/core/Paper";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, createStyles, Theme as MaterialTheme } from "@material-ui/core/styles";

const useTableStyles = makeStyles((theme: MaterialTheme) =>
  createStyles({
    toolbar: {
      backgroundColor: theme.palette.secondary.main,
      color: "white",
      fontWeight: "bold",
      minHeight: "unset",
      padding: "8px 8px 8px 16px",
    },
    title: {
      flex: "1 1 100%",
      padding: "6px 0",
    },
  }),
);

export const AdminTile: React.FunctionComponent<AdminTileProps> = ({ title, children = null, toolbarButton = null, style = {} }: AdminTileProps) => {
  const classes = useTableStyles();
  return (
    <Paper style={{ ...style, overflow: "hidden" }}>
      <Toolbar className={classes.toolbar}>
        <Typography variant="h2" id="themetabletitle" component="div" className={classes.title}>
          {title}
        </Typography>
        {toolbarButton}
      </Toolbar>
      {children}
    </Paper>
  );
};
