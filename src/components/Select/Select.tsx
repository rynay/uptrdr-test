import React, { useState, useRef, FC, ReactNode } from 'react';
import classNames from 'classnames';
import { SelectContext } from './selectContext';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import styles from './Select.module.scss';
import { FormikErrors } from 'formik';

type Props = {
  name: string;
  value: string;
  placeholder: string;
  onChange: (field: string, value: any) => Promise<void> | Promise<FormikErrors<any>>;
  children: ReactNode;
};

export const Select: FC<Props> = ({ name, children, value, placeholder, onChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const showDropdownHandler = () => setShowDropdown(!showDropdown);
  const selectContainerRef = useRef(null);

  const clickOutsideHandler = () => setShowDropdown(false);

  useOnClickOutside(selectContainerRef, clickOutsideHandler);

  const updateSelectedOption = (option: string) => {
    onChange(name, option);
    setShowDropdown(false);
  };

  return (
    <SelectContext.Provider value={{ selectedOption: value, changeSelectedOption: updateSelectedOption }}>
      <div className={styles.select} ref={selectContainerRef}>
        <div
          onClick={showDropdownHandler}
          className={classNames(styles.select__text, {
            [styles.select__text_active]: showDropdown,
          })}
        >
          {placeholder || value}
        </div>
        <ul
          className={classNames(styles.select__options, {
            [styles.select__options_show]: showDropdown,
            [styles.select__options_hide]: !showDropdown,
          })}
        >
          {children}
        </ul>
      </div>
    </SelectContext.Provider>
  );
};
