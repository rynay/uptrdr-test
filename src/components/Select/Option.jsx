import React from 'react';
import { useSelectContext } from './selectContext';
import './Select.scss';

export const Option = ({ children, value }) => {
  const { changeSelectedOption } = useSelectContext();

  return (
    <li className="select__option" onClick={() => changeSelectedOption(value)}>
      {children}
    </li>
  );
};
