import { DraggableLocation } from 'react-beautiful-dnd';
import { Issue, Project, Comment, IssueBoard } from '../../types';
import * as types from './types';

type CreateProjectPayload = {
  id: string;
  title: string;
};

export const createProject = (payload: CreateProjectPayload) => ({
  type: types.CREATE_PROJECT,
  payload,
});

type IssuePayload = {
  id: Project['project']['id'];
  issue: Issue;
};

export const createNewIssue = (payload: IssuePayload) => ({
  type: types.CREATE_NEW_ISSUE,
  payload,
});

export const updateIssue = (payload: IssuePayload) => ({
  type: types.UPDATE_ISSUE,
  payload,
});

type MoveIssuePayload = {
  id: Issue['id'];
  state?: IssueBoard[];
  sInd?: number;
  dInd?: number;
  source: DraggableLocation;
  destination: DraggableLocation;
};

export const moveIssue = (payload: MoveIssuePayload) => ({
  type: types.MOVE_ISSUE,
  payload,
});

type AddCommentPayload = {
  projectId: Project['project']['id'];
  issueId: Issue['id'];
  comment: Comment['text'];
  parentCommentId?: Comment['id'];
};

export const addComment = (payload: AddCommentPayload) => ({
  type: types.ADD_COMMENT,
  payload,
});

export type Action =
  | ReturnType<typeof createProject>
  | ReturnType<typeof createNewIssue>
  | ReturnType<typeof updateIssue>
  | ReturnType<typeof moveIssue>
  | ReturnType<typeof addComment>;
