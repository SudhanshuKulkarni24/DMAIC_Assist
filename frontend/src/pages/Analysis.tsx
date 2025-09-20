import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter } from 'recharts'
import { Upload, Download, Calculator, TrendingUp, Target, AlertCircle } from 'lucide-react'

function Analysis() {
  const [selectedChart, setSelectedChart] = useState('histogram')
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  // Mock data for different chart types
  const histogramData = [
    { bin: '0-10', frequency: 5 },
    { bin: '10-20', frequency: 12 },
    { bin: '20-30', frequency: 25 },
    { bin: '30-40', frequency: 32 },
    { bin: '40-50', frequency: 28 },
    { bin: '50-60', frequency: 18 },
    { bin: '60-70', frequency: 8 },
    { bin: '70-80', frequency: 3 }
  ]

  const controlChartData = [
    { sample: 1, value: 45.2, ucl: 55, lcl: 35, target: 45 },
    { sample: 2, value: 47.1, ucl: 55, lcl: 35, target: 45 },
    { sample: 3, value: 44.8, ucl: 55, lcl: 35, target: 45 },
    { sample: 4, value: 46.3, ucl: 55, lcl: 35, target: 45 },
    { sample: 5, value: 43.9, ucl: 55, lcl: 35, target: 45 },
    { sample: 6, value: 48.1, ucl: 55, lcl: 35, target: 45 },
    { sample: 7, value: 45.7, ucl: 55, lcl: 35, target: 45 },
    { sample: 8, value: 44.2, ucl: 55, lcl: 35, target: 45 }
  ]

  const scatterData = [
    { x: 10, y: 12 }, { x: 15, y: 18 }, { x: 20, y: 25 }, { x: 25, y: 28 },
    { x: 30, y: 35 }, { x: 35, y: 42 }, { x: 40, y: 48 }, { x: 45, y: 52 }
  ]

  const statistics = {
    mean: 45.3,
    median: 45.1,
    stdDev: 8.2,
    cp: 1.21,
    cpk: 1.15,
    defectRate: 2.3
  }

  const chartTypes = [
    { id: 'histogram', name: 'Histogram', icon: '📊' },
    { id: 'control', name: 'Control Chart', icon: '📈' },
    { id: 'scatter', name: 'Scatter Plot', icon: '🔍' },
    { id: 'pareto', name: 'Pareto Chart', icon: '📋' }
  ]

  const renderChart = () => {
    switch (selectedChart) {
      case 'histogram':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={histogramData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bin" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="frequency" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        )
      case 'control':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={controlChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sample" />
              <YAxis />
              <Tooltip />
              <Line dataKey="ucl" stroke="#EF4444" strokeDasharray="5 5" name="UCL" />
              <Line dataKey="lcl" stroke="#EF4444" strokeDasharray="5 5" name="LCL" />
              <Line dataKey="target" stroke="#10B981" strokeDasharray="5 5" name="Target" />
              <Line dataKey="value" stroke="#3B82F6" strokeWidth={2} name="Actual" />
            </LineChart>
          </ResponsiveContainer>
        )
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={scatterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" name="Input Variable" />
              <YAxis dataKey="y" name="Output Variable" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter fill="#3B82F6" />
            </ScatterChart>
          </ResponsiveContainer>
        )
      default:
        return (
          <div className="h-96 flex items-center justify-center text-gray-500">
            Chart visualization will appear here
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistical Analysis</h1>
          <p className="text-gray-600 mt-1">Analyze your data using Six Sigma statistical tools</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Upload Data
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Results
          </Button>
        </div>
      </div>

      {/* Data Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Source</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Upload your dataset</h3>
          <p className="text-gray-600 mb-4">
            Drag and drop your CSV or Excel file here, or click to browse
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Choose File
          </Button>
          {selectedFile && (
            <p className="mt-4 text-sm text-green-600">
              ✓ {selectedFile} uploaded successfully
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Analysis Tools</h2>
          <div className="space-y-2">
            {chartTypes.map((chart) => (
              <button
                key={chart.id}
                onClick={() => setSelectedChart(chart.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedChart === chart.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-lg mr-3">{chart.icon}</span>
                  <span className="font-medium">{chart.name}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <Button className="w-full" variant="outline">
              <Calculator className="w-4 h-4 mr-2" />
              Process Capability
            </Button>
            <Button className="w-full" variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Regression Analysis
            </Button>
            <Button className="w-full" variant="outline">
              <Target className="w-4 h-4 mr-2" />
              Hypothesis Testing
            </Button>
          </div>
        </div>

        {/* Chart Display */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {chartTypes.find(c => c.id === selectedChart)?.name || 'Visualization'}
            </h2>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Chart
            </Button>
          </div>
          {renderChart()}
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Descriptive Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Mean:</span>
              <span className="font-medium">{statistics.mean}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Median:</span>
              <span className="font-medium">{statistics.median}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Std Deviation:</span>
              <span className="font-medium">{statistics.stdDev}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Process Capability</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Cp:</span>
              <span className="font-medium text-green-600">{statistics.cp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cpk:</span>
              <span className="font-medium text-green-600">{statistics.cpk}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Defect Rate:</span>
              <span className="font-medium text-red-600">{statistics.defectRate}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-600">
                Process capability is good but can be improved
              </span>
            </div>
            <div className="flex items-start">
              <Target className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-600">
                Consider implementing control charts
              </span>
            </div>
            <div className="flex items-start">
              <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-600">
                Trend analysis shows stability
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analysis