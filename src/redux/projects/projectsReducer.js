import { priorities } from '../data/labels';
import * as types from './types';
import { addChildToThree, insertIssue, moveInsideAnArray, moveInsideAnArrayOfArrays, updateStatuses } from './helpers';
import { v4 as uuidv4 } from 'uuid';

// type Action = ReturnType<typeof AC[keyof typeof AC]>;

// export type AppState = {
//   lists: TList[];
//   getTasksByListId?: (id: TList["id"]) => TTask[];
//   dispatch?: Dispatch<Action>;
// };

const defaultProject = {
  issueBoards: [
    { title: 'Queue', items: [] },
    { title: 'Development', items: [] },
    { title: 'Done', items: [] },
  ],
};

export const initialState = {};

export default function projectsReducer(state = initialState, action) {
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
      const board = state[id].issueBoards.find((board) => board.title === issue.status).items;
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
      targetIssue = { ...targetIssue };

      if (targetIssue.status === issue.status) {
        Object.entries(issue).forEach(([key, value]) => {
          targetIssue[key] = value;
        });
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
        const updatedIssue = {
          ...issue,
          updated: Date.now(),
        }
        const from = state[id].issueBoards.find((board) => board.title === targetIssue.status).items;
        const to = state[id].issueBoards.find((board) => board.title === issue.status).items;
        const newTo = insertIssue(to, updatedIssue);
        let newFrom = [...from];
        newFrom.splice(targetIssue.index, 1);
        return {
          ...state,
          [id]: {
            ...state[id],
            issueBoards: state[id].issueBoards.map((board) => {
              switch (board.title) {
                case targetIssue.status:
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
        state: state[id].issueBoards,
        ...action.payload,
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
      const {
        projectId,
        issueId,
        comment,
        parentCommentId
      } = action.payload;

      const targetIssue = state[projectId].issueBoards.flatMap((board) => board.items).find((item) => item.id === issueId);
      let updatedIssue;

      if (parentCommentId) {
        updatedIssue = {
          ...targetIssue,
          comments: targetIssue.comments.map(addChildToThree(parentCommentId, {
            id: uuidv4(),
            text: comment,
            children: [],
            created: Date.now(),
          }))
        }
      } else {
        updatedIssue = {
          ...targetIssue,
          comments: [
            ...targetIssue.comments,
            {
              id: uuidv4(),
              text: comment,
              children: [],
              created: Date.now(),
            }
          ]
        }
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
