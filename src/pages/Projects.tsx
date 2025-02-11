import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { selectProjects } from '../redux/selectors';
import '../styles/common.scss';

export const Projects = () => {
  const projects = useSelector(selectProjects);

  return (
    <div className="container">
      <Link className={classNames('buttonLink', 'buttonLink--primary')}  to={`/new-project`}>
        Create a new project
      </Link>
      <ul className="projectList">
        {!Object.values(projects).length && <h2>No projects yet</h2>}
        {Object.values(projects).map((project) => (
          <li key={project.project.id}>
            <Link className="titleLink" to={`/projects/${project.project.id}`}>
              Project: {project.project.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
