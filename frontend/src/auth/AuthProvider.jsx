import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const userJson = localStorage.getItem('userVinoteca')
        if (userJson) setUser(JSON.parse(userJson))
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        const res = await api.post('/users/login', { email, password })
        localStorage.setItem('userVinoteca', JSON.stringify(res.data))
        setUser(res.data)
        return res.data
    }

    // Fix #3: función de registro público.
    // El backend asigna isAdmin: false siempre en este endpoint.
    const registro = async (nombre, email, password) => {
        const res = await api.post('/users/registro', { nombre, email, password })
        localStorage.setItem('userVinoteca', JSON.stringify(res.data))
        setUser(res.data)
        return res.data
    }

    const logout = () => {
        localStorage.removeItem('userVinoteca')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, registro, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
