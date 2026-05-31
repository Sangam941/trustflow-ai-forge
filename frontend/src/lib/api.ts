const API_URL = "http://localhost:4000/api";

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "An error occurred");
  }

  return response.json();
}

export const api = {
  get: (endpoint: string, options?: RequestInit) => fetchApi(endpoint, { ...options, method: "GET" }),
  post: (endpoint: string, body: any, options?: RequestInit) =>
    fetchApi(endpoint, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: (endpoint: string, body: any, options?: RequestInit) =>
    fetchApi(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) }),
  patch: (endpoint: string, body: any, options?: RequestInit) =>
    fetchApi(endpoint, { ...options, method: "PATCH", body: JSON.stringify(body) }),
  delete: (endpoint: string, options?: RequestInit) => fetchApi(endpoint, { ...options, method: "DELETE" }),
};
