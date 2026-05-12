import { API_URL } from "../../../../lib/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export async function getSeasons() {
  const response = await fetch(`${API_URL}/admin/seasons`, {
    headers: getHeaders(),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.data;
}

export async function createSeason(data) {
  const response = await fetch(`${API_URL}/admin/seasons`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.data;
}

export async function updateSeason(id, data) {
  const response = await fetch(`${API_URL}/admin/seasons/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.data;
}

export async function deleteSeason(id) {
  const response = await fetch(`${API_URL}/admin/seasons/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.data;
}

export async function activateSeason(id) {
  const response = await fetch(`${API_URL}/admin/seasons/${id}/activate`, {
    method: "PATCH",
    headers: getHeaders(),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.data;
}