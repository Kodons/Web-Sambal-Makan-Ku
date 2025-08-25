import React from 'react';

const Meta = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    return (
        <>
            <title>Admin Panel - Sambal Makan Ku</title>
            <meta httpEquiv="Content-Security-Policy" content={`
                default-src 'self';
                script-src 'self' 'unsafe-inline';
                style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
                img-src 'self' data: blob: ${backendUrl};
                font-src 'self' https://fonts.gstatic.com;
                connect-src 'self' ${backendUrl};
            `} />
            <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
            {/* <meta httpEquiv="X-Frame-Options" content="DENY" /> */}
            <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        </>
    );
};

export default Meta;