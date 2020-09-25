import type { AxiosRequestConfig } from "axios";
import React from "react";

import type { AxiosReturnType } from "src/util/axiosRequest";
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
