import classnames from "classnames";
import React from "react";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = (color: "primary" | "secondary") =>
  makeStyles((theme) => ({
    inverted: {
      backgroundColor: (theme.palette[color] || {}).main,
      color: (theme.palette[color] || {}).contrastText,
      padding: "0 0.1rem",
    },
    round: {
      borderRadius: "1rem",
      display: "inline-block",
      height: "2rem",
      textAlign: "center",
      width: "2rem",
    },
  }));

interface InvertedProps {
  children: React.ReactNode;
  round?: boolean;
  color?: "primary" | "secondary";
}

export const Inverted: React.FunctionComponent<InvertedProps> = ({ children, round = false, color = "primary" }: InvertedProps) => {
  const classes = useStyles(color)();

  return (
    <span
      className={classnames(classes.inverted, {
        [classes.round]: round,
      })}
    >
      {children}
    </span>
  );
};
