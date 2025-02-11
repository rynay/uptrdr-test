import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { DetailedHTMLProps, FC, HTMLAttributes, MouseEvent, useCallback, useEffect } from 'react';
import styles from './Modal.module.scss';

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export const Modal: FC<Props> = ({ children, ...props }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    const path = pathname.split('/');
    navigate(path.slice(0, -1).join('/') || '/');
  }, [navigate, pathname]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => event.key === 'Escape' && handleClose();

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [handleClose]);

  const handlePropagation = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  }, []);

  return createPortal(
    <div onClick={handleClose} className={styles.modal__overlay} {...props}>
      <div onClick={handlePropagation} className={styles.modal__container}>
        <button onClick={handleClose} className={styles.modal__close}>
          <div />
          <div />
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal')!
  );
};
