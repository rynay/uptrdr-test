import { DetailedHTMLProps, FC, HTMLAttributes, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import classNames from 'classnames';
import { Form } from '../components/Form/Form';
import { updateIssue } from '../redux/projects/actionCreators';
import { IssueInfo } from '../components/IssueInfo/IssueInfo';
import { isProjectExist, selectIssue } from '../redux/selectors';
import { Issue as IssueType } from '../types';

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const Issue: FC<Props> = (props) => {
  const [isOnEdit, setIsOnEdit] = useState(false);
  const { projectId, issueId } = useParams();
  const projectExists = useSelector(isProjectExist(projectId!));
  const dispatch = useDispatch();
  const issue = useSelector(selectIssue(projectId!, issueId!));

  const onSubmit = (value: IssueType) => {
    dispatch(
      updateIssue({
        id: projectId!,
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
    <div className="container" {...props}>
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
