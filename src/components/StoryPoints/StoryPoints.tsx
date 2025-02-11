import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import styles from './StoryPoints.module.scss';

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const StoryPoints: FC<Props> = ({ children, ...props }) => {
  return (
    <div className={styles.storyPoints} {...props}>
      {children}
    </div>
  );
};
