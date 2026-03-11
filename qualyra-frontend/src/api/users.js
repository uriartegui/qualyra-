import api from './axios'

export const getMe = () => api.get('/users/me')
export const updateMe = (data) => api.put('/users/me', data)
export const getUsers = (params) => api.get('/users', { params })
export const createUser = (data) => api.post('/users', data)
export const deactivateUser = (id) => api.patch(`/users/${id}/deactivate`)
