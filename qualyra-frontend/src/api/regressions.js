import api from './axios'

export const getRegressions = (params) => api.get('/regressions', { params })
export const getRegression = (id) => api.get(`/regressions/${id}`)
export const createRegression = (data) => api.post('/regressions', data)
export const executeItem = (id, itemId, data) => api.patch(`/regressions/${id}/items/${itemId}`, data)
export const completeRegression = (id) => api.patch(`/regressions/${id}/complete`)
