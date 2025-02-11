import { ChangeEvent, FC, FormEvent, useCallback, useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIssueBoards } from '../../redux/selectors';
import { debounce } from '../../helpers/utils';
import { IssueBoard } from '../../types';
import styles from './Filter.module.scss';

const formatted = (str: string) => str.toLowerCase().replace(/\s+/g, ' ').split(' ');

type Props = {
  setFilteredData: (items: IssueBoard[] | null) => void;
}

export const Filter: FC<Props> = ({ setFilteredData }) => {
  const [filter, setFilter] = useState('');
  const { projectId } = useParams();
  const issueBoards = useSelector(selectIssueBoards(projectId!));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };
  const filterData = useCallback((filter: string, data: IssueBoard[]) => {
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
    <form className={styles.filterContainer} onSubmit={handleSubmit}>
      <div className="flexContainer">
        <input className="input" id="search" type="search" value={filter} onChange={handleChange} />
        <button className="button">Search</button>
      </div>
    </form>
  );
};
