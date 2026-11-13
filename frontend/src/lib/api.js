// Verity Frontend API client

const BASE_URL = '/api';

export async function initSession() {
  const res = await fetch(`${BASE_URL}/session`, { credentials: 'include', method: 'POST' });
  return await res.json();
}

export async function resetDemo() {
  const res = await fetch(`${BASE_URL}/demo/reset`, { credentials: 'include', method: 'POST' });
  return await res.json();
}

export async function getBrandProfile() {
  const res = await fetch(`${BASE_URL}/brand`, { credentials: 'include' });
  return await res.json();
}

export async function updateBrandProfile(data) {
  const res = await fetch(`${BASE_URL}/brand`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function addBrandFact(fact) {
  const res = await fetch(`${BASE_URL}/brand/facts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(fact)
  });
  return await res.json();
}

export async function uploadBrandSource(file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${BASE_URL}/brand/sources`, {
    method: 'POST',
    credentials: 'include',
    body: formData
  });
  return await res.json();
}

export async function createSubmission(payload) {
  const res = await fetch(`${BASE_URL}/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Failed to create submission');
  }
  return await res.json();
}

export async function uploadSubmissionDocument(formData) {
  const res = await fetch(`${BASE_URL}/submissions/upload`, {
    method: 'POST',
    credentials: 'include',
    body: formData
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Failed to upload document');
  }
  return await res.json();
}

export async function getSubmissions() {
  const res = await fetch(`${BASE_URL}/submissions`, { credentials: 'include' });
  return await res.json();
}

export async function getSubmissionDetail(id) {
  const res = await fetch(`${BASE_URL}/submissions/${id}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Submission not found');
  return await res.json();
}

export async function createNewVersion(submissionId, payload) {
  const res = await fetch(`${BASE_URL}/submissions/${submissionId}/versions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Failed to save version');
  }
  return await res.json();
}

export async function computeDiff(original, revised) {
  const res = await fetch(`${BASE_URL}/submissions/diff`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ original, revised })
  });
  return await res.json();
}

export async function updateFindingStatus(findingId, payload) {
  const res = await fetch(`${BASE_URL}/findings/${findingId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  });
  return await res.json();
}

export async function submitReviewDecision(submissionId, payload) {
  const res = await fetch(`${BASE_URL}/submissions/${submissionId}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Review submission failed');
  }
  return await res.json();
}

export async function addComment(submissionId, payload) {
  const res = await fetch(`${BASE_URL}/submissions/${submissionId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  });
  return await res.json();
}

export async function getInsights() {
  const res = await fetch(`${BASE_URL}/insights`, { credentials: 'include' });
  return await res.json();
}

export async function getAuditTrail() {
  const res = await fetch(`${BASE_URL}/audit`, { credentials: 'include' });
  return await res.json();
}

export async function getAIStatus() {
  const res = await fetch(`${BASE_URL}/ai/status`);
  return await res.json();
}

