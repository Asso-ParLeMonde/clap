import { useQueryCache } from "react-query";
import React from "react";

import { UserServiceContext } from "src/services/UserService";
import { serializeToQueryUrl } from "src/util";
import type { Question } from "types/models/question.type";

export const useQuestionRequests = (): { getDefaultQuestions(args: { isDefault?: boolean; scenarioId: string | number | null; languageCode?: string }): Promise<Question[]> } => {
  const queryCache = useQueryCache();
  const { axiosLoggedRequest } = React.useContext(UserServiceContext);
  const getDefaultQuestions = React.useCallback(
    async (args: { isDefault?: boolean; scenarioId: string | number | null; languageCode?: string }): Promise<Question[]> => {
      if (args.scenarioId === null || typeof args.scenarioId === "string") {
        return [];
      }
      const url: string = `/questions${serializeToQueryUrl(args)}`;
      const response =
        (queryCache.getQueryData(["questions", args]) as { error?: unknown; data: Question[] }) ||
        (await queryCache.fetchQuery(["questions", args], async () =>
          axiosLoggedRequest({
            method: "GET",
            url,
          }),
        ));
      if (!response.error) {
        return response.data;
      }
      return [];
    },
    [queryCache, axiosLoggedRequest],
  );

  return { getDefaultQuestions };
};
