import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
// import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";

import ElevationScroll from "./ElevationScroll";
import NavBarTab, { NavBarTabProps } from "./NavBarTab";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  indicator: {
    backgroundColor: theme.palette.primary.main,
  },
}));

interface NavBarProps {
  title: string;
  tabs: NavBarTabProps[];
  homeLink: string;
  currentPath: string;
}

const t = (s: string): string => s;

export const NavBar: React.FunctionComponent<NavBarProps> = (props: NavBarProps) => {
  // const { t } = useTranslation();
  const classes = useStyles();
  const router = useRouter();
  const [value, setValue] = React.useState(1);

  useEffect(() => {
    const index = props.tabs.reduce((i1, tab, i2) => (tab.path.split("/")[1] === props.currentPath.split("/")[1] ? i2 : i1), -1);
    setValue(index + 1);
  }, [props.tabs, props.currentPath]);

  const handleHomeLink = (event: any): void => {
    event.preventDefault();
    router.push(props.homeLink);
  };

  return (
    <React.Fragment>
      <ElevationScroll {...props}>
        <AppBar position="fixed" className={classes.appBar}>
          <Container maxWidth="lg">
            <Toolbar variant="dense" style={{ padding: 0 }}>
              <Grid container alignItems="center" justify="space-between">
                <Grid item>
                  <a href={props.homeLink} style={{ color: "white" }} onClick={handleHomeLink}>
                    <img src="/pelico.svg" alt="logo" style={{ height: "36px", width: "auto" }} />
                    <Typography variant="h6" className="plm-logo-title">
                      {props.title}
                    </Typography>
                  </a>
                </Grid>
                <Grid item>
                  <Tabs value={value} aria-label="navbar" classes={{ indicator: classes.indicator }}>
                    <NavBarTab label="" path="/" style={{ display: "none" }} />
                    {props.tabs.map((tab, index) => (
                      <NavBarTab label={t(tab.label)} path={tab.path} icon={tab.icon} key={index} selected={index === value - 1} />
                    ))}
                  </Tabs>
                </Grid>
              </Grid>
            </Toolbar>
          </Container>
        </AppBar>
      </ElevationScroll>
      <Toolbar variant="dense" />
    </React.Fragment>
  );
};
