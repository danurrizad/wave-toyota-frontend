/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { createContext, useContext, useState, useRef } from 'react';
import { CToaster, CToast, CToastHeader, CToastBody } from '@coreui/react';

// Create context
const ToastContext = createContext();

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const toaster = useRef();

  // Function to create a toast
  const templateToast = (type, msg) => (
    <CToast autohide={true}>
      <CToastHeader closeButton>
        <svg
          className="rounded me-2 bg-black"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
        >
          <rect
            width="100%"
            height="100%"
            fill={`${type === 'Error' ? '#e85454' : '#29d93e'}`}
          ></rect>
        </svg>
        <div className="fw-bold me-auto">{type}</div>
      </CToastHeader>
      <CToastBody>{msg}</CToastBody>
    </CToast>
  );

  // Function to add a toast
  const addToast = (type, msg) => {
    setToasts([...toasts, templateToast(type, msg)]);
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <CToaster ref={toaster} push={toasts} placement="top-end" />
    </ToastContext.Provider>
  );
};

// Hook to use the Toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
