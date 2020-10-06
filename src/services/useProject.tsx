import qs from "query-string";
import React from "react";

import type { Project } from "types/models/project.type";
import type { Theme } from "types/models/theme.type";

import { UserServiceContext } from "./UserService";

const DEFAULT_PROJECT: Project = {
  id: -1,
  title: "",
  date: new Date(),
  user: null,
  theme: null,
  scenario: null,
  questions: null,
};

interface ProjectServiceContextValue {
  project: Project;
  updateProject(newProject: Partial<Project>): void;
}
interface ProjectServiceProviderProps {
  children: React.ReactNodeArray;
}

export const ProjectServiceContext = React.createContext<ProjectServiceContextValue>(undefined);

export const ProjectServiceProvider: React.FunctionComponent<ProjectServiceProviderProps> = ({ children }: ProjectServiceProviderProps) => {
  const { isLoggedIn, axiosLoggedRequest } = React.useContext(UserServiceContext);
  const [project, setProject] = React.useState<Project | null>(null);

  const getDefaultProject = React.useCallback(async (): Promise<Project> => {
    let defaultProject: Project = DEFAULT_PROJECT;
    if (typeof window !== "undefined") {
      const path = window.location.pathname;

      // take last project for part 2, 3 and 4.
      if (path.slice(0, 26) === "/create/2-questions-choice" || path.slice(0, 41) === "/create/3-storyboard-and-filming-schedule" || path.slice(0, 24) === "/create/4-to-your-camera") {
        try {
          defaultProject = JSON.parse(localStorage.getItem("lastProject") || null) || null;
          if (defaultProject.id !== -1 && !isLoggedIn) {
            defaultProject = DEFAULT_PROJECT;
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        // look for location params.
        const locationParams = qs.parse(window.location.search);
        if (locationParams.themeId !== undefined) {
          let theme: Theme | null = null;
          if (locationParams.themeId.slice(0, 5) === "local") {
            theme = (JSON.parse(localStorage.getItem("themes")) || []).find((t: Theme) => t.id === locationParams.themeId) || null;
          } else {
            const response = await axiosLoggedRequest({
              method: "GET",
              url: `/themes/${locationParams.themeId}`,
            });
            if (!response.error) {
              theme = response.data;
            }
          }
          defaultProject.theme = theme;
        }
      }
    }
    return defaultProject;
  }, [isLoggedIn, axiosLoggedRequest]);

  // on init set project
  React.useEffect(() => {
    if (project === null) {
      getDefaultProject()
        .then((p) => setProject(p))
        .catch();
    }
  }, [getDefaultProject, project]);

  const updateProject = (newProject: Partial<Project>): void => {
    if (project === null) return;
    setProject((p) => {
      localStorage.setItem("lastProject", JSON.stringify({ ...p, ...newProject }));
      return {
        ...p,
        ...newProject,
      };
    });
  };

  return <ProjectServiceContext.Provider value={{ project: project || DEFAULT_PROJECT, updateProject }}>{children}</ProjectServiceContext.Provider>;
};
