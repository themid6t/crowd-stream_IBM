import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import PlayerPage from './pages/PlayerPage'
import UploadPage from './pages/UploadPage'
import AuthPage from './pages/AuthPage'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-dark-darker">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/player/:id" element={<PlayerPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route 
              path="/upload" 
              element={
                // <ProtectedRoute>
                  <UploadPage />
                // </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App