import { API_URL } from "../../../../lib/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export async function getAnimes() {
  const response = await fetch(`${API_URL}/admin/animes`, { headers: getHeaders() });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.data;
}

export async function createAnime(data) {
  const response = await fetch(`${API_URL}/admin/animes`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.data;
}

export async function updateAnime(id, data) {
  const response = await fetch(`${API_URL}/admin/animes/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.data;
}

export async function deleteAnime(id) {
  const response = await fetch(`${API_URL}/admin/animes/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.data;
}