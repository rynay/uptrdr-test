import moment from 'moment';
import './Comment.scss';
import classNames from 'classnames';

export const Comment = ({ comment, onSelect, onCancel }) => {
    const handleSelect = (el) => (event) => {
        event.stopPropagation();
        onSelect(el);
    }
    return (
        <div className="comment">
            <div className={classNames("comment__container", {
                "comment__container--withHover": !onCancel,
            })} onClick={handleSelect?.(comment)}>
                <div className="comment__info">
                    <p className="comment__text">{comment.text}</p>
                    <div className="comment__date">{moment(comment.created).fromNow()}</div>
                </div>
                {!onCancel && <span className="comment__reply">reply</span>}
                {onCancel && (
                    <button onClick={onCancel} className="comment__close">
                        <div />
                        <div />
                    </button>
                )}
            </div>
            {
                !onCancel && (
                    <div className="comment__children">
                        {comment.children.map(el => <Comment comment={el} onSelect={onSelect} />)}
                    </div>
                )
            }
        </div>
    )
}