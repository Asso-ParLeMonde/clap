import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { UserServiceContext } from "src/services/UserService";
import { getTabs } from "src/util/tabs";

import ElevationScroll from "./ElevationScroll";
import NavBarTab from "./NavBarTab";

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
  homeLink: string;
  currentPath: string;
}

export const NavBar: React.FunctionComponent<NavBarProps> = (props: NavBarProps) => {
  const classes = useStyles();
  const router = useRouter();
  const [value, setValue] = React.useState(1);
  const { isLoggedIn } = React.useContext(UserServiceContext);

  const tabs = getTabs(isLoggedIn);

  useEffect(() => {
    const navtabs = getTabs(isLoggedIn);
    const index = navtabs.reduce((i1, tab, i2) => (tab.path.split("/")[1] === props.currentPath.split("/")[1] ? i2 : i1), -1);
    setValue(index + 1);
  }, [isLoggedIn, props.currentPath]);

  const handleHomeLink = (event: React.MouseEvent): void => {
    event.preventDefault();
    router.push(props.homeLink);
  };

  const currentTab = value > tabs.length ? 0 : value;

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
                  <Tabs value={currentTab} aria-label="navbar" classes={{ indicator: classes.indicator }}>
                    <NavBarTab label="" path="/" style={{ display: "none" }} />
                    {tabs.map((tab, index) => (
                      <NavBarTab label={tab.label} path={tab.path} icon={tab.icon} key={index} selected={index === currentTab - 1} />
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
