const API_URL = import.meta.env.VITE_API_URL || 'https://bawal-api.onrender.com/api';

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'API Error');
  }
  return data.data; // Return the actual payload from ApiResponse
};

export const dashboardApi = {
  getStats: () => fetch(`${API_URL}/dashboard`).then(handleResponse),
};

export const productsApi = {
  getAll: () => fetch(`${API_URL}/products`).then(handleResponse),
  getById: (id) => fetch(`${API_URL}/products/${id}`).then(handleResponse),
  create: (data) => fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
  update: (id, data) => fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
  delete: (id) => fetch(`${API_URL}/products/${id}`, { method: 'DELETE' }).then(handleResponse),
};

export const variantsApi = {
  create: (data) => fetch(`${API_URL}/variants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
};

export const inventoryApi = {
  stockIn: (data) => fetch(`${API_URL}/inventory/stock-in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
  stockOut: (data) => fetch(`${API_URL}/inventory/stock-out`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
  getMovements: () => fetch(`${API_URL}/inventory/movements`).then(handleResponse),
};

export const ordersApi = {
  getAll: () => fetch(`${API_URL}/orders`).then(handleResponse),
  updateStatus: (id, status) => fetch(`${API_URL}/orders/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  }).then(handleResponse),
};
