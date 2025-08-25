const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchWithAuth = async (endpoint, options = {}) => {
    const token = localStorage.getItem('authToken');
    
    const defaultHeaders = {
        'Authorization': `Bearer ${token}`,
    };

    if (!(options.body instanceof FormData)) {
        defaultHeaders['Content-Type'] = 'application/json';
    }

    const headers = {
        ...defaultHeaders,
        ...options.headers,
    };

    if (headers['Content-Type'] === null) {
        delete headers['Content-Type'];
    }

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        throw new Error('Sesi tidak valid atau telah berakhir.');
    }
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Terjadi kesalahan pada server.');
    }
    if (response.status === 204) return;

    return response.json();
};