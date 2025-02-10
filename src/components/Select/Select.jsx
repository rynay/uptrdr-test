import React, { useState, useRef } from 'react';
import { SelectContext } from './selectContext';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import classNames from 'classnames';
import './Select.scss';

export const Select = ({ name, children, value, placeholder, onChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const showDropdownHandler = () => setShowDropdown(!showDropdown);
  const selectContainerRef = useRef(null);

  const clickOutsideHandler = () => setShowDropdown(false);

  useOnClickOutside(selectContainerRef, clickOutsideHandler);

  const updateSelectedOption = (option) => {
    onChange(name, option);
    setShowDropdown(false);
  };

  return (
    <SelectContext.Provider value={{ selectedOption: value, changeSelectedOption: updateSelectedOption }}>
      <div className="select" ref={selectContainerRef}>
        <div
          onClick={showDropdownHandler}
          className={classNames('select__text', { 'select__text--active': showDropdown })}
        >
          {placeholder || value}
        </div>
        <ul
          className={classNames('select__options', {
            'select__options--show': showDropdown,
            'select__options--hide': !showDropdown,
          })}
        >
          {children}
        </ul>
      </div>
    </SelectContext.Provider>
  );
};
