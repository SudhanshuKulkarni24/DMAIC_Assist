import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts'

// Dark Mode Hook
function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  const toggleDark = () => {
    const newValue = !isDark
    setIsDark(newValue)
    localStorage.setItem('darkMode', JSON.stringify(newValue))
  }

  return { isDark, toggleDark }
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  
  if (!token) {
    return <Navigate to="/" replace />
  }
  
  return children
}

// Login Component
function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { isDark, toggleDark } = useDarkMode()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/dashboard', { replace: true })
      } else {
        setError(data.message || 'Login failed. Please try again.')
      }
    } catch (error) {
      setError('Network error. Please check if the backend is running.')
    } finally {
      setIsLoading(false)
    }
  }

  const bgClass = isDark ? 'bg-gray-900' : 'bg-gray-100'
  const cardClass = isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
  const inputClass = isDark 
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
    : 'bg-white border-gray-300 text-gray-900'

  return (
    <div className={`min-h-screen flex items-center justify-center ${bgClass}`}>
      <div className={`p-8 rounded-lg shadow-md w-96 ${cardClass}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">DMAIC Assistant</h2>
          <button
            onClick={toggleDark}
            className="p-2 rounded-md transition-colors bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"
            title="Toggle Dark Mode"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Email
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Password
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
              placeholder="Enter your password"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="mt-6 p-4 rounded border bg-gray-50 border-gray-200">
          <h3 className="font-medium mb-2 text-gray-900">Demo Accounts:</h3>
          <div className="text-sm space-y-1 text-gray-700">
            <p><strong>Admin:</strong> admin@dmaic.com / admin123</p>
            <p><strong>Consultant:</strong> consultant@dmaic.com / consultant123</p>
            <p><strong>Manager:</strong> manager@dmaic.com / manager123</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Dashboard Component
function Dashboard() {
  const [csvData, setCsvData] = useState([])
  const [analysis, setAnalysis] = useState(null)
  const [activeTab, setActiveTab] = useState('upload')
  const [user, setUser] = useState(null)
  const { isDark, toggleDark } = useDarkMode()
  const navigate = useNavigate()

  React.useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token) {
      navigate('/', { replace: true })
      return
    }
    
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [navigate])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/', { replace: true })
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'text/csv') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target.result
        const lines = text.split('\n')
        const headers = lines[0].split(',')
        const data = lines.slice(1).filter(line => line.trim()).map(line => {
          const values = line.split(',')
          const row = {}
          headers.forEach((header, index) => {
            row[header.trim()] = values[index]?.trim() || ''
          })
          return row
        })
        setCsvData(data)
        generateAnalysis(data)
      }
      reader.readAsText(file)
    }
  }

  const generateAnalysis = (data) => {
    if (data.length === 0) return
    
    const stats = {
      dataCount: data.length,
      columnCount: Object.keys(data[0]).length,
      sampleData: data.slice(0, 5)
    }
    
    setAnalysis(stats)
  }

  const tabs = [
    { id: 'upload', name: 'Data Upload', icon: '📊' },
    { id: 'define', name: 'Define', icon: '🎯' },
    { id: 'measure', name: 'Measure', icon: '📏' },
    { id: 'analyze', name: 'Analyze', icon: '🔍' },
    { id: 'improve', name: 'Improve', icon: '⚡' },
    { id: 'control', name: 'Control', icon: '🎛️' }
  ]

  const bgClass = isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
  const headerClass = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
  const cardClass = isDark ? 'bg-gray-800' : 'bg-white'

  return (
    <div className={`min-h-screen ${bgClass}`}>
      {/* Header */}
      <div className={`shadow-sm border-b ${headerClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">DMAIC Assistant</h1>
              {user && (
                <span className="ml-4 text-gray-600">Welcome, {user.first_name}!</span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDark}
                className={`p-2 rounded-md transition-colors ${
                  isDark 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <button 
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={`border-b ${headerClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : isDark
                      ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'upload' && (
          <div className={`rounded-lg shadow p-6 ${cardClass}`}>
            <h2 className="text-xl font-semibold mb-4">📊 Data Upload & Analysis</h2>
            
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Upload CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className={`block w-full text-sm border rounded-lg cursor-pointer focus:outline-none ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-gray-400 file:bg-gray-600 file:text-white' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 file:bg-gray-100 file:text-gray-700'
                } file:border-0 file:py-2 file:px-4 file:rounded-lg file:font-medium`}
              />
            </div>

            {analysis && (
              <div className="space-y-6">
                <div className={`p-4 rounded border ${
                  isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <h3 className="font-medium mb-2">📈 Data Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p>Total Records: {analysis.dataCount}</p>
                      <p>Total Columns: {analysis.columnCount}</p>
                    </div>
                  </div>
                </div>

                {analysis.sampleData && (
                  <div className={`rounded-lg shadow p-6 ${cardClass}`}>
                    <h3 className="text-lg font-semibold mb-4">📋 Sample Data</h3>
                    <div className="overflow-x-auto">
                      <table className={`min-w-full divide-y ${
                        isDark ? 'divide-gray-700' : 'divide-gray-200'
                      }`}>
                        <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                          <tr>
                            {Object.keys(analysis.sampleData[0] || {}).map((col) => (
                              <th key={col} className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                isDark ? 'text-gray-300' : 'text-gray-500'
                              }`}>
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${
                          isDark ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'
                        }`}>
                          {analysis.sampleData.map((row, index) => (
                            <tr key={index}>
                              {Object.values(row).map((value, i) => (
                                <td key={i} className={`px-6 py-4 whitespace-nowrap text-sm ${
                                  isDark ? 'text-gray-300' : 'text-gray-500'
                                }`}>
                                  {value}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Other DMAIC Phase tabs */}
        {activeTab !== 'upload' && (
          <div className={`rounded-lg shadow p-6 ${cardClass}`}>
            <h2 className="text-xl font-semibold mb-4">
              {tabs.find(t => t.id === activeTab)?.icon} {tabs.find(t => t.id === activeTab)?.name} Phase
            </h2>
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              This phase is under development. Stay tuned for advanced DMAIC analysis features!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Main App Component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  )
}

export default App