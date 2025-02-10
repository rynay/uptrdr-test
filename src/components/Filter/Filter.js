import { useCallback, useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { debounce } from '../../helpers/utils';
import '../../styles/common.scss';
import './Filter.scss';
import { selectIssueBoards } from '../../redux/selectors';

const formatted = (string) => string.toLowerCase().replace(/\s+/g, ' ').split(' ');

export const Filter = ({ setFilteredData }) => {
  const [filter, setFilter] = useState('');
  const { projectId } = useParams();
  const issueBoards = useSelector(selectIssueBoards(projectId));

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleChange = (event) => {
    setFilter(event.target.value);
  };
  const filterData = useCallback((filter, data) => {
    if (data && filter) {
      setFilteredData(
        data.map((board) => ({
          ...board,
          items: board.items.filter((issue) =>
            formatted(filter).every((searchWord) => formatted(issue.title).some((word) => word.includes(searchWord)))
            || filter.trim() === issue.id
        ),
        }))
      );
    } else {
      setFilteredData(null);
    }
  }, [setFilteredData]);

  const filterDataWithDebounce = useCallback(debounce(filterData), []);

  useLayoutEffect(() => {
    filterDataWithDebounce(filter, issueBoards);
  }, [filter, filterDataWithDebounce, issueBoards]);

  useLayoutEffect(() => {
    filterData(filter, issueBoards);
  }, [issueBoards, filter, filterData]);

  return (
    <form className="filterContainer" onSubmit={handleSubmit}>
      <div className="flexContainer">
        <input className="input" id="search" type="search" value={filter} onChange={handleChange} label="search" />
        <button className="button">Search</button>
      </div>
    </form>
  );
};
