import { DetailedHTMLProps, FC, HTMLAttributes, useCallback, useState } from 'react';
import { DragDropContext, OnDragEndResponder } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Board } from '../components/Board/Board';
import { Filter } from '../components/Filter/Filter';
import { moveIssue } from '../redux/projects/actionCreators';
import { isProjectExist, selectIssueBoards } from '../redux/selectors';
import '../styles/common.scss';
import classNames from 'classnames';
import { IssueBoard } from '../types';

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const IssueBoards: FC<Props> = (props) => {
  const { projectId } = useParams();
  const issueBoards = useSelector(selectIssueBoards(projectId!));
  const projectExists = useSelector(isProjectExist(projectId!));
  const [filteredState, setFilteredState] = useState<IssueBoard[] | null>(null);
  const dispatch = useDispatch();

  const onDragEnd: OnDragEndResponder = useCallback(
    (result) => {
      const { source, destination } = result;

      if (!destination) {
        return;
      }

      const sInd = +source.droppableId;
      const dInd = +destination.droppableId;

      dispatch(
        moveIssue({
          id: projectId!,
          source,
          destination,
          ...(sInd !== dInd ? { sInd, dInd } : {}),
        })
      );
    },
    [projectId, dispatch]
  );

  const updateFilteredState = useCallback((newState: IssueBoard[] | null) => {
    setFilteredState(newState);
  }, []);

  return projectExists ? (
    <div className="container" {...props}>
      <div className="flexContainer">
        <h1>Issue Boards</h1>
        <Link className={classNames('buttonLink', 'buttonLink--primary')} to={`/projects/${projectId}/new-issue`}>
          New issue
        </Link>
      </div>
      <Filter setFilteredData={updateFilteredState} />
      <section className="kanbanContainer">
        <DragDropContext onDragEnd={onDragEnd}>
          {(filteredState || issueBoards)?.map((board, index) => (
            <Board key={index} projectId={projectId!} board={board} boardIndex={index} />
          ))}
        </DragDropContext>
      </section>
    </div>
  ) : (
    <Navigate to={`/projects/${projectId}`} />
  );
};
