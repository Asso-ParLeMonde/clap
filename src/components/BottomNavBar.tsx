import { useRouter } from "next/router";
import React, { useEffect } from "react";

import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import { withStyles } from "@material-ui/core/styles";

import { useTranslation } from "src/i18n/useTranslation";
import { UserServiceContext } from "src/services/UserService";
import { getTabs } from "src/util/tabs";

const StyledTab = withStyles((theme) => ({
  root: {
    fill: "#808080",
    color: "#808080",
  },
  selected: {
    fill: theme.palette.secondary.main,
    color: `${theme.palette.secondary.main}!important`,
  },
}))(BottomNavigationAction);

export const BottomNavBar: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { isLoggedIn } = React.useContext(UserServiceContext);
  const [activeTab, setActiveTab] = React.useState(0);

  const tabs = getTabs(isLoggedIn);

  useEffect(() => {
    const navtabs = getTabs(isLoggedIn);
    const index = navtabs.reduce((i1, tab, i2) => (tab.path.split("/")[1] === router.pathname.split("/")[1] ? i2 : i1), -1);
    setActiveTab(index + 1);
  }, [isLoggedIn, router.pathname]);

  return (
    <React.Fragment>
      <div style={{ height: "60px" }} />
      <BottomNavigation
        value={activeTab}
        onChange={(_event, newValue) => {
          setActiveTab(newValue);
        }}
        showLabels
        className="bottom-navbar"
      >
        <StyledTab label="" style={{ display: "none" }} />
        {tabs.map((tab, index) => (
          <StyledTab
            label={t(tab.label)}
            icon={tab.icon}
            key={index}
            onClick={(event: React.MouseEvent) => {
              event.preventDefault();
              router.push(tab.path);
            }}
          />
        ))}
      </BottomNavigation>
    </React.Fragment>
  );
};
