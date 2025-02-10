import { NavLink } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd';
import { Droppable } from 'react-beautiful-dnd';
import { IssueInfo } from '../IssueInfo/IssueInfo';
import { Status } from '../Status/Status';
import '../../styles/common.scss';
import './Board.scss';

export const Board = ({ boardIndex, board, projectId }) => {
  return (
    <section className="board">
      <Status>{board.title}</Status>
      <Droppable droppableId={`${boardIndex}`}>
        {(provided) => (
          <ul className="board__list" ref={provided.innerRef} {...provided.droppableProps}>
            {board.items.map((item) => (
              <Draggable key={item.id} draggableId={item.id} index={item.index}>
                {(provided) => (
                  <li className="board__listItem" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <NavLink className="issueLink" to={`/projects/${projectId}/${item.id}`}>
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
