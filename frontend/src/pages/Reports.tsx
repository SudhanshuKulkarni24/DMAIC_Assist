import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, FileText, Calendar, Filter, Eye, Share2 } from 'lucide-react'

interface Report {
  id: number
  title: string
  type: 'dmaic' | 'statistical' | 'summary'
  project: string
  created_at: string
  status: 'draft' | 'published' | 'archived'
  pages: number
  size: string
}

function Reports() {
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Mock data for reports
  const reports: Report[] = [
    {
      id: 1,
      title: 'Manufacturing Defect Reduction - Final Report',
      type: 'dmaic',
      project: 'Manufacturing Defect Reduction',
      created_at: '2024-01-20',
      status: 'published',
      pages: 24,
      size: '2.4 MB'
    },
    {
      id: 2,
      title: 'Statistical Analysis - Process Capability',
      type: 'statistical',
      project: 'Manufacturing Defect Reduction',
      created_at: '2024-01-18',
      status: 'published',
      pages: 8,
      size: '1.2 MB'
    },
    {
      id: 3,
      title: 'Customer Service Improvement - Progress Report',
      type: 'summary',
      project: 'Customer Service Improvement',
      created_at: '2024-01-15',
      status: 'draft',
      pages: 12,
      size: '1.8 MB'
    },
    {
      id: 4,
      title: 'Supply Chain Optimization - Baseline Study',
      type: 'dmaic',
      project: 'Supply Chain Optimization',
      created_at: '2024-01-10',
      status: 'published',
      pages: 16,
      size: '2.1 MB'
    }
  ]

  const getTypeColor = (type: string) => {
    const colors = {
      'dmaic': 'bg-blue-100 text-blue-800',
      'statistical': 'bg-green-100 text-green-800',
      'summary': 'bg-purple-100 text-purple-800'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'draft': 'bg-yellow-100 text-yellow-800',
      'published': 'bg-green-100 text-green-800',
      'archived': 'bg-gray-100 text-gray-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const filteredReports = reports.filter(report => {
    const matchesType = filterType === 'all' || report.type === filterType
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus
    return matchesType && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Generate and manage your DMAIC project reports</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <FileText className="w-4 h-4 mr-2" />
          Generate New Report
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          <div className="flex gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="dmaic">DMAIC Reports</option>
              <option value="statistical">Statistical Analysis</option>
              <option value="summary">Summary Reports</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report Templates */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Report Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">DMAIC Summary</h3>
                <p className="text-sm text-gray-500">Complete project overview</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              Generate Report
            </Button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Statistical Analysis</h3>
                <p className="text-sm text-gray-500">Data analysis results</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              Generate Report
            </Button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Executive Summary</h3>
                <p className="text-sm text-gray-500">High-level overview</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              Generate Report
            </Button>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Generated Reports</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredReports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {report.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(report.type)}`}>
                      {report.type.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Project: {report.project}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(report.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      {report.pages} pages
                    </div>
                    <div>{report.size}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
          <p className="text-gray-600 mb-4">
            {filterType !== 'all' || filterStatus !== 'all' 
              ? 'Try adjusting your filter criteria.' 
              : 'Generate your first report to get started.'}
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <FileText className="w-4 h-4 mr-2" />
            Generate New Report
          </Button>
        </div>
      )}
    </div>
  )
}

export default Reports