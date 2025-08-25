import React from 'react';

const Meta = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    return (
        <>
            <title>Sambal Teman Makan Ku - Ledakan Rasa di Setiap Cocolan</title>
            <meta name="description" content="Rasakan sensasi pedas otentik dari Sambal Teman Makan Ku, dibuat dengan resep warisan nusantara." />
            <meta httpEquiv="Content-Security-Policy" content={`
                default-src 'self';
                script-src 'self' 'unsafe-inline';
                style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
                img-src 'self' data: ${backendUrl};
                font-src 'self' https://fonts.gstatic.com;
                connect-src 'self' ${backendUrl};
                frame-src https://www.google.com;`} />

            {/* Header Keamanan Lainnya */}
            <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
            {/* <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" /> */}
            <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        </>
    );
};

export default Meta;