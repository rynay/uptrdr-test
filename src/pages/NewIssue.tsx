import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Form } from '../components/Form/Form';
import { createNewIssue } from '../redux/projects/actionCreators';
import { isProjectExist } from '../redux/selectors';
import { Issue } from '../types';

export const NewIssue = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const projectExists = useSelector(isProjectExist(projectId!));

  const onSubmit = (issue: Issue) => {
    dispatch(
      createNewIssue({
        id: projectId!,
        issue,
      })
    );
    navigate(`/projects/${projectId}`);
  };

  return projectExists ? <Form type="issue" onSubmit={onSubmit} /> : <Navigate to={`/projects/${projectId}`} />;
};
