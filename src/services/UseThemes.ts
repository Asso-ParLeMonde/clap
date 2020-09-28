import type { AxiosRequestConfig } from "axios";
import { useQuery, QueryFunction } from "react-query";
import React from "react";

import { UserServiceContext } from "src/services/UserService";
import type { AxiosReturnType } from "src/util/axiosRequest";
import { serializeToQueryUrl } from "src/util";
import type { Theme } from "types/models/theme.type";

export type ThemeNames = { [key: number]: { [key: string]: string } };

export const useThemeNames = (axiosLoggedRequest: (req: AxiosRequestConfig) => Promise<AxiosReturnType>): { themeNames: ThemeNames } => {
  const [themeNames, setThemeNames] = React.useState<ThemeNames>({});

  // get themes
  const getThemeNames = React.useCallback(async () => {
    const response = await axiosLoggedRequest({
      method: "GET",
      url: "/themes?isDefault=true",
    });
    if (!response.error) {
      const themeNames = response.data.reduce((acc: ThemeNames, theme: Theme) => {
        acc[theme.id as number] = theme.names;
        return acc;
      }, {});
      setThemeNames(themeNames);
    }
  }, [axiosLoggedRequest]);
  React.useEffect(() => {
    getThemeNames().catch();
  }, [getThemeNames]);

  return { themeNames };
};

export const useThemes = (
  args: {
    user: boolean;
    isDefault: boolean;
  } = {
    user: false,
    isDefault: false,
  },
): { themes: Theme[] } => {
  const { axiosLoggedRequest } = React.useContext(UserServiceContext);
  const getThemes: QueryFunction<Theme[]> = React.useCallback(async () => {
    const response = await axiosLoggedRequest({
      method: "GET",
      url: `/themes${serializeToQueryUrl(args)}`,
    });
    if (response.error) {
      return [];
    }
    const localThemes: Theme[] = args.user ? [] : JSON.parse(localStorage.getItem("themes")) || [];
    return [...response.data, ...localThemes];
  }, [args, axiosLoggedRequest]);
  const { data, isLoading, error } = useQuery<Theme[], unknown>(["themes", args], getThemes);
  return {
    themes: isLoading ? [] : error ? [] : data,
  };
};

export const useThemeRequests = (): {
  createTheme(args: { newTheme: Theme; isAdmin?: boolean }): Promise<Theme | null>;
} => {
  const { isLoggedIn, axiosLoggedRequest } = React.useContext(UserServiceContext);
  const createTheme = React.useCallback(
    async (args: { newTheme: Theme; isAdmin?: boolean }) => {
      if (isLoggedIn) {
        const response = await axiosLoggedRequest({
          method: "POST",
          url: "/themes",
          data: {
            ...args.newTheme,
            userId: args.isAdmin ? undefined : true,
          },
        });
        if (response.error) {
          console.error(console.error);
          return null;
        }
        args.newTheme.id = response.data.id;
      } else {
        const localThemes = JSON.parse(localStorage.getItem("themes")) || [];
        args.newTheme.id = `local_${localThemes.length + 1}`;
        localThemes.push(args.newTheme);
        localStorage.setItem("themes", JSON.stringify(localThemes));
      }
      return args.newTheme;
    },
    [isLoggedIn, axiosLoggedRequest],
  );

  return { createTheme };
};
