import { Navigate } from 'react-router-dom';
import { IssueBoards } from '../pages/IssueBoards';
import { NewProject } from '../pages/NewProject';
import { NewIssue } from '../pages/NewIssue';
import { Projects } from '../pages/Projects';
import { Issue } from '../pages/Issue';
import { Modal } from '../containers/Modal/Modal';

export const routes = [
  {
    path: '/new-project',
    element: (
      <>
        <Projects />
        <Modal>
          <NewProject />
        </Modal>
      </>
    ),
  },
  {
    path: '/projects',
    element: <Projects />,
  },
  {
    path: '/projects/:projectId',
    element: <IssueBoards />,
  },
  {
    path: '/projects/:projectId/:issueId',
    element: (
      <>
        <IssueBoards />
        <Modal>
          <Issue />
        </Modal>
      </>
    ),
  },
  {
    path: '/projects/:projectId/new-issue',
    element: (
      <>
        <IssueBoards />
        <Modal>
          <NewIssue />
        </Modal>
      </>
    ),
  },
  { path: '*', element: <Navigate to="/projects" /> },
];
