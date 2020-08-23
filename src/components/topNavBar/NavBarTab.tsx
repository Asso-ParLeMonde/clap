import Tab from "@material-ui/core/Tab";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import React from "react";

import { useTranslation } from "src/i18n/useTranslation";

// === Styling the NavBarTab ===
const useStyles = makeStyles((theme) => ({
  root: {
    fill: "#fff",
    fontFamily: "'Alegreya Sans', sans-serif",
    fontSize: "1.2rem",
    fontWeight: "bold",
    margin: "6px 12px",
    minHeight: "36px",
    opacity: 1,
    padding: "0 0.5rem",
    textTransform: "none",
    // eslint-disable-next-line sort-keys
    "&.selected": {
      backgroundColor: "#fff",
      color: theme.palette.primary.main,
      fill: theme.palette.primary.main,
    },
  },
}));

export interface NavBarTabProps {
  label: string;
  path: string;
  icon?: JSX.Element;
}
export interface TabOwnProps {
  selected?: boolean;
  style?: React.CSSProperties;
}

const NavBarTab: React.FunctionComponent<NavBarTabProps & TabOwnProps> = ({ label, path, icon = <span />, style = {}, selected = false }: NavBarTabProps & TabOwnProps) => {
  const classes = useStyles();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Tab
      component="a"
      onClick={(event) => {
        event.preventDefault();
        router.push(path);
      }}
      href={path}
      label={
        <span className="tab-label">
          {t(label)}
          {icon}
        </span>
      }
      aria-controls={`top-navbar-tab-${label}`}
      id={`top-navbar-tab-${label}`}
      style={style}
      classes={classes}
      className={selected ? "selected" : ""}
    />
  );
};

export default NavBarTab;
