const host = window.location.hostname || "localhost";
const defaultBaseUrl = `http://${host}:8080`;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || defaultBaseUrl;

export const apiUrl = (path: string) => `${API_BASE_URL}${path}`;
