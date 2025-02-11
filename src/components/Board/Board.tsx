import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import { NavLink } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd';
import { Droppable } from 'react-beautiful-dnd';
import { IssueInfo } from '../IssueInfo/IssueInfo';
import { Status } from '../Status/Status';
import styles from './Board.module.scss';
import { IssueBoard } from '../../types';

type Props = {
  boardIndex: number;
  board: IssueBoard;
  projectId: string;
} & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

export const Board: FC<Props> = ({ boardIndex, board, projectId, ...props }) => {
  return (
    <section className={styles.board} {...props}>
      <Status>{board.title}</Status>
      <Droppable droppableId={`${boardIndex}`}>
        {(provided) => (
          <ul className={styles.board__list} ref={provided.innerRef} {...provided.droppableProps}>
            {board.items.map((item) => (
              <Draggable key={item.id} draggableId={item.id} index={item.index}>
                {(provided) => (
                  <li
                    className={styles.board__listItem}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <NavLink className="link" to={`/projects/${projectId}/${item.id}`}>
                      <IssueInfo issue={item} />
                    </NavLink>
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </section>
  );
};
