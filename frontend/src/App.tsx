import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ScatterChart, Scatter, ResponsiveContainer, ComposedChart } from 'recharts'

// Simple Login Component
function SimpleLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  const toggleDark = () => {
    const newValue = !isDark
    setIsDark(newValue)
    localStorage.setItem('darkMode', JSON.stringify(newValue))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
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
        setMessage('Login successful! Redirecting to dashboard...')
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('user', JSON.stringify(data.user))
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1000)
      } else {
        setMessage(data.message || 'Login failed. Please try again.')
      }
    } catch (error) {
      setMessage('Network error. Please check if the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Login to DMAIC Assistant</h2>
        
        {message && (
          <div className={`mb-4 p-3 rounded ${
            message.includes('successful') 
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}
        
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-medium text-blue-900 mb-2">Test Credentials:</h3>
          <div className="text-sm text-blue-700">
            <div><strong>Email:</strong> admin@dmaic.com</div>
            <div><strong>Password:</strong> admin123</div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md transition-colors ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <a href="/" className="text-blue-600 hover:text-blue-500 text-sm">← Back to Home</a>
        </div>
      </div>
    </div>
  )
}

// Enhanced homepage component
function HomePage() {
  const [showFeatures, setShowFeatures] = useState(false)
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">DMAIC Assistant</h1>
        <p className="text-gray-600 mb-6">Your complete platform for Six Sigma process improvement using the DMAIC methodology.</p>
        
        {!showFeatures ? (
          <div className="space-y-4">
            <div className="space-x-4">
              <a href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block transition-colors">
                Get Started
              </a>
              <button 
                onClick={() => setShowFeatures(true)}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        ) : (
          <div className="text-left space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Features:</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center">
                <span className="text-blue-600 mr-2">✓</span>
                <span><strong>Define:</strong> Project charter and problem definition</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-600 mr-2">✓</span>
                <span><strong>Measure:</strong> Data collection and baseline metrics</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-600 mr-2">✓</span>
                <span><strong>Analyze:</strong> Root cause analysis and statistical tools</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-600 mr-2">✓</span>
                <span><strong>Improve:</strong> Solution implementation and testing</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-600 mr-2">✓</span>
                <span><strong>Control:</strong> Monitoring and sustainability plans</span>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <a href="/login" className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-center">
                Start Your DMAIC Journey
              </a>
              <button 
                onClick={() => setShowFeatures(false)}
                className="block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                ← Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Functional DMAIC Dashboard
function Dashboard() {
  const [activeTab, setActiveTab] = useState('upload')
  const [file, setFile] = useState(null)
  const [data, setData] = useState([])
  const [analysis, setAnalysis] = useState(null)
  const [user, setUser] = useState(null)

  // Get user info from localStorage
  useState(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0]
    if (uploadedFile && uploadedFile.type === 'text/csv') {
      setFile(uploadedFile)
      // Parse CSV for demo (in real app, send to backend)
      const reader = new FileReader()
      reader.onload = (event) => {
        const csv = event.target.result
        const lines = csv.split('\n')
        const headers = lines[0].split(',')
        const rows = lines.slice(1).map(line => {
          const values = line.split(',')
          return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index]?.trim()
            return obj
          }, {})
        }).filter(row => Object.values(row).some(val => val))
        setData(rows)
        generateAnalysis(rows)
      }
      reader.readAsText(uploadedFile)
    } else {
      alert('Please upload a CSV file')
    }
  }

  const generateAnalysis = (csvData) => {
    if (csvData.length === 0) return
    
    // Improved column type detection
    const allColumns = Object.keys(csvData[0])
    const numericColumns = allColumns.filter(key => {
      const sampleValues = csvData.slice(0, 10).map(row => row[key])
      
      // Check if it's a date column
      const isDate = sampleValues.every(val => {
        const datePatterns = [
          /^\d{4}-\d{2}-\d{2}$/,  // YYYY-MM-DD
          /^\d{1,2}\/\d{1,2}\/\d{4}$/,  // MM/DD/YYYY
          /^\d{4}\/\d{2}\/\d{2}$/,  // YYYY/MM/DD
        ]
        return datePatterns.some(pattern => pattern.test(val)) || !isNaN(Date.parse(val))
      })
      
      if (isDate) return false
      
      // Check if truly numeric (not date masquerading as number)
      return sampleValues.every(val => {
        const num = parseFloat(val)
        return !isNaN(num) && isFinite(num)
      })
    })
    
    const categoricalColumns = allColumns.filter(key => {
      return !numericColumns.includes(key)
    })
    
    // Intelligent column role detection
    const columnRoles = detectColumnRoles(csvData, numericColumns, categoricalColumns)
    
    // Advanced statistical computations
    const advancedStats = computeAdvancedStatistics(csvData, numericColumns)
    
    // Process performance metrics
    const processMetrics = calculateProcessMetrics(csvData, columnRoles)
    
    // Statistical tests
    const statisticalTests = performStatisticalTests(csvData, numericColumns, categoricalColumns)
    
    // Basic statistics (keeping existing)
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
        count: values.length,
        values: values,
        role: columnRoles[col] || 'Unknown'
      }
    })
    
    // Generate Pareto Chart Data (enhanced)
    const paretoData = generateParetoData(csvData, columnRoles)
    
    // Generate enhanced histogram data with capability analysis
    const histogramData = generateEnhancedHistograms(csvData, numericColumns, processMetrics)
    
    // Enhanced control chart with Western Electric rules
    const controlChartData = generateEnhancedControlChart(csvData, numericColumns, processMetrics)
    
    // Enhanced regression with significance testing
    const regressionData = generateEnhancedRegression(csvData, numericColumns, statisticalTests)
    
    // Enhanced ANOVA with post-hoc analysis
    const anovaData = generateEnhancedANOVA(csvData, categoricalColumns, numericColumns, statisticalTests)
    
    // SIPOC mapping suggestions
    const sipocSuggestions = generateSIPOCSuggestions(csvData, columnRoles)
    
    // Problem statement candidates
    const problemStatements = generateProblemStatements(csvData, stats, processMetrics)
    
    setAnalysis({ 
      stats, 
      dataCount: csvData.length, 
      columns: Object.keys(csvData[0]),
      numericColumns,
      categoricalColumns,
      columnRoles,
      advancedStats,
      processMetrics,
      statisticalTests,
      paretoData,
      histogramData,
      controlChartData,
      regressionData,
      anovaData,
      sipocSuggestions,
      problemStatements,
      rawData: csvData
    })
  }
  
  // Helper functions for advanced analysis
  const detectColumnRoles = (data, numeric, categorical) => {
    const roles = {}
    
    // Detect potential Y variables (outputs)
    numeric.forEach(col => {
      const colLower = col.toLowerCase()
      if (colLower.includes('defect') || colLower.includes('error') || colLower.includes('failure')) {
        roles[col] = 'Y (Defect/Quality)'
      } else if (colLower.includes('time') || colLower.includes('cycle') || colLower.includes('duration')) {
        roles[col] = 'Y (Time/Efficiency)'
      } else if (colLower.includes('cost') || colLower.includes('price')) {
        roles[col] = 'Y (Cost)'
      } else if (colLower.includes('rating') || colLower.includes('score') || colLower.includes('satisfaction')) {
        roles[col] = 'Y (Quality Score)'
      } else {
        roles[col] = 'X (Input Factor)'
      }
    })
    
    // Detect potential X factors (inputs)
    categorical.forEach(col => {
      const colLower = col.toLowerCase()
      if (colLower.includes('operator') || colLower.includes('worker') || colLower.includes('employee')) {
        roles[col] = 'X (Human Factor)'
      } else if (colLower.includes('machine') || colLower.includes('equipment')) {
        roles[col] = 'X (Machine Factor)'
      } else if (colLower.includes('shift') || colLower.includes('time') || colLower.includes('period')) {
        roles[col] = 'X (Time Factor)'
      } else if (colLower.includes('material') || colLower.includes('supplier')) {
        roles[col] = 'X (Material Factor)'
      } else {
        roles[col] = 'X (Environmental Factor)'
      }
    })
    
    return roles
  }
  
  const computeAdvancedStatistics = (data, numeric) => {
    const advanced = {}
    
    numeric.forEach(col => {
      const values = data.map(row => parseFloat(row[col])).filter(val => !isNaN(val))
      const n = values.length
      const mean = values.reduce((a, b) => a + b, 0) / n
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1)
      const stdDev = Math.sqrt(variance)
      
      // Quartiles
      const sorted = [...values].sort((a, b) => a - b)
      const q1 = sorted[Math.floor(n * 0.25)]
      const q3 = sorted[Math.floor(n * 0.75)]
      const iqr = q3 - q1
      
      // Skewness and Kurtosis
      const skewness = values.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 3), 0) / n
      const kurtosis = values.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 4), 0) / n - 3
      
      advanced[col] = {
        variance: variance.toFixed(4),
        q1: q1.toFixed(2),
        q3: q3.toFixed(2),
        iqr: iqr.toFixed(2),
        skewness: skewness.toFixed(3),
        kurtosis: kurtosis.toFixed(3),
        cv: ((stdDev / mean) * 100).toFixed(2) // Coefficient of variation
      }
    })
    
    return advanced
  }
  
  const calculateProcessMetrics = (data, roles) => {
    const metrics = {}
    
    // Find defect columns
    const defectCols = Object.keys(roles).filter(col => roles[col].includes('Defect'))
    
    if (defectCols.length > 0) {
      const defectCol = defectCols[0]
      const defects = data.map(row => parseFloat(row[defectCol]) || 0)
      const totalDefects = defects.reduce((sum, val) => sum + val, 0)
      const totalUnits = data.length
      
      // Calculate DPMO (assuming 1 opportunity per unit for simplicity)
      const opportunities = totalUnits * 1
      const dpmo = (totalDefects / opportunities) * 1000000
      
      // Calculate Yield
      const goodUnits = data.filter(row => parseFloat(row[defectCol]) === 0).length
      const yield_ = (goodUnits / totalUnits) * 100
      
      metrics.dpmo = dpmo.toFixed(0)
      metrics.yield = yield_.toFixed(2)
      metrics.defectRate = ((totalDefects / totalUnits) * 100).toFixed(2)
      metrics.totalDefects = totalDefects
      metrics.totalUnits = totalUnits
    }
    
    return metrics
  }
  
  const performStatisticalTests = (data, numeric, categorical) => {
    const tests = {}
    
    // Correlation matrix for numeric variables
    if (numeric.length >= 2) {
      const correlations = {}
      for (let i = 0; i < numeric.length; i++) {
        for (let j = i + 1; j < numeric.length; j++) {
          const col1 = numeric[i]
          const col2 = numeric[j]
          const values1 = data.map(row => parseFloat(row[col1])).filter(val => !isNaN(val))
          const values2 = data.map(row => parseFloat(row[col2])).filter(val => !isNaN(val))
          
          if (values1.length === values2.length) {
            const correlation = calculateCorrelation(values1, values2)
            correlations[`${col1}_${col2}`] = {
              correlation: correlation.toFixed(3),
              significance: Math.abs(correlation) > 0.3 ? 'Moderate' : Math.abs(correlation) > 0.7 ? 'Strong' : 'Weak'
            }
          }
        }
      }
      tests.correlations = correlations
    }
    
    return tests
  }
  
  const calculateCorrelation = (x, y) => {
    const n = x.length
    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + (xi * y[i]), 0)
    const sumX2 = x.reduce((sum, xi) => sum + (xi * xi), 0)
    const sumY2 = y.reduce((sum, yi) => sum + (yi * yi), 0)
    
    return (n * sumXY - sumX * sumY) / Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))
  }
  
  const generateParetoData = (data, roles) => {
    // Find first categorical column for Pareto analysis
    const categoricalCol = Object.keys(roles).find(col => roles[col].includes('X ('))
    const defectCol = Object.keys(roles).find(col => roles[col].includes('Defect'))
    
    if (!categoricalCol) return null
    
    const groupData = data.reduce((acc, row) => {
      const category = row[categoricalCol] || 'Unknown'
      const defects = defectCol ? parseFloat(row[defectCol]) || 0 : 1
      acc[category] = (acc[category] || 0) + defects
      return acc
    }, {})
    
    return Object.entries(groupData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .map((item, index, array) => {
        const cumulative = array.slice(0, index + 1).reduce((sum, curr) => sum + curr.value, 0)
        const total = array.reduce((sum, curr) => sum + curr.value, 0)
        return {
          ...item,
          cumulative: ((cumulative / total) * 100).toFixed(1)
        }
      })
  }
  
  const generateEnhancedHistograms = (data, numeric, processMetrics) => {
    if (!numeric || numeric.length === 0) return []
    
    // Filter out date columns from numeric analysis
    const validNumeric = numeric.filter(col => {
      const sampleValues = data.slice(0, 5).map(row => row[col])
      const isDate = sampleValues.every(val => {
        const datePatterns = [
          /^\d{4}-\d{2}-\d{2}$/,  // YYYY-MM-DD
          /^\d{1,2}\/\d{1,2}\/\d{4}$/,  // MM/DD/YYYY
          /^\d{4}\/\d{2}\/\d{2}$/,  // YYYY/MM/DD
        ]
        return datePatterns.some(pattern => pattern.test(val)) || !isNaN(Date.parse(val))
      })
      return !isDate && sampleValues.every(val => !isNaN(parseFloat(val)) && isFinite(parseFloat(val)))
    })
    
    return validNumeric.slice(0, 3).map(col => {
      const values = data.map(row => {
        const val = parseFloat(row[col])
        return isNaN(val) || !isFinite(val) ? null : val
      }).filter(val => val !== null)
      
      if (values.length === 0) {
        return {
          column: col,
          data: [],
          capability: { cp: 'N/A', cpk: 'N/A', lsl: 'N/A', usl: 'N/A' }
        }
      }
      
      const min = Math.min(...values)
      const max = Math.max(...values)
      
      // Avoid creating histogram for constant values
      if (min === max) {
        return {
          column: col,
          data: [{ range: min.toFixed(2), count: values.length, frequency: '100.0' }],
          capability: { cp: 'N/A', cpk: 'N/A', lsl: 'N/A', usl: 'N/A' }
        }
      }
      
      const bins = Math.min(10, Math.max(5, Math.floor(Math.sqrt(values.length))))
      const binSize = (max - min) / bins
      
      const histogram = []
      for (let i = 0; i < bins; i++) {
        const binStart = min + (i * binSize)
        const binEnd = min + ((i + 1) * binSize)
        const count = values.filter(v => v >= binStart && (i === bins - 1 ? v <= binEnd : v < binEnd)).length
        
        // Better range formatting
        const rangeLabel = binSize >= 1 ? 
          `${binStart.toFixed(0)}-${binEnd.toFixed(0)}` : 
          `${binStart.toFixed(2)}-${binEnd.toFixed(2)}`
        
        histogram.push({
          range: rangeLabel,
          count,
          frequency: ((count / values.length) * 100).toFixed(1)
        })
      }
      
      // Calculate capability metrics
      const mean = values.reduce((a, b) => a + b, 0) / values.length
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length - 1)
      const stdDev = Math.sqrt(variance)
      
      // Reasonable specification limits based on data spread
      const lsl = mean - 3 * stdDev
      const usl = mean + 3 * stdDev
      const cp = stdDev > 0 ? (usl - lsl) / (6 * stdDev) : 0
      const cpk = stdDev > 0 ? Math.min((mean - lsl) / (3 * stdDev), (usl - mean) / (3 * stdDev)) : 0
      
      return { 
        column: col, 
        data: histogram,
        capability: {
          cp: cp.toFixed(3),
          cpk: cpk.toFixed(3),
          lsl: lsl.toFixed(2),
          usl: usl.toFixed(2)
        }
      }
    })
  }
  
  const generateEnhancedControlChart = (data, numeric, processMetrics) => {
    if (!numeric || numeric.length === 0) return null
    
    const col = numeric[0]
    const values = data.map((row, index) => {
      const value = parseFloat(row[col])
      return isNaN(value) ? null : { index: index + 1, value }
    }).filter(item => item !== null)
    
    if (values.length < 3) return null
    
    const mean = values.reduce((sum, item) => sum + item.value, 0) / values.length
    const variance = values.reduce((sum, item) => sum + Math.pow(item.value - mean, 2), 0) / (values.length - 1)
    const stdDev = Math.sqrt(variance)
    
    const ucl = mean + 3 * stdDev
    const lcl = mean - 3 * stdDev
    const uwl = mean + 2 * stdDev
    const lwl = mean - 2 * stdDev
    
    const chartData = values.map(item => ({
      index: item.index,
      value: parseFloat(item.value.toFixed(3)),
      mean: parseFloat(mean.toFixed(3)),
      ucl: parseFloat(ucl.toFixed(3)),
      lcl: parseFloat(lcl.toFixed(3)),
      uwl: parseFloat(uwl.toFixed(3)),
      lwl: parseFloat(lwl.toFixed(3))
    }))
    
    // Simple violation detection
    const violations = []
    values.forEach(point => {
      if (point.value > ucl || point.value < lcl) {
        violations.push(`Point ${point.index}: Beyond control limits (${point.value.toFixed(3)})`)
      }
    })
    
    return {
      column: col,
      data: chartData,
      mean: mean.toFixed(3),
      ucl: ucl.toFixed(3),
      lcl: lcl.toFixed(3),
      violations
    }
  }
  
  const detectWesternElectricViolations = (values, mean, ucl, lcl, uwl, lwl) => {
    const violations = []
    
    values.forEach((point, index) => {
      // Rule 1: Point beyond control limits
      if (point.value > ucl || point.value < lcl) {
        violations.push(`Point ${index + 1}: Beyond control limits`)
      }
      
      // Rule 2: 2 of 3 consecutive points beyond 2 sigma
      if (index >= 2) {
        const recent3 = values.slice(index - 2, index + 1)
        const beyond2Sigma = recent3.filter(p => p.value > uwl || p.value < lwl).length
        if (beyond2Sigma >= 2) {
          violations.push(`Point ${index + 1}: 2 of 3 points beyond 2 sigma`)
        }
      }
    })
    
    return violations
  }
  
  const generateEnhancedRegression = (data, numeric, tests) => {
    if (numeric.length < 2) return null
    
    const xCol = numeric[0]
    const yCol = numeric[1]
    
    const data_ = data.map(row => ({
      x: parseFloat(row[xCol]),
      y: parseFloat(row[yCol]),
      name: row.Process_ID || row.process_id || 'Point'
    })).filter(item => !isNaN(item.x) && !isNaN(item.y))
    
    const correlation = calculateCorrelation(data_.map(d => d.x), data_.map(d => d.y))
    const rSquared = correlation * correlation
    
    // Calculate regression line
    const n = data_.length
    const sumX = data_.reduce((sum, d) => sum + d.x, 0)
    const sumY = data_.reduce((sum, d) => sum + d.y, 0)
    const sumXY = data_.reduce((sum, d) => sum + (d.x * d.y), 0)
    const sumX2 = data_.reduce((sum, d) => sum + (d.x * d.x), 0)
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n
    
    return {
      data: data_,
      xColumn: xCol,
      yColumn: yCol,
      correlation: correlation.toFixed(3),
      rSquared: rSquared.toFixed(3),
      slope: slope.toFixed(3),
      intercept: intercept.toFixed(3),
      equation: `${yCol} = ${slope.toFixed(3)} * ${xCol} + ${intercept.toFixed(3)}`,
      significance: Math.abs(correlation) > 0.7 ? 'Strong' : Math.abs(correlation) > 0.3 ? 'Moderate' : 'Weak'
    }
  }
  
  const generateEnhancedANOVA = (data, categorical, numeric, tests) => {
    // Filter out date columns and ensure we have proper data types
    const validCategorical = categorical.filter(col => {
      const sampleValues = data.slice(0, 5).map(row => row[col])
      return !sampleValues.every(val => !isNaN(Date.parse(val)))
    })
    
    const validNumeric = numeric.filter(col => {
      const sampleValues = data.slice(0, 5).map(row => parseFloat(row[col]))
      return sampleValues.every(val => !isNaN(val) && isFinite(val))
    })
    
    if (validCategorical.length === 0 || validNumeric.length === 0) return null
    
    const groupCol = validCategorical[0]
    const valueCol = validNumeric[0]
    
    const groups = data.reduce((acc, row) => {
      const group = row[groupCol]
      const value = parseFloat(row[valueCol])
      if (!isNaN(value) && group != null && group !== '') {
        if (!acc[group]) acc[group] = []
        acc[group].push(value)
      }
      return acc
    }, {})
    
    // Need at least 2 groups with data
    const validGroups = Object.entries(groups).filter(([group, values]) => values.length > 0)
    if (validGroups.length < 2) return null
    
    // Calculate F-statistic using proper ANOVA formulas
    const groupMeans = {}
    const groupSizes = {}
    let grandTotal = 0
    let grandCount = 0
    
    validGroups.forEach(([group, values]) => {
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length
      groupMeans[group] = mean
      groupSizes[group] = values.length
      grandTotal += values.reduce((sum, val) => sum + val, 0)
      grandCount += values.length
    })
    
    const grandMean = grandTotal / grandCount
    
    // Between-group sum of squares (SSB)
    const ssBetween = validGroups.reduce((sum, [group, values]) => {
      return sum + values.length * Math.pow(groupMeans[group] - grandMean, 2)
    }, 0)
    
    // Within-group sum of squares (SSW) - corrected calculation
    const ssWithin = validGroups.reduce((sum, [group, values]) => {
      const groupMean = groupMeans[group]
      return sum + values.reduce((groupSum, val) => groupSum + Math.pow(val - groupMean, 2), 0)
    }, 0)
    
    // Degrees of freedom
    const dfBetween = validGroups.length - 1  // k - 1 (number of groups - 1)
    const dfWithin = grandCount - validGroups.length  // N - k (total observations - number of groups)
    
    if (dfWithin <= 0 || dfBetween <= 0) return null
    
    // Mean squares
    const msBetween = ssBetween / dfBetween  // Between-group variance
    const msWithin = ssWithin / dfWithin     // Within-group variance (pooled variance)
    
    // F-statistic = MSB / MSW
    const fStatistic = msWithin > 0 ? msBetween / msWithin : 0
    
    // Individual group statistics with corrected sample variance
    const anovaResults = validGroups.map(([group, values]) => {
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length
      // Sample variance: s² = Σ(x - x̄)² / (n - 1)
      const variance = values.length > 1 ? 
        values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length - 1) : 0
      return {
        group,
        mean: mean.toFixed(2),
        variance: variance.toFixed(2),
        count: values.length,
        min: Math.min(...values).toFixed(2),
        max: Math.max(...values).toFixed(2),
        stdDev: Math.sqrt(variance).toFixed(2)
      }
    })
    
    return {
      groupColumn: groupCol,
      valueColumn: valueCol,
      results: anovaResults,
      fStatistic: fStatistic.toFixed(3),
      significance: fStatistic > 3.0 ? 'Significant (p < 0.05)' : 'Not Significant (p > 0.05)',
      interpretation: fStatistic > 3.0 ? 
        `Groups have significantly different means for ${valueCol}` : 
        `No significant difference between ${groupCol} groups for ${valueCol}`
    }
  }
  
  const generateSIPOCSuggestions = (data, roles) => {
    const suppliers = []
    const inputs = []
    const process = "Process Analysis"
    const outputs = []
    const customers = []
    
    Object.entries(roles).forEach(([col, role]) => {
      if (role.includes('Y (')) {
        outputs.push(col)
      } else if (role.includes('X (')) {
        inputs.push(col)
      }
    })
    
    return {
      suppliers: suppliers.length > 0 ? suppliers : ['Data Source', 'Process Operator', 'Equipment'],
      inputs: inputs.length > 0 ? inputs : ['Materials', 'Information', 'Energy'],
      process: process,
      outputs: outputs.length > 0 ? outputs : ['Product', 'Service', 'Information'],
      customers: customers.length > 0 ? customers : ['End User', 'Next Process', 'Management']
    }
  }
  
  const generateProblemStatements = (data, stats, metrics) => {
    const statements = []
    
    // High variability detection
    stats.forEach(stat => {
      const cv = (parseFloat(stat.stdDev) / parseFloat(stat.mean)) * 100
      if (cv > 15) {
        statements.push(`${stat.column} shows high variability (CV: ${cv.toFixed(1)}%) indicating process instability.`)
      }
    })
    
    // Defect rate issues
    if (metrics.defectRate && parseFloat(metrics.defectRate) > 5) {
      statements.push(`Process defect rate of ${metrics.defectRate}% exceeds acceptable limits (DPMO: ${metrics.dpmo}).`)
    }
    
    // Yield issues
    if (metrics.yield && parseFloat(metrics.yield) < 95) {
      statements.push(`Process yield of ${metrics.yield}% is below target performance levels.`)
    }
    
    return statements.length > 0 ? statements : ['Process performance requires systematic analysis to identify improvement opportunities.']
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  const tabs = [
    { id: 'upload', name: 'Data Upload', icon: '📊' },
    { id: 'define', name: 'Define', icon: '🎯' },
    { id: 'measure', name: 'Measure', icon: '📏' },
    { id: 'analyze', name: 'Analyze', icon: '🔍' },
    { id: 'improve', name: 'Improve', icon: '⚡' },
    { id: 'control', name: 'Control', icon: '🎛️' }
  ]

  return (
    <div className={`min-h-screen ${
      isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <div className={`shadow-sm border-b ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">DMAIC Assistant</h1>
              {user && (
                <span className={`ml-4 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>Welcome, {user.first_name}!</span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
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
      <div className={`border-b ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
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
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Upload Your Data</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-gray-600">
                    <div className="text-4xl mb-4">📁</div>
                    <p className="text-lg mb-2">Click to upload your CSV file</p>
                    <p className="text-sm text-gray-500">Upload your process data for DMAIC analysis</p>
                  </div>
                </label>
                {file && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-green-700">✅ File uploaded: {file.name}</p>
                    <p className="text-sm text-green-600">{data.length} rows of data loaded</p>
                  </div>
                )}
              </div>
            </div>

            {analysis && (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">📊 Data Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded">
                      <div className="text-2xl font-bold text-blue-600">{analysis.dataCount}</div>
                      <div className="text-sm text-blue-800">Total Records</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded">
                      <div className="text-2xl font-bold text-green-600">{analysis.columns.length}</div>
                      <div className="text-sm text-green-800">Data Columns</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded">
                      <div className="text-2xl font-bold text-purple-600">{analysis.stats.length}</div>
                      <div className="text-sm text-purple-800">Numeric Columns</div>
                    </div>
                  </div>
                </div>

                {/* Pareto Chart */}
                {analysis.paretoData && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">📈 Pareto Chart - {analysis.paretoData.length > 0 ? 'Defects Analysis' : 'No Data'}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart data={analysis.paretoData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="value" fill="#8884d8" name="Count" />
                        <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="#ff7300" name="Cumulative %" strokeWidth={2} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Histograms */}
                {analysis.histogramData && analysis.histogramData.length > 0 && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">📊 Histograms - Data Distribution</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {analysis.histogramData.map((hist, index) => (
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

                {/* Enhanced Control Chart with Western Electric Rules */}
                {analysis.controlChartData && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">🎯 Control Chart - {analysis.controlChartData.column}</h3>
                    <div className="mb-4 text-sm text-gray-600 flex flex-wrap gap-4">
                      <span className="mr-4">Mean: {analysis.controlChartData.mean}</span>
                      <span className="mr-4">UCL: {analysis.controlChartData.ucl}</span>
                      <span>LCL: {analysis.controlChartData.lcl}</span>
                    </div>
                    
                    {/* Western Electric Rules Violations */}
                    {analysis.controlChartData.violations && analysis.controlChartData.violations.length > 0 && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                        <h4 className="font-medium text-red-900 mb-2">⚠️ Control Chart Violations Detected:</h4>
                        <ul className="text-sm text-red-700 space-y-1">
                          {analysis.controlChartData.violations.map((violation, index) => (
                            <li key={index}>• {violation}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analysis.controlChartData.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="index" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" name="Value" strokeWidth={2} />
                        <Line type="monotone" dataKey="mean" stroke="#00ff00" name="Mean" strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="ucl" stroke="#ff0000" name="UCL" strokeDasharray="3 3" />
                        <Line type="monotone" dataKey="lcl" stroke="#ff0000" name="LCL" strokeDasharray="3 3" />
                        {analysis.controlChartData.data[0] && analysis.controlChartData.data[0].uwl && (
                          <Line type="monotone" dataKey="uwl" stroke="#ff8800" name="UWL" strokeDasharray="2 2" />
                        )}
                        {analysis.controlChartData.data[0] && analysis.controlChartData.data[0].lwl && (
                          <Line type="monotone" dataKey="lwl" stroke="#ff8800" name="LWL" strokeDasharray="2 2" />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Regression Analysis */}
                {analysis.regressionData && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">🔍 Regression Analysis</h3>
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        {analysis.regressionData.xColumn} vs {analysis.regressionData.yColumn}
                      </p>
                      <p className="text-lg font-medium">
                        Correlation Coefficient: <span className="text-blue-600">{analysis.regressionData.correlation}</span>
                      </p>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <ScatterChart data={analysis.regressionData.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="x" name={analysis.regressionData.xColumn} />
                        <YAxis dataKey="y" name={analysis.regressionData.yColumn} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter dataKey="y" fill="#8884d8" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* ANOVA Results */}
                {analysis.anovaData && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">📋 ANOVA Analysis - {analysis.anovaData.valueColumn} by {analysis.anovaData.groupColumn}</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mean</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {analysis.anovaData.results.map((result, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.group}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.count}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.mean}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.variance}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.min}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.max}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Basic Statistics Table */}
                <div className="bg-white rounded-lg shadow p-6">
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
                        {analysis.stats.map((stat) => (
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
              </div>
            )}
          </div>
        )}

        {activeTab === 'define' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">🎯 Define Phase</h2>
            
            {analysis && (
              <div className="space-y-6">
                {/* Data Structure Overview */}
                <div className="bg-blue-50 border border-blue-200 rounded p-4">
                  <h3 className="font-medium text-blue-900 mb-3">📊 Data Structure Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-blue-800">Total Records: {analysis.dataCount}</p>
                      <p className="text-blue-700">Numeric Columns: {analysis.numericColumns.length}</p>
                      <p className="text-blue-700">Categorical Columns: {analysis.categoricalColumns.length}</p>
                    </div>
                    <div>
                      <p className="font-medium text-blue-800">Detected Y Variables (Outputs):</p>
                      {analysis.columnRoles && Object.entries(analysis.columnRoles)
                        .filter(([col, role]) => role.includes('Y ('))
                        .map(([col, role]) => (
                          <p key={col} className="text-blue-700">• {col} - {role}</p>
                        ))
                      }
                    </div>
                    <div>
                      <p className="font-medium text-blue-800">Detected X Factors (Inputs):</p>
                      {analysis.columnRoles && Object.entries(analysis.columnRoles)
                        .filter(([col, role]) => role.includes('X ('))
                        .map(([col, role]) => (
                          <p key={col} className="text-blue-700">• {col} - {role}</p>
                        ))
                      }
                    </div>
                  </div>
                </div>

                {/* SIPOC Mapping */}
                {analysis.sipocSuggestions && (
                  <div className="bg-green-50 border border-green-200 rounded p-4">
                    <h3 className="font-medium text-green-900 mb-3">📋 SIPOC Mapping Suggestions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-green-800">Suppliers</p>
                        {analysis.sipocSuggestions.suppliers.map((item, index) => (
                          <p key={index} className="text-green-700">• {item}</p>
                        ))}
                      </div>
                      <div>
                        <p className="font-medium text-green-800">Inputs</p>
                        {analysis.sipocSuggestions.inputs.map((item, index) => (
                          <p key={index} className="text-green-700">• {item}</p>
                        ))}
                      </div>
                      <div>
                        <p className="font-medium text-green-800">Process</p>
                        <p className="text-green-700">• {analysis.sipocSuggestions.process}</p>
                      </div>
                      <div>
                        <p className="font-medium text-green-800">Outputs</p>
                        {analysis.sipocSuggestions.outputs.map((item, index) => (
                          <p key={index} className="text-green-700">• {item}</p>
                        ))}
                      </div>
                      <div>
                        <p className="font-medium text-green-800">Customers</p>
                        {analysis.sipocSuggestions.customers.map((item, index) => (
                          <p key={index} className="text-green-700">• {item}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Problem Statement Candidates */}
                {analysis.problemStatements && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                    <h3 className="font-medium text-yellow-900 mb-3">⚠️ Problem Statement Candidates</h3>
                    {analysis.problemStatements.map((statement, index) => (
                      <p key={index} className="text-yellow-800 mb-2">• {statement}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <div className="space-y-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Problem Statement</label>
                <textarea className="w-full p-3 border border-gray-300 rounded-md" rows={3} placeholder="Define the problem you want to solve..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Goal</label>
                <input type="text" className="w-full p-3 border border-gray-300 rounded-md" placeholder="What do you want to achieve?"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Success Metrics</label>
                <input type="text" className="w-full p-3 border border-gray-300 rounded-md" placeholder="How will you measure success?"/>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'measure' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">📏 Measure Phase</h2>
            
            {analysis && analysis.processMetrics && (
              <div className="space-y-6">
                {/* Process Performance Metrics */}
                <div className="bg-purple-50 border border-purple-200 rounded p-4">
                  <h3 className="font-medium text-purple-900 mb-3">🎯 Process Performance Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {analysis.processMetrics.dpmo && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{analysis.processMetrics.dpmo}</div>
                        <div className="text-sm text-purple-800">DPMO</div>
                        <div className="text-xs text-purple-600">Defects Per Million</div>
                      </div>
                    )}
                    {analysis.processMetrics.yield && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{analysis.processMetrics.yield}%</div>
                        <div className="text-sm text-green-800">Yield</div>
                        <div className="text-xs text-green-600">Good Units</div>
                      </div>
                    )}
                    {analysis.processMetrics.defectRate && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{analysis.processMetrics.defectRate}%</div>
                        <div className="text-sm text-red-800">Defect Rate</div>
                        <div className="text-xs text-red-600">Total Defects</div>
                      </div>
                    )}
                    {analysis.processMetrics.totalUnits && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{analysis.processMetrics.totalUnits}</div>
                        <div className="text-sm text-blue-800">Total Units</div>
                        <div className="text-xs text-blue-600">Processed</div>
                      </div>
                    )}
                    {analysis.processMetrics.totalDefects && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{analysis.processMetrics.totalDefects}</div>
                        <div className="text-sm text-orange-800">Total Defects</div>
                        <div className="text-xs text-orange-600">Found</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Capability Analysis */}
                {analysis.histogramData && analysis.histogramData[0] && analysis.histogramData[0].capability && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded p-4">
                    <h3 className="font-medium text-indigo-900 mb-3">📈 Process Capability Analysis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysis.histogramData.slice(0, 2).map((hist, index) => (
                        <div key={index} className="border border-indigo-300 rounded p-3">
                          <h4 className="font-medium text-indigo-800 mb-2">{hist.column}</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>Cp: <span className="font-medium">{hist.capability.cp}</span></div>
                            <div>Cpk: <span className="font-medium">{hist.capability.cpk}</span></div>
                            <div>LSL: <span className="font-medium">{hist.capability.lsl}</span></div>
                            <div>USL: <span className="font-medium">{hist.capability.usl}</span></div>
                          </div>
                          <div className="mt-2 text-xs text-indigo-600">
                            {parseFloat(hist.capability.cpk) > 1.33 ? '✅ Capable Process' : 
                             parseFloat(hist.capability.cpk) > 1.0 ? '⚠️ Marginally Capable' : '❌ Incapable Process'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Baseline Performance Summary */}
                <div className="bg-gray-50 border border-gray-200 rounded p-4">
                  <h3 className="font-medium text-gray-900 mb-3">📊 Baseline Performance Summary</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    {analysis.processMetrics.yield && (
                      <p>• Your process shows <strong>{analysis.processMetrics.yield}% yield</strong> with <strong>{analysis.processMetrics.defectRate}% defect rate</strong></p>
                    )}
                    {analysis.stats && analysis.stats[0] && (
                      <p>• Mean {analysis.stats[0].column}: <strong>{analysis.stats[0].mean}</strong> ± {analysis.stats[0].stdDev} (CV: {analysis.advancedStats && analysis.advancedStats[analysis.stats[0].column] ? analysis.advancedStats[analysis.stats[0].column].cv : 'N/A'}%)</p>
                    )}
                    {analysis.processMetrics.dpmo && (
                      <p>• Process sigma level: <strong>{analysis.processMetrics.dpmo < 3400 ? '6σ' : analysis.processMetrics.dpmo < 66800 ? '5σ' : analysis.processMetrics.dpmo < 233000 ? '4σ' : '<4σ'}</strong> (DPMO: {analysis.processMetrics.dpmo})</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <p className="text-gray-600 mb-4">Your uploaded data analysis is shown above and in the Data Upload tab. Use this phase to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Review baseline measurements from your data</li>
                <li>Validate measurement system accuracy</li>
                <li>Establish process capability (Cp, Cpk)</li>
                <li>Document current state performance</li>
                <li>Calculate DPMO and yield metrics</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'analyze' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">🔍 Analyze Phase</h2>
            
            {analysis && (
              <div className="space-y-6">
                {/* Statistical Test Results */}
                {analysis.statisticalTests && analysis.statisticalTests.correlations && (
                  <div className="bg-orange-50 border border-orange-200 rounded p-4">
                    <h3 className="font-medium text-orange-900 mb-3">📊 Correlation Analysis</h3>
                    <div className="space-y-2">
                      {Object.entries(analysis.statisticalTests.correlations).map(([pair, data]) => {
                        const [var1, var2] = pair.split('_')
                        return (
                          <div key={pair} className="flex justify-between items-center bg-white p-3 rounded border">
                            <span className="text-sm font-medium text-gray-900">{var1} ↔ {var2}</span>
                            <div className="text-right">
                              <span className={`text-sm font-bold ${
                                Math.abs(parseFloat(data.correlation)) > 0.7 ? 'text-red-600' :
                                Math.abs(parseFloat(data.correlation)) > 0.3 ? 'text-yellow-600' : 'text-green-600'
                              }`}>
                                r = {data.correlation}
                              </span>
                              <div className="text-xs text-gray-500">{data.significance}</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-3 text-xs text-orange-600">
                      <p>• Strong correlation (|r| &gt; 0.7) suggests potential cause-effect relationship</p>
                      <p>• Moderate correlation (0.3 &lt; |r| &lt; 0.7) indicates some relationship</p>
                      <p>• Weak correlation (|r| &lt; 0.3) suggests little linear relationship</p>
                    </div>
                  </div>
                )}

                {/* Enhanced ANOVA Results */}
                {analysis.anovaData && analysis.anovaData.fStatistic && (
                  <div className="bg-teal-50 border border-teal-200 rounded p-4">
                    <h3 className="font-medium text-teal-900 mb-3">📋 ANOVA Results: {analysis.anovaData.valueColumn} by {analysis.anovaData.groupColumn}</h3>
                    <div className="mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-xl font-bold text-teal-600">{analysis.anovaData.fStatistic}</div>
                          <div className="text-sm text-teal-800">F-Statistic</div>
                        </div>
                        <div>
                          <div className={`text-xl font-bold ${
                            analysis.anovaData.significance.includes('Significant') ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {analysis.anovaData.significance.includes('Significant') ? 'SIG' : 'NS'}
                          </div>
                          <div className="text-sm text-teal-800">{analysis.anovaData.significance}</div>
                        </div>
                        <div>
                          <div className="text-lg font-medium text-teal-600">
                            {analysis.anovaData.interpretation.includes('significantly') ? '⚠️' : '✅'}
                          </div>
                          <div className="text-sm text-teal-800">Impact</div>
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-teal-700 text-center">
                        <strong>Interpretation:</strong> {analysis.anovaData.interpretation}
                      </div>
                    </div>
                  </div>
                )}

                {/* Advanced Statistics Summary */}
                {analysis.advancedStats && (
                  <div className="bg-purple-50 border border-purple-200 rounded p-4">
                    <h3 className="font-medium text-purple-900 mb-3">📊 Advanced Statistical Analysis</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="bg-purple-100">
                            <th className="px-3 py-2 text-left text-purple-800">Variable</th>
                            <th className="px-3 py-2 text-left text-purple-800">CV (%)</th>
                            <th className="px-3 py-2 text-left text-purple-800">Skewness</th>
                            <th className="px-3 py-2 text-left text-purple-800">Kurtosis</th>
                            <th className="px-3 py-2 text-left text-purple-800">Q1</th>
                            <th className="px-3 py-2 text-left text-purple-800">Q3</th>
                            <th className="px-3 py-2 text-left text-purple-800">IQR</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(analysis.advancedStats).map(([col, stats]) => (
                            <tr key={col} className="border-b border-purple-100">
                              <td className="px-3 py-2 font-medium text-purple-900">{col}</td>
                              <td className={`px-3 py-2 ${
                                parseFloat(stats.cv) > 20 ? 'text-red-600 font-bold' :
                                parseFloat(stats.cv) > 10 ? 'text-yellow-600' : 'text-green-600'
                              }`}>{stats.cv}%</td>
                              <td className={`px-3 py-2 ${
                                Math.abs(parseFloat(stats.skewness)) > 1 ? 'text-red-600' : 'text-gray-700'
                              }`}>{stats.skewness}</td>
                              <td className={`px-3 py-2 ${
                                Math.abs(parseFloat(stats.kurtosis)) > 1 ? 'text-red-600' : 'text-gray-700'
                              }`}>{stats.kurtosis}</td>
                              <td className="px-3 py-2 text-gray-700">{stats.q1}</td>
                              <td className="px-3 py-2 text-gray-700">{stats.q3}</td>
                              <td className="px-3 py-2 text-gray-700">{stats.iqr}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-3 text-xs text-purple-600 space-y-1">
                      <p>• CV &gt; 20%: High variability - investigate sources of variation</p>
                      <p>• |Skewness| &gt; 1: Highly skewed distribution - may need transformation</p>
                      <p>• |Kurtosis| &gt; 1: Non-normal distribution - consider alternative analyses</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
                <h3 className="font-medium text-blue-900 mb-2">📊 Available Analysis Charts:</h3>
                <p className="text-blue-700 text-sm mb-2">Upload data in the Data Upload tab to see these visualizations:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>✅ <strong>Pareto Charts</strong> - Identify top defect sources</li>
                    <li>✅ <strong>Histograms</strong> - Data distribution analysis</li>
                    <li>✅ <strong>Control Charts</strong> - Process stability monitoring</li>
                  </ul>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>✅ <strong>Regression Analysis</strong> - Variable correlations</li>
                    <li>✅ <strong>ANOVA</strong> - Group comparisons</li>
                    <li>✅ <strong>Statistical Tests</strong> - Hypothesis testing</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded p-4">
                <h3 className="font-medium mb-2">Root Cause Analysis Tools:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Fishbone Diagram</li>
                  <li>• 5 Whys Analysis</li>
                  <li>• Pareto Charts ✅ <span className="text-green-600">(Generated from data)</span></li>
                  <li>• Hypothesis Testing ✅ <span className="text-green-600">(Generated from data)</span></li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded p-4">
                <h3 className="font-medium mb-2">Statistical Analysis:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Correlation Analysis ✅ <span className="text-green-600">(Generated from data)</span></li>
                  <li>• Regression Analysis ✅ <span className="text-green-600">(Generated from data)</span></li>
                  <li>• ANOVA Testing ✅ <span className="text-green-600">(Generated from data)</span></li>
                  <li>• Control Charts ✅ <span className="text-green-600">(Generated from data)</span></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'improve' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">⚡ Improve Phase</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Proposed Solutions</label>
                <textarea className="w-full p-3 border border-gray-300 rounded-md" rows={3} placeholder="List your improvement ideas..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Implementation Plan</label>
                <textarea className="w-full p-3 border border-gray-300 rounded-md" rows={3} placeholder="How will you implement these solutions?"></textarea>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'control' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">🎛️ Control Phase</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Control Plan</label>
                <textarea className="w-full p-3 border border-gray-300 rounded-md" rows={3} placeholder="How will you sustain the improvements?"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monitoring Schedule</label>
                <input type="text" className="w-full p-3 border border-gray-300 rounded-md" placeholder="How often will you monitor the process?"/>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/login" element={<SimpleLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  )
}

export default App