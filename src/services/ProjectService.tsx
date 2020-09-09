import React from "react";

import type { Project } from "types/models/project.type";

const DEFAULT_PROJECT: Project = {
  id: 0,
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
  const [project, setProject] = React.useState<Project>(DEFAULT_PROJECT);

  const updateProject = (newProject: Partial<Project>): void => {
    setProject((p) => {
      localStorage.setItem("lastProject", JSON.stringify({ ...p, ...newProject }));
      return {
        ...p,
        ...newProject,
      };
    });
  };

  return <ProjectServiceContext.Provider value={{ project, updateProject }}>{children}</ProjectServiceContext.Provider>;
};
