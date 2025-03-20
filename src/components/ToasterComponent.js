/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { CToast, CToastHeader, CToastBody, CToastClose } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCheckCircle, faInfo, faQuestionCircle, faWarning, faX } from '@fortawesome/free-solid-svg-icons'

const templateToast = ( type, message ) => {
    const color = {
        success: '#29d93e',
        info: '#6799FF',
        warning: '#FFBB00',
        error: '#e85454',
        failed: '#e85454',
      }[type] || '#e85454'; // Default to error color if type is not found
      
      return (
        <CToast
          key={Date.now()}
          autohide={true}
          color={type.toLowerCase() === 'error' ? 'danger' : type.toLowerCase()} // Use the computed color instead of type
          delay={5000}
          visible={true}
        >
          <CToastBody className="d-flex align-items-center justify-content-between text-white" closeButton>
            <div className="d-flex align-items-center gap-3">
              <FontAwesomeIcon
                icon={
                  (type.toLowerCase() === 'danger' || type.toLowerCase() === 'error')
                    ? faWarning
                    : type.toLowerCase() === 'success'
                    ? faCheckCircle
                    : type.toLowerCase() === 'warning'
                    ? faWarning
                    : type.toLowerCase() === 'info'
                    ? faInfo
                    : faQuestionCircle
                }
                size="lg"
              />
              {message}
            </div>
            <div className="d-flex align-items-center gap-2">
              <div style={{ borderLeft: '2px solid white', height: '20px', width: '1px' }}></div>
              <CToastClose dark style={{ color: 'white', opacity: 1, boxShadow: 'none', fontSize: '10px' }} />
            </div>
          </CToastBody>
        </CToast>
      );
      
}

export default templateToast;