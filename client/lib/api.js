const BASE_URL = "http://localhost:5000";

export const api = {
  get: async (url) => {
    const res = await fetch(`${BASE_URL}${url}`);
    return res.json();
  },

  post: async (url, body) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return res.json();
  },

  put: async (url, body) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return res.json();
  },

  delete: async (url) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: "DELETE",
    });
    return res.json();
  },
};