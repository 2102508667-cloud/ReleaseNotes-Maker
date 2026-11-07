const BASE_URL = '/api/changes';

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.message || errorData.error || `Request failed with status ${response.status}`;
    throw new Error(message);
  }
  const json = await response.json();
  // Backend wraps all responses in { success, data, ... } — unwrap automatically
  return json.data !== undefined ? json.data : json;
}

export async function fetchChanges(filters = {}) {
  const params = new URLSearchParams();
  if (filters.type) params.append('type', filters.type);
  if (filters.version) params.append('version', filters.version);
  if (filters.status) params.append('status', filters.status);
  if (filters.search) params.append('search', filters.search);

  const query = params.toString();
  const url = query ? `${BASE_URL}?${query}` : BASE_URL;
  const response = await fetch(url);
  return handleResponse(response);
}

export async function fetchVersions() {
  const response = await fetch(`${BASE_URL}/versions`);
  return handleResponse(response);
}

export async function fetchChangeById(id) {
  const response = await fetch(`${BASE_URL}/${id}`);
  return handleResponse(response);
}

export async function createChange(data) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function updateChange(id, data) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function deleteChange(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}

export async function generateReleaseNotes(version, ids) {
  const response = await fetch(`${BASE_URL}/generate-notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ version, ids }),
  });
  return handleResponse(response);
}

