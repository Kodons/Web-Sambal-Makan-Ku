const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const fetchWithAuth = async (endpoint, options = {}) => {
    const token = localStorage.getItem('authToken');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        'Authorization': `Bearer ${token}`,
    };

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