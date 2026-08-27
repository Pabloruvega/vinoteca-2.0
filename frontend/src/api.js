import axios from 'axios'


const api = axios.create({ baseURL: 'http://localhost:5000/api' })

// Interceptor: adjunta el token JWT a cada request automáticamente
api.interceptors.request.use((config) => {
    const userVinoteca = JSON.parse(localStorage.getItem('userVinoteca'))
    const token = userVinoteca?.token
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

export default api
