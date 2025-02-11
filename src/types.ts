import { priorities } from './redux/data/labels';

export type Status = 'Queue' | 'Development' | 'Done';

export type Issue = {
    id: string;
    points: number;
    title: string;
    description: string;
    created: number;
    updated: number;
    status: Status;
    info: string;
    index: number;
    priority: keyof typeof priorities
    comments: Comment[];
    droppableId?: string;
    parentIssue: Issue['id'];
}

export type Comment = {
    id: string;
    text: string;
    created: number;
    children: Comment[];
}

export type IssueBoard = {
    title: string;
    items: Issue[];
}

export type Project = {
    project: {
        id: string;
        title: string;
    }
    issueBoards: IssueBoard[];
}