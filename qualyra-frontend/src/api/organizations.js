import api from './axios'

export const getMyOrg = () => api.get('/organizations/me')
export const updateMyOrg = (data) => api.put('/organizations/me', data)
