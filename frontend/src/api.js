import axios from 'axios'

// Fix #8: baseURL centralizada. AdminPanel.jsx y todos los componentes
// deben usar este cliente en lugar de fetch() directo a localhost:5000.
// Si cambia el puerto o host, solo hay que tocarlo acá.
const api = axios.create({ baseURL: 'http://localhost:5000/api' })

// Interceptor: adjunta el token JWT a cada request automáticamente
api.interceptors.request.use((config) => {
    const userVinoteca = JSON.parse(localStorage.getItem('userVinoteca'))
    const token = userVinoteca?.token
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

export default api
