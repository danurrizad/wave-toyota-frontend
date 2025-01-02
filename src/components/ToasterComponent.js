/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { CToast, CToastHeader, CToastBody } from '@coreui/react';

const templateToast = ( type, message ) => {
    return (
        <CToast autohide={true} delay={5000} key={Date.now()}>
            <CToastHeader closeButton>
                <svg
                className="rounded me-2"
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
                    // fill={type === 'Error' ? '#e85454' : '#29d93e'}
                    fill={type === 'Success' ? '#29d93e' : '#e85454'}
                />
                </svg>
                <strong className="me-auto">{type}</strong>
            </CToastHeader>
            <CToastBody>{message}</CToastBody>
        </CToast>
    );
}

export default templateToast;