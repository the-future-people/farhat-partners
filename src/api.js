// src/api.js
//
// Everything the portal asks Octos. A partner's session (from logging in
// with their number and password) is kept in this browser and sent with
// every request. Jobs go through the storefront's own steps, with the
// order's token, so a partner's job is priced, checked and paid exactly as
// any online order, at the trade price the server works out.

import axios from 'axios'

const KEY = 'farhat.partner.session'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://octos-production.up.railway.app',
})

export function savedToken() {
  try { return localStorage.getItem(KEY) || '' } catch { return '' }
}

export function saveToken(token) {
  try {
    if (token) localStorage.setItem(KEY, token)
    else localStorage.removeItem(KEY)
  } catch { /* a private window: logged in for this visit only */ }
  if (token) api.defaults.headers.common.Authorization = `App ${token}`
  else delete api.defaults.headers.common.Authorization
}

saveToken(savedToken())

// ── Account ────────────────────────────────────────────────────────
export const login = (phone, password) => api.post('/api/v1/partners/login/', { phone, password })
export const resetCode = phone => api.post('/api/v1/partners/password/code/', { phone })
export const resetPassword = (phone, code, password) => api.post('/api/v1/partners/password/reset/', { phone, code, password })
export const signOut = () => api.post('/api/v1/partners/signout/').catch(() => null)
export const partnerMe = () => api.get('/api/v1/partners/me/')

// ── Registration ───────────────────────────────────────────────────
export const partnersOpen = invite => api.get('/api/v1/partners/open/', { params: { invite } })
export const applyCode = (phone, invite) => api.post('/api/v1/partners/code/', { phone, invite })
export const apply = form => api.post('/api/v1/partners/apply/', form)

// ── Jobs ───────────────────────────────────────────────────────────
export const startPartnerOrder = reference => api.post('/api/v1/partners/orders/', { reference })
export const getCatalogue = () => api.get('/api/v1/storefront/catalogue/')
export const updateOrder = (number, token, changes) => api.patch(`/api/v1/storefront/orders/${number}/`, { token, ...changes })
export const getBranchOptions = (number, token) => api.get(`/api/v1/storefront/orders/${number}/branches/`, { params: { token } })
export const startPayment = (number, token, callbackUrl) =>
  api.post(`/api/v1/storefront/orders/${number}/pay/`, { token, callback_url: callbackUrl })
export const acceptWarning = (number, token, lineId) =>
  api.patch(`/api/v1/storefront/orders/${number}/file/`, { token, line_id: lineId, warning_accepted: true })
export const uploadFile = (number, token, file, lineId, onProgress) => {
  const form = new FormData()
  form.append('token', token)
  form.append('file', file)
  if (lineId) form.append('line_id', lineId)
  return api.post(`/api/v1/storefront/orders/${number}/file/`, form, {
    onUploadProgress: e => { if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100)) },
  })
}

// A readable message from any refusal the server sends.
export function problem(error, fallback = 'Something went wrong. Try again.') {
  const data = error?.response?.data
  if (typeof data?.detail === 'string') return data.detail
  if (!error?.response) return 'We couldn\'t reach Farhat. Check your connection and try again.'
  return fallback
}

export const money = value =>
  `GHS ${Number(value || 0).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
