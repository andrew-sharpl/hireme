import { useState, type SyntheticEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { TextField, Button, Box, Typography, Alert } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    async function handleSubmit(e: SyntheticEvent) {
        // Prevents browser from doing a full page reload on submit
        e.preventDefault()
        setError('')
        try {
            // Sends POST request to API
            const response = await api.post('/auth/login', { email, password })
            login(response.data)
            navigate('/')
        } catch {
            setError('Invalid email or password.')
        }
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                maxWidth: 400,
                mx: 'auto',
                mt: 8,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Typography variant="h4" textAlign="center">Sign In</Typography>

            {error && <Alert severity="error">{error}</Alert>}

            <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <Button type="submit" variant="contained" size="large">
                Sign In
            </Button>

            <Typography textAlign="center">
                Don't have an account? <Link to="/register">Register</Link>
            </Typography>
        </Box>
    )
}
