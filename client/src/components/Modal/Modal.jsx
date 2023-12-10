/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ showModal, handleClose, children }) => {
  if (!showModal) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {children}
        <button className='normal' onClick={handleClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
