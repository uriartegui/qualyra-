import api from './axios'

export const getRulesByTopic = (topicId, params) => api.get(`/topics/${topicId}/rules`, { params })
export const getAllRules = () => api.get('/rules')
export const createRule = (topicId, data) => api.post(`/topics/${topicId}/rules`, data)
export const updateRule = (id, data) => api.put(`/rules/${id}`, data)
export const deleteRule = (id) => api.delete(`/rules/${id}`)
