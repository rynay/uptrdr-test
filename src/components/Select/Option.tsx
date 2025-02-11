import { DetailedHTMLProps, FC, LiHTMLAttributes } from 'react';
import { useSelectContext } from './selectContext';
import styles from './Select.module.scss';

type Props = {
  value: string,
} & DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>

export const Option: FC<Props> = ({ children, value }) => {
  const { changeSelectedOption } = useSelectContext();

  return (
    <li className={styles.select__option} onClick={() => changeSelectedOption(value)}>
      {children}
    </li>
  );
};
