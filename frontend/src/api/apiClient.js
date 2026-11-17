const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const ML_BASE_URL = import.meta.env.VITE_ML_BASE_URL || 'http://localhost:5001/api';

export async function apiFetch(path, options = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.message || `API Error (${response.status})`);
  }
  return payload;
}

export async function mlPredictFetch(transactions) {
  const response = await fetch(`${ML_BASE_URL}/predict-expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transactions })
  });
  return response.json();
}
