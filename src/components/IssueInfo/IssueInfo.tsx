import { Link, NavLink, useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';
import classNames from 'classnames';
import { Priority } from '../Priority/Priority';
import { StoryPoints } from '../StoryPoints/StoryPoints';
import { Status } from '../Status/Status';
import { selectChildIssues, selectIssue } from '../../redux/selectors';
import { CommentSection } from '../Comments/CommentSection';
import { getDateLabel } from './helpers';
import styles from './IssueInfo.module.scss';
import { DetailedHTMLProps, FC, HTMLAttributes, useEffect, useMemo, useState } from 'react';
import { Issue } from '../../types';
import { FileUploader } from '../FileUploader/FileUploader';
import localforage from 'localforage';

type Props = {
  issue: Issue;
  full?: boolean;
} & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

export const IssueInfo: FC<Props> = ({ issue, full, children, ...props }) => {
  const { projectId, issueId } = useParams();
  const location = useLocation();
  const childIssues = useSelector(selectChildIssues(projectId!, issueId!));
  const parentIssue = useSelector(selectIssue(projectId!, issue?.parentIssue));
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    let result: File[] = [];
    issue.fileIds?.forEach(async (id) => {
      const value: File | null = await localforage.getItem(id, (_, val) => val);
      if (value) {
        result.push(value)
      }
    setFiles(result);
  })
  }, [issue.fileIds])

  if (!full)
    return (
      <section className={styles.issue} {...props}>
        <h3 className={styles.issue__title}>{issue.title}</h3>
        <div className={styles.issue__footer}>
          <Priority value={issue.priority} />
          {issue.points && <StoryPoints>{issue.points}</StoryPoints>}
          {issue.updated && <p>{getDateLabel(issue)}</p>}
          <p className={styles.issue__label}>{issue.info}</p>
        </div>
      </section>
    );

  return (
    <section className={classNames(styles.issue, styles.issue_full)} {...props}>
      <h3 className={classNames(styles.issue__title, styles.issue__title_full)}>
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
      <p className={styles.issue__description}>{issue.description}</p>
      <FileUploader
        files={files}
      />
      <div className="horizontalLine" />
      <div className="column">
        {parentIssue && (
          <>
            <h2>Parent issue:</h2>
            <NavLink className="link" to={`/projects/${projectId}/${parentIssue.id}`}>
              <IssueInfo issue={parentIssue} />
            </NavLink>
          </>
        )}
        <h2>Child issues:</h2>
        {childIssues.map((issue) => (
          <NavLink key={issue.id} className="link" to={`/projects/${projectId}/${issue.id}`}>
            <IssueInfo issue={issue} />
          </NavLink>
        ))}
        <span>
          <Link
            className={classNames('buttonLink', 'buttonLink--primary')}
            to={`/projects/${projectId}/new-issue`}
            state={{ from: location }}
          >
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
