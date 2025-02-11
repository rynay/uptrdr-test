import { AppState } from '.';
import { Issue, IssueBoard, Project } from '../types';

export const selectProjects = (state: AppState) => state.projects;

export const selectIssue = (projectId: Project['project']['id'], issueId: Issue['id']) => (state: AppState) =>
  state.projects[projectId]?.issueBoards
    ?.flatMap((board: IssueBoard) => board.items)
    ?.find((issue) => issue.id === issueId);

export const selectIssueBoards = (projectId: Project['project']['id']) => (state: AppState) =>
  state.projects[projectId]?.issueBoards;

export const selectProject = (projectId: Project['project']['id']) => (state: AppState) => state.projects[projectId];

export const selectProjectTitle = (projectId: Project['project']['id']) => (state: AppState) =>
  state.projects[projectId]?.project.title;

export const isProjectExist = (projectId: Project['project']['id']) => (state: AppState) => projectId in state.projects;

export const selectIssues = (projectId: Project['project']['id']) => (state: AppState) =>
  state.projects[projectId]?.issueBoards.flatMap((board) => board.items);

export const selectChildIssues = (projectId: Project['project']['id'], issueId: Issue['id']) => (state: AppState) => {
  const issues = selectIssues(projectId)(state);
  if (issueId) return issues?.filter((el) => el.parentIssue === issueId);
  return [];
};
