import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { AuthProvider } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import JobListPage from './pages/JobListPage'
import JobDetailPage from './pages/JobDetailPage'
import CreateJobPage from './pages/CreateJobPage'
import EditJobPage from './pages/EditJobPage'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#e6b65e',
        },
        secondary: {
            main: '#9caf30',
        },
        background: {
            default: '#f0f4f8',
            paper: '#ffffff',
        },
    },
})

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/" element={<ProtectedRoute><JobListPage /></ProtectedRoute>} />
                        <Route path="/jobs/create" element={<ProtectedRoute><CreateJobPage /></ProtectedRoute>} />
                        <Route path="/jobs/:id" element={<ProtectedRoute><JobDetailPage /></ProtectedRoute>} />
                        <Route path="/jobs/:id/edit" element={<ProtectedRoute><EditJobPage /></ProtectedRoute>} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    )
}
