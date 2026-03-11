import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const inventoryApi = {
    getInventory: (params?: any) => api.get('/api/inventory', { params }),
    getStats: () => api.get('/api/inventory/stats'),
    createMaterial: (data: any) => api.post('/api/inventory', data),
    createTransaction: (itemId: number, data: { action: 'add' | 'consume', quantity: number }) =>
        api.post(`/api/inventory/${itemId}/transaction`, data),
    deleteMaterial: (itemId: number) => api.delete(`/api/inventory/${itemId}`),
    exportCsv: () => api.get('/api/inventory/export', { responseType: 'blob' }),
};

export const devApi = {
    resetDatabase: () => api.post('/api/dev/reset-db'),
};

export const activityApi = {
    getActivities: () => api.get('/api/activity'),
};

export const projectApi = {
    getProjects: () => api.get('/api/projects'),
};

export const notificationApi = {
    getNotifications: () => api.get('/api/notifications'),
};

export const ordersApi = {
    expedite: () => api.post('/api/orders/expedite'),
    getSchedule: (itemId: number) => api.get(`/api/schedule/${itemId}`),
};

export const interactionApi = {
    logInteraction: (data: any) => api.post('/api/log-interaction', data),
};

export default api;
