import { Link, NavLink, useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import '../../styles/common.scss';
import { Priority } from '../Priority/Priority';
import { StoryPoints } from '../StoryPoints/StoryPoints';
import { Status } from '../Status/Status';
import { selectChildIssues, selectIssue } from '../../redux/selectors';
import { CommentSection } from '../Comments/CommentSection';
import './IssueInfo.scss';
import { getDateLabel } from './helpers';
import moment from 'moment';

export const IssueInfo = ({ issue, full, children }) => {
  const { projectId, issueId } = useParams();
  const location = useLocation();
  const childIssues = useSelector(selectChildIssues(projectId, issueId));
  const parentIssue = useSelector(selectIssue(projectId, issue?.parentIssue));

  if (!full)
    return (
      <section className="issue">
        <h3 className="issue__title">{issue.title}</h3>
        <div className="issue__footer">
          <Priority value={issue.priority} />
          {issue.points && <StoryPoints>{issue.points}</StoryPoints>}
          {issue.updated && <p>{getDateLabel(issue)}</p>}          
          <p className="issue__label">{issue.info}</p>
        </div>
      </section>
    );

  return (
    <section className={classNames('issue', 'issue--full')}>
      <h3 className={classNames('issue__title', 'issue__title--full')}>
        [{issue.info}] {issue.title}
      </h3>
      {issue.created && <p>Created {moment(issue.created).fromNow()}</p>}
      <div className="flexContainer">
        <Priority value={issue.priority} />
        {issue.points && <StoryPoints>{issue.points}</StoryPoints>}
        <Status>{issue.status}</Status>
        {issue.updated && <p>{getDateLabel(issue)}</p>}
        {children}
      </div>
      <h2>Description:</h2>
      <p className="issue__description">{issue.description}</p>
      <div className="horizontalLine" />
      <div className="column">
        {parentIssue && (
          <>
            <h2>Parent issue:</h2>
            <NavLink className="issueLink" to={`/projects/${projectId}/${parentIssue.id}`}>
              <IssueInfo issue={parentIssue} />
            </NavLink>
          </>
        )}
        <h2>Child issues:</h2>
        {childIssues.map((issue) => (
          <NavLink key={issue.id} className="issueLink" to={`/projects/${projectId}/${issue.id}`}>
            <IssueInfo issue={issue} />
          </NavLink>
        ))}
        <span>
          <Link className={classNames('buttonLink', 'buttonLink--primary')} to={`/projects/${projectId}/new-issue`} state={{ from: location }}>
            New child issue
          </Link>
        </span>
      </div>
      <div className="horizontalLine" />
      <h2>Comments:</h2>
      <CommentSection />
    </section>
  );
};
