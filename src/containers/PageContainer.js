import { BreadCrumbs } from '../components/BreadCrumbs/BreadCrumbs';
import '../styles/common.scss';

export const PageContainer = ({ children }) => {
  return (
    <div className="page">
      <BreadCrumbs />
      {children}
    </div>
  );
};
