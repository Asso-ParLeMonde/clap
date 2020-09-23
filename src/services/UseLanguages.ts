import React from "react";

import { axiosRequest } from "src/util/axiosRequest";
import type { Language } from "types/models/language.type";

export const useLanguages = (): { languages: Language[] } => {
  const [languages, setLanguages] = React.useState<Language[]>([]);

  const getLanguages = React.useCallback(async () => {
    const response = await axiosRequest({
      method: "GET",
      url: "/languages",
    });
    if (!response.error) {
      setLanguages(response.data);
    }
  }, []);

  React.useEffect(() => {
    getLanguages().catch();
  }, [getLanguages]);

  return { languages };
};
