import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import React from "react";

import CreateLogo from "src/svg/create.svg";
import LightLogo from "src/svg/light.svg";
import MoviesLogo from "src/svg/movies.svg";
import SettingsLogo from "src/svg/settings.svg";

const defaultTabs = [
  {
    icon: <CreateLogo />,
    label: "create",
    path: "/create",
  },
  {
    icon: <SettingsLogo />,
    label: "settings",
    path: "/settings",
  },
  {
    icon: <AccountCircleIcon />,
    label: "login",
    path: "/login",
  },
];

const userTabs = [
  {
    label: "create",
    path: "/create",
    icon: <CreateLogo />,
  },
  {
    label: "my_videos",
    path: "/my-videos",
    icon: <MoviesLogo />,
  },
  {
    label: "inspiration",
    path: "/inspiration",
    icon: <LightLogo />,
  },
  {
    label: "settings",
    path: "/settings",
    icon: <SettingsLogo />,
  },
];

export const getTabs = (
  isLoggedIn: boolean,
): Array<{
  icon: JSX.Element;
  label: string;
  path: string;
}> => {
  if (!isLoggedIn) {
    return defaultTabs;
  }

  return userTabs;
};
