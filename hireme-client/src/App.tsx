import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import JobListPage from './pages/JobListPage'
import JobDetailPage from './pages/JobDetailPage'
import CreateJobPage from './pages/CreateJobPage'
import EditJobPage from './pages/EditJobPage'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'


export default function App() {
  return (
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
  )
}