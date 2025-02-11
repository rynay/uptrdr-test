import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import { BreadCrumbs } from '../components/BreadCrumbs/BreadCrumbs';

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export const PageContainer: FC<Props> = ({ children, ...props }) => {
  return (
    <div className="page" {...props}>
      <BreadCrumbs />
      {children}
    </div>
  );
};
