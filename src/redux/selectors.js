export const selectProjects = (state) => state.projects;

export const selectIssue = (projectId, issueId) => (state) =>
  state.projects[projectId]?.issueBoards?.flatMap((board) => board.items)?.find((issue) => issue.id === issueId);

export const selectIssueBoards = (projectId) => (state) => state.projects[projectId]?.issueBoards;

export const selectProject = (projectId) => (state) => state.projects[projectId];

export const selectProjectTitle = (projectId) => (state) => state.projects[projectId]?.project.title;

export const isProjectExist = (projectId) => (state) => projectId in state.projects;

export const selectIssues = (projectId) => (state) =>
  state.projects[projectId]?.issueBoards.flatMap((board) => board.items);

export const selectChildIssues = (projectId, issueId) => (state) => {
  const issues = selectIssues(projectId)(state);
  if (issueId) return issues?.filter((el) => el.parentIssue === issueId);
  return [];
};
