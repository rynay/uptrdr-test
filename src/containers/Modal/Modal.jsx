import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import './Modal.scss';
import { useCallback, useEffect } from 'react';

export const Modal = ({ children }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    const path = pathname.split('/');
    navigate(path.slice(0, -1).join('/') || '/');
  }, [navigate, pathname]);

  useEffect(() => {
    const handleEscape = (event) => event.key === 'Escape' && handleClose();

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [handleClose]);

  const handlePropagation = useCallback((event) => {
    event.stopPropagation();
  }, []);

  return createPortal(
    <div onClick={handleClose} className="modal__overlay">
      <div onClick={handlePropagation} className="modal__container">
        <button onClick={handleClose} className="modal__close">
          <div />
          <div />
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal')
  );
};
