import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { selectIssue } from '../../redux/selectors';
import { addComment } from '../../redux/projects/actionCreators';
import { Comment } from './Comment';
import './Comment.scss';
import '../../styles/common.scss';

export const CommentSection = () => {
  const dispatch = useDispatch();
  const { projectId, issueId } = useParams();
  const issue = useSelector(selectIssue(projectId, issueId));
  const [inputValue, setInputValue] = useState('');
  const [parentComment, setParentComment] = useState(null);

  const handleInputValueChange = useCallback((event) => {
    setInputValue(event.target.value.trim());
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault()
    dispatch(addComment({
      projectId,
      issueId,
      comment: inputValue,
      parentCommentId: parentComment?.id,
    }))
    setInputValue('');
  }, [
    dispatch,
    inputValue,
    issueId,
    parentComment,
    projectId,
  ])

  const handleParentCommentReset = useCallback(() => {
    setParentComment(null);
  }, []);

  return (
    <>
      <div className="comments">
        {issue.comments.map(el => <Comment comment={el} onSelect={setParentComment} />)}
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
