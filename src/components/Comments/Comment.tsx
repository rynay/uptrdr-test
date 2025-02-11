import { DetailedHTMLProps, FC, HTMLAttributes, MouseEvent, useCallback } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { Comment as CommentType } from '../../types';
import styles from './Comment.module.scss';

type Props = {
    comment: CommentType,
    onSelectComment?: (el: CommentType) => void,
    onCancel?: VoidFunction,
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export const Comment: FC<Props> = ({
    comment,
    onSelectComment,
    onCancel,
    ...props
}) => {

    const handleSelect = useCallback((el: CommentType) => (event: MouseEvent) => {
        event.stopPropagation();
        onSelectComment?.(el);
    }, [onSelectComment]);

    return (
        <div className={styles.comment} {...props}>
            <div className={classNames(styles.comment__container, {
                [styles.comment__container_withHover]: !onCancel,
            })} onClick={handleSelect?.(comment)}>
                <div className={styles.comment__info}>
                    <p className={styles.comment__text}>{comment.text}</p>
                    <div className={styles.comment__date}>{moment(comment.created).fromNow()}</div>
                </div>
                {!onCancel && <span className={styles.comment__reply}>reply</span>}
                {onCancel && (
                    <button onClick={onCancel} className={styles.comment__close}>
                        <div />
                        <div />
                    </button>
                )}
            </div>
            {
                !onCancel && (
                    <div className={styles.comment__children}>
                        {comment.children.map(el => <Comment comment={el} onSelectComment={onSelectComment} />)}
                    </div>
                )
            }
        </div>
    )
}