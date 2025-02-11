import { v4 as uuidv4 } from 'uuid';
import { priorities } from '../data/labels';
import * as types from './types';
import { addChildToThree, insertIssue, moveInsideAnArray, moveInsideAnArrayOfArrays, updateStatuses } from './helpers';
import { Issue, IssueBoard, Project } from '../../types';
import { Action } from './actionCreators';

const defaultProject = {
  issueBoards: [
    { title: 'Queue', items: [] as IssueBoard[] },
    { title: 'Development', items: [] as IssueBoard[] },
    { title: 'Done', items: [] as IssueBoard[] },
  ],
};

export type ProjectsState = {
  [id: string]: Project;
};

export const initialState: ProjectsState = {};

export default function projectsReducer(state = initialState, action: Action) {
  switch (action.type) {
    case types.CREATE_PROJECT:
      const project = action.payload;
      return {
        ...state,
        [project.id]: {
          ...defaultProject,
          project,
        },
      };
    case types.CREATE_NEW_ISSUE: {
      const { id, issue } = action.payload;
      issue.status = issue.status || state[id].issueBoards[0].title;
      issue.priority = issue.priority || 'Unknown';
      const infoId = state[id].issueBoards?.flatMap((board) => board.items)?.length || 0;
      issue.id = infoId.toString();
      issue.created = Date.now();
      issue.updated = Date.now();
      issue.comments = [];
      issue.info = `${priorities[issue.priority]}-${infoId}`;
      const board = state[id].issueBoards.find((board) => board.title === issue.status)?.items;
      const updatedBoard = insertIssue(board, issue);

      return {
        ...state,
        [id]: {
          ...state[id],
          issueBoards: state[id].issueBoards.map((board) =>
            issue.status === board.title ? { ...board, items: updatedBoard } : board
          ),
        },
      };
    }
    case types.UPDATE_ISSUE: {
      const { id, issue } = action.payload;
      let targetIssue = state[id].issueBoards.flatMap((board) => board.items).find((item) => item.id === issue.id);
      if (targetIssue) targetIssue = { ...targetIssue } as Issue;

      if (targetIssue?.status === issue.status) {
        targetIssue = {
          ...targetIssue,
          ...issue,
        };
        targetIssue.info = `${priorities[issue.priority]}-${targetIssue.info.split('-')[1]}`;
        return {
          ...state,
          [id]: {
            ...state[id],
            issueBoards: state[id].issueBoards.map((board) => ({
              ...board,
              items: board.items.map((el) => (el.id === issue.id ? targetIssue : el)),
            })),
          },
        };
      } else {
        const updatedIssue: Issue = {
          ...issue,
          updated: Date.now(),
        };
        const from = state[id].issueBoards.find((board) => board.title === targetIssue?.status)?.items;
        const to = state[id].issueBoards.find((board) => board.title === issue.status)?.items;
        const newTo = insertIssue(to, updatedIssue);
        let newFrom = [...(from || [])];
        if (targetIssue?.index) newFrom.splice(targetIssue?.index, 1);

        return {
          ...state,
          [id]: {
            ...state[id],
            issueBoards: state[id].issueBoards.map((board) => {
              switch (board.title) {
                case targetIssue?.status:
                  return { ...board, items: newFrom };
                case issue.status:
                  return { ...board, items: newTo };
                default:
                  return board;
              }
            }),
          },
        };
      }
    }
    case types.MOVE_ISSUE: {
      const { id, sInd } = action.payload;
      const modifiedBoard = (sInd !== undefined ? moveInsideAnArrayOfArrays : moveInsideAnArray)({
        ...action.payload,
        state: state[id].issueBoards,
      });

      const newBoards = updateStatuses(modifiedBoard);

      return {
        ...state,
        [id]: {
          ...state[id],
          issueBoards: newBoards,
        },
      };
    }
    case types.ADD_COMMENT: {
      const { projectId, issueId, comment, parentCommentId } = action.payload;

      const targetIssue = state[projectId].issueBoards
        .flatMap((board) => board.items)
        .find((item) => item.id === issueId);
      let updatedIssue: Issue;

      if (!targetIssue) return state;

      if (parentCommentId) {
        updatedIssue = {
          ...targetIssue,
          comments: targetIssue?.comments.map(
            addChildToThree(parentCommentId, {
              id: uuidv4(),
              text: comment,
              children: [],
              created: Date.now(),
            })
          ),
        };
      } else {
        updatedIssue = {
          ...targetIssue,
          comments: [
            ...(targetIssue?.comments || []),
            {
              id: uuidv4(),
              text: comment,
              children: [],
              created: Date.now(),
            },
          ],
        };
      }
      return {
        ...state,
        [projectId]: {
          ...state[projectId],
          issueBoards: state[projectId].issueBoards.map((board) => ({
            ...board,
            items: board.items.map((el) => (el.id === issueId ? updatedIssue : el)),
          })),
        },
      };
    }
    default:
      return state;
  }
}
