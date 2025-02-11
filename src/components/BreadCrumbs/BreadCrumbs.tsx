import { useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { routes } from '../../data/routes';
import { selectIssue, selectProjectTitle } from '../../redux/selectors';
import styles from './BreadCrumbs.module.scss';
import classNames from 'classnames';

export const BreadCrumbs = () => {
  const { pathname } = useLocation();
  const { projectId, issueId } = useParams();
  const [breadCrumbs, setBreadCrumbs] = useState<string[]>([]);
  const projectTitle = useSelector(selectProjectTitle(projectId!));
  const issue = useSelector(selectIssue(projectId!, issueId!));

  useLayoutEffect(() => {
    const route = routes.find(
      (route) => route.path === pathname.replace(projectId!, ':projectId').replace(issueId!, ':issueId')
    );
    if (!route) return;
    setBreadCrumbs((state) =>
      route.path
        ? pathname
            .slice(1)
            .split('/')
            .map((_, idx, array) => '/' + array.slice(0, idx + 1).join('/'))
        : state
    );
  }, [pathname, issueId, projectId]);

  return (
    <ul className={styles.breadCrumbs}>
      {breadCrumbs.map((route, index) => {
        let label = route.split('/').pop();
        if (label === projectId) label = projectTitle || "Project Doesn't Exist";
        else if (label === issueId) label = `${issue?.info} ${issue?.title}` || "Issue Doesn't Exist";
        else
          label = label
            ?.split('-')
            .map((word) => word[0].toUpperCase() + word.slice(1))
            .join(' ');

        return (
          <li key={route}>
            <NavLink
              to={route}
              className={classNames(styles.breadCrumbs__link, {
                [styles.breadCrumbs__link_active]: index === breadCrumbs.length - 1,
              })}
            >
              {label}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
};
