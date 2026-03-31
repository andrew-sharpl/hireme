import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
})

/* 
Interceptor that runs before every request.
Reads the JWT from localStorage and attaches it to the Auth header
so that every API call is authenticated automatically. 
Similar concept to AuthContext, simplifying authentication.
*/
api.interceptors.request.use((config) => {
    const stored = localStorage.getItem('hireme_user')
    if (stored) {
        const { token } = JSON.parse(stored)
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api