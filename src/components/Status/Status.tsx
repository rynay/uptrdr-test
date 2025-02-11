import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import styles from './Status.module.scss';

type Props = DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;

export const Status: FC<Props> = ({ children }) => {
  return <p className={styles.status}>{children}</p>;
};
