import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Form } from '../components/Form/Form';
import { updateIssue } from '../redux/projects/actionCreators';
import { Navigate } from 'react-router-dom';
import '../styles/common.scss';
import { IssueInfo } from '../components/IssueInfo/IssueInfo';
import { isProjectExist, selectIssue } from '../redux/selectors';
import classNames from 'classnames';

export const Issue = () => {
  const [isOnEdit, setIsOnEdit] = useState(false);
  const { projectId, issueId } = useParams();
  const projectExists = useSelector(isProjectExist(projectId));
  const dispatch = useDispatch();
  const issue = useSelector(selectIssue(projectId, issueId));

  const onSubmit = (value) => {
    dispatch(
      updateIssue({
        id: projectId,
        issue: value,
      })
    );
    setIsOnEdit(false);
  };
  const handleClick = () => {
    setIsOnEdit((state) => !state);
  };

  if (!projectExists) return <Navigate to={`/project/${projectId}`} />;

  if (!issue) return <h1>Issue Doesn't Exist</h1>;

  return (
    <div className="container">
      {isOnEdit && <Form type="issue" initialState={issue} onSubmit={onSubmit} />}
      {!isOnEdit && (
        <IssueInfo full issue={issue}>
          <button className={classNames('button', 'button--primary')} onClick={handleClick}>
            Edit
          </button>
        </IssueInfo>
      )}
    </div>
  );
};
