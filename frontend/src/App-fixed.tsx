import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ScatterChart, Scatter, ResponsiveContainer, ComposedChart } from 'recharts'

// Dark Mode Context (simplified)
const DarkModeContext = React.createContext({
  isDark: false,
  toggleDark: () => {}
})

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token')
  const location = useLocation()
  
  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />
  }
  
  return <>{children}</>
}

// Login Component
function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const darkMode = React.useContext(DarkModeContext)
  
  const from = (location.state as any)?.from?.pathname || '/dashboard'

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  const handleLogin = async (e: React.FormEvent) => {
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
        navigate(from, { replace: true })
      } else {
        setError(data.message || 'Login failed. Please try again.')
      }
    } catch (error) {
      setError('Network error. Please check if the backend is running.')
    } finally {
      setIsLoading(false)
    }
  }

  const bgClass = darkMode.isDark ? 'bg-gray-900' : 'bg-gray-100'
  const cardClass = darkMode.isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
  const inputClass = darkMode.isDark 
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
    : 'bg-white border-gray-300 text-gray-900'

  return (
    <div className={`min-h-screen flex items-center justify-center ${bgClass}`}>
      <div className={`p-8 rounded-lg shadow-md w-96 ${cardClass}`}>
        <h2 className="text-2xl font-bold mb-6 text-center">
          DMAIC Assistant Login
        </h2>
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

// Dashboard Component with simplified analysis
function Dashboard() {
  const [csvData, setCsvData] = useState<any[]>([])
  const [analysis, setAnalysis] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('upload')
  const [user, setUser] = useState<any>(null)
  const darkMode = React.useContext(DarkModeContext)
  const navigate = useNavigate()

  useEffect(() => {
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

  const detectColumnRoles = (data: any[], numericCols: string[], categoricalCols: string[]) => {
    const roles: any = {}
    const sampleSize = Math.min(10, data.length)
    const sampleData = data.slice(0, sampleSize)
    
    Object.keys(data[0] || {}).forEach(col => {
      const values = sampleData.map(row => row[col]).filter(val => val != null && val !== '')
      if (values.length === 0) {
        roles[col] = 'Empty'
        return
      }
      
      const isDate = values.every(val => {
        const datePatterns = [
          /^\d{4}-\d{2}-\d{2}$/,
          /^\d{1,2}\/\d{1,2}\/\d{4}$/,
          /^\d{4}\/\d{2}\/\d{2}$/,
        ]
        return datePatterns.some(pattern => pattern.test(val)) || !isNaN(Date.parse(val))
      })
      
      if (isDate) {
        roles[col] = 'Date/Time'
        return
      }
      
      const numericValues = values.map(val => parseFloat(val)).filter(val => !isNaN(val))
      const isNumeric = numericValues.length === values.length && numericValues.length > 0
      
      if (isNumeric) {
        const variance = numericValues.length > 1 ? 
          numericValues.reduce((sum, val) => {
            const mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length
            return sum + Math.pow(val - mean, 2)
          }, 0) / (numericValues.length - 1) : 0
        
        const cv = Math.sqrt(variance) / (numericValues.reduce((a, b) => a + b, 0) / numericValues.length) * 100
        
        const qualityKeywords = ['defect', 'error', 'fail', 'quality', 'satisfaction', 'yield', 'dimension', 'time']
        const isLikelyOutput = qualityKeywords.some(keyword => 
          col.toLowerCase().includes(keyword)
        ) || cv > 15
        
        roles[col] = isLikelyOutput ? `Y (Output) - ${col}` : `X (Input) - ${col}`
      } else {
        const uniqueValues = [...new Set(values)]
        roles[col] = `Categorical (${uniqueValues.length} levels) - ${col}`
      }
    })
    
    return roles
  }

  const generateAnalysis = (csvData: any[]) => {
    if (csvData.length === 0) return
    
    const allColumns = Object.keys(csvData[0])
    const numericColumns = allColumns.filter(key => {
      const sampleValues = csvData.slice(0, 10).map(row => row[key])
      
      const isDate = sampleValues.every(val => {
        const datePatterns = [
          /^\d{4}-\d{2}-\d{2}$/,
          /^\d{1,2}\/\d{1,2}\/\d{4}$/,
          /^\d{4}\/\d{2}\/\d{2}$/,
        ]
        return datePatterns.some(pattern => pattern.test(val)) || !isNaN(Date.parse(val))
      })
      
      if (isDate) return false
      
      return sampleValues.every(val => {
        const num = parseFloat(val)
        return !isNaN(num) && isFinite(num)
      })
    })
    
    const categoricalColumns = allColumns.filter(key => {
      return !numericColumns.includes(key)
    })
    
    const columnRoles = detectColumnRoles(csvData, numericColumns, categoricalColumns)
    
    const stats = numericColumns.map(col => {
      const values = csvData.map(row => parseFloat(row[col])).filter(val => !isNaN(val))
      const mean = values.reduce((a, b) => a + b, 0) / values.length
      const sorted = values.sort((a, b) => a - b)
      const median = sorted[Math.floor(sorted.length / 2)]
      const stdDev = Math.sqrt(values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length)
      
      return {
        column: col,
        mean: mean.toFixed(2),
        median: median.toFixed(2),
        stdDev: stdDev.toFixed(2),
        min: Math.min(...values).toFixed(2),
        max: Math.max(...values).toFixed(2),
        role: columnRoles[col] || 'Unknown'
      }
    })

    const paretoData = generateParetoData(csvData, columnRoles)
    const histogramData = generateEnhancedHistograms(csvData, numericColumns)
    
    setAnalysis({
      stats,
      dataCount: csvData.length,
      numericColumns,
      categoricalColumns,
      columnRoles,
      paretoData,
      histogramData
    })
  }

  const generateParetoData = (data: any[], roles: any) => {
    const categoricalCol = Object.keys(roles).find(col => roles[col].includes('X ('))
    if (!categoricalCol) return null
    
    const groupData = data.reduce((acc, row) => {
      const category = row[categoricalCol] || 'Unknown'
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {})
    
    return Object.entries(groupData)
      .map(([name, value]) => ({ name, value }))
      .sort((a: any, b: any) => b.value - a.value)
  }

  const generateEnhancedHistograms = (data: any[], numeric: string[]) => {
    if (!numeric || numeric.length === 0) return []
    
    const validNumeric = numeric.filter(col => {
      const sampleValues = data.slice(0, 5).map(row => row[col])
      const isDate = sampleValues.every(val => {
        const datePatterns = [
          /^\d{4}-\d{2}-\d{2}$/,
          /^\d{1,2}\/\d{1,2}\/\d{4}$/,
          /^\d{4}\/\d{2}\/\d{2}$/,
        ]
        return datePatterns.some(pattern => pattern.test(val)) || !isNaN(Date.parse(val))
      })
      return !isDate && sampleValues.every(val => !isNaN(parseFloat(val)) && isFinite(parseFloat(val)))
    })
    
    return validNumeric.slice(0, 3).map(col => {
      const values = data.map(row => {
        const val = parseFloat(row[col])
        return isNaN(val) || !isFinite(val) ? null : val
      }).filter(val => val !== null) as number[]
      
      if (values.length === 0) return { column: col, data: [] }
      
      const min = Math.min(...values)
      const max = Math.max(...values)
      const bins = 10
      const binSize = (max - min) / bins
      
      const histogram = []
      for (let i = 0; i < bins; i++) {
        const binStart = min + (i * binSize)
        const binEnd = min + ((i + 1) * binSize)
        const count = values.filter(v => v >= binStart && (i === bins - 1 ? v <= binEnd : v < binEnd)).length
        
        histogram.push({
          range: `${binStart.toFixed(1)}-${binEnd.toFixed(1)}`,
          count
        })
      }
      
      return { column: col, data: histogram }
    })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'text/csv') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const lines = text.split('\n')
        const headers = lines[0].split(',')
        const data = lines.slice(1).filter(line => line.trim()).map(line => {
          const values = line.split(',')
          const row: any = {}
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

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/', { replace: true })
  }

  const tabs = [
    { id: 'upload', name: 'Data Upload', icon: '📊' },
    { id: 'define', name: 'Define', icon: '🎯' },
    { id: 'measure', name: 'Measure', icon: '📏' },
    { id: 'analyze', name: 'Analyze', icon: '🔍' },
    { id: 'improve', name: 'Improve', icon: '⚡' },
    { id: 'control', name: 'Control', icon: '🎛️' }
  ]

  const bgClass = darkMode.isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
  const headerClass = darkMode.isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
  const cardClass = darkMode.isDark ? 'bg-gray-800' : 'bg-white'

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
              {/* Dark Mode Toggle */}
              <button
                onClick={darkMode.toggleDark}
                className="p-2 rounded-md transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200"
                title={darkMode.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode.isDark ? '☀️' : '🌙'}
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
        {/* Data Upload Tab */}
        {activeTab === 'upload' && (
          <div className={`rounded-lg shadow p-6 ${cardClass}`}>
            <h2 className="text-xl font-semibold mb-4">📊 Data Upload & Analysis</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Upload CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="block w-full text-sm border rounded-lg cursor-pointer focus:outline-none bg-gray-50 border-gray-300 text-gray-900 file:bg-gray-100 file:text-gray-700 file:border-0 file:py-2 file:px-4 file:rounded-lg file:font-medium"
              />
            </div>

            {analysis && (
              <div className="space-y-6">
                {/* Data Summary */}
                <div className="p-4 rounded border bg-gray-50 border-gray-200">
                  <h3 className="font-medium mb-2 text-gray-900">📈 Data Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                    <div>
                      <p>Total Records: {analysis.dataCount}</p>
                      <p>Numeric Columns: {analysis.numericColumns.length}</p>
                      <p>Categorical Columns: {analysis.categoricalColumns.length}</p>
                    </div>
                  </div>
                </div>

                {/* Pareto Chart */}
                {analysis.paretoData && (
                  <div className={`rounded-lg shadow p-6 ${cardClass}`}>
                    <h3 className="text-lg font-semibold mb-4">📈 Pareto Chart</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart data={analysis.paretoData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" name="Count" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Histograms */}
                {analysis.histogramData && analysis.histogramData.length > 0 && (
                  <div className={`rounded-lg shadow p-6 ${cardClass}`}>
                    <h3 className="text-lg font-semibold mb-4">📊 Histograms</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {analysis.histogramData.map((hist: any, index: number) => (
                        <div key={index}>
                          <h4 className="text-md font-medium mb-2">{hist.column}</h4>
                          <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={hist.data}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="range" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="count" fill="#82ca9d" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Statistics Table */}
                {analysis.stats && (
                  <div className={`rounded-lg shadow p-6 ${cardClass}`}>
                    <h3 className="text-lg font-semibold mb-4">📈 Descriptive Statistics</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mean</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Median</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Std Dev</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {analysis.stats.map((stat: any) => (
                            <tr key={stat.column}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stat.column}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.mean}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.median}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.stdDev}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.min}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.max}</td>
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
        {activeTab === 'define' && (
          <div className={`rounded-lg shadow p-6 ${cardClass}`}>
            <h2 className="text-xl font-semibold mb-4">🎯 Define Phase</h2>
            <p className="text-gray-600">
              Define your project scope, problem statement, and goals.
            </p>
          </div>
        )}

        {activeTab === 'measure' && (
          <div className={`rounded-lg shadow p-6 ${cardClass}`}>
            <h2 className="text-xl font-semibold mb-4">📏 Measure Phase</h2>
            <p className="text-gray-600">
              Measure current performance and establish baseline metrics.
            </p>
          </div>
        )}

        {activeTab === 'analyze' && (
          <div className={`rounded-lg shadow p-6 ${cardClass}`}>
            <h2 className="text-xl font-semibold mb-4">🔍 Analyze Phase</h2>
            <p className="text-gray-600">
              Analyze data to identify root causes and improvement opportunities.
            </p>
          </div>
        )}

        {activeTab === 'improve' && (
          <div className={`rounded-lg shadow p-6 ${cardClass}`}>
            <h2 className="text-xl font-semibold mb-4">⚡ Improve Phase</h2>
            <p className="text-gray-600">
              Implement solutions and improvements based on analysis.
            </p>
          </div>
        )}

        {activeTab === 'control' && (
          <div className={`rounded-lg shadow p-6 ${cardClass}`}>
            <h2 className="text-xl font-semibold mb-4">🎛️ Control Phase</h2>
            <p className="text-gray-600">
              Monitor and control improvements to sustain gains.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Main App Component
function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  const toggleDark = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('darkMode', JSON.stringify(newTheme))
  }

  const darkModeValue = {
    isDark,
    toggleDark
  }

  return (
    <DarkModeContext.Provider value={darkModeValue}>
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
    </DarkModeContext.Provider>
  )
}

export default App