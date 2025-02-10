import * as types from './types';

export const createProject = (payload) => ({
  type: types.CREATE_PROJECT,
  payload,
});

export const createNewIssue = (payload) => ({
  type: types.CREATE_NEW_ISSUE,
  payload,
});

export const updateIssue = (payload) => ({
  type: types.UPDATE_ISSUE,
  payload,
});

export const moveIssue = (payload) => ({
  type: types.MOVE_ISSUE,
  payload,
});

export const addComment = (payload) => ({
  type: types.ADD_COMMENT,
  payload,
});
