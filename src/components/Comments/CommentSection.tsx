import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { selectIssue } from '../../redux/selectors';
import { addComment } from '../../redux/projects/actionCreators';
import { Comment as CommentType } from '../../types';
import { Comment } from './Comment';
import styles from './Comment.module.scss';

export const CommentSection = () => {
  const dispatch = useDispatch();
  const { projectId, issueId } = useParams();
  const issue = useSelector(selectIssue(projectId!, issueId!));
  const [inputValue, setInputValue] = useState('');
  const [parentComment, setParentComment] = useState<CommentType | null>(null);

  const handleInputValueChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value.trim());
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      if (!inputValue.trim()) return;
      dispatch(
        addComment({
          projectId: projectId!,
          issueId: issueId!,
          comment: inputValue.trim(),
          parentCommentId: parentComment?.id,
        })
      );
      setInputValue('');
      setParentComment(null);
    },
    [dispatch, inputValue, issueId, parentComment, projectId]
  );

  const handleParentCommentReset = useCallback(() => {
    setParentComment(null);
  }, []);

  return (
    <>
      <div className={styles.comments}>
        {issue?.comments.map((el) => <Comment comment={el} onSelectComment={(el) => setParentComment(el)} />)}
      </div>
      {parentComment && (
        <>
          <div className="horizontalLine" />
          <h2>Reply to:</h2>
          <Comment comment={parentComment} onCancel={handleParentCommentReset} />
        </>
      )}
      <form className="flexContainer" onSubmit={handleSubmit}>
        <input
          style={{ flex: 1 }}
          className="input"
          name="comment"
          placeholder="Have something to say?"
          value={inputValue}
          onChange={handleInputValueChange}
        />
        <button className="button">Submit</button>
      </form>
    </>
  );
};
