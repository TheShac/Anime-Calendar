import { API_URL } from "../../../../lib/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export async function getActiveSeason() {
  const response = await fetch(`${API_URL}/admin/seasons`, {
    headers: getHeaders(),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  const seasons = result.data;
  return seasons.find((s) => s.isActive) ?? seasons[0];
}

export async function getCalendarEntries() {
  const response = await fetch(`${API_URL}/admin/calendar/admin`, {
    headers: getHeaders(),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return Array.isArray(result.data) ? result.data : [];
}

export async function createCalendarEntry(data) {
  const response = await fetch(`${API_URL}/admin/calendar/admin`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.data;
}

export async function updateCalendarEntry(id, data) {
  const response = await fetch(`${API_URL}/admin/calendar/admin/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.data;
}