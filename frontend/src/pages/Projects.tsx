import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Plus, Search, Filter, MoreVertical } from 'lucide-react'

interface Project {
  id: number
  name: string
  description: string
  stage: 'Define' | 'Measure' | 'Analyze' | 'Improve' | 'Control'
  progress: number
  created_at: string
  updated_at: string
  status: 'active' | 'completed' | 'on-hold'
}

function Projects() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStage, setSelectedStage] = useState<string>('all')

  // Mock data - will be replaced with API call
  const projects: Project[] = [
    {
      id: 1,
      name: 'Manufacturing Defect Reduction',
      description: 'Reducing defect rates in production line A by 50%',
      stage: 'Analyze',
      progress: 60,
      created_at: '2024-01-15',
      updated_at: '2024-01-20',
      status: 'active'
    },
    {
      id: 2,
      name: 'Customer Service Improvement',
      description: 'Improving customer satisfaction scores and response times',
      stage: 'Improve',
      progress: 80,
      created_at: '2024-01-10',
      updated_at: '2024-01-18',
      status: 'active'
    },
    {
      id: 3,
      name: 'Supply Chain Optimization',
      description: 'Streamlining procurement and delivery processes',
      stage: 'Measure',
      progress: 40,
      created_at: '2024-01-05',
      updated_at: '2024-01-12',
      status: 'active'
    },
    {
      id: 4,
      name: 'Quality Control Enhancement',
      description: 'Implementing comprehensive quality control measures',
      stage: 'Control',
      progress: 95,
      created_at: '2023-12-20',
      updated_at: '2024-01-08',
      status: 'completed'
    }
  ]

  const getStageColor = (stage: string) => {
    const colors = {
      'Define': 'bg-blue-100 text-blue-800',
      'Measure': 'bg-green-100 text-green-800',
      'Analyze': 'bg-yellow-100 text-yellow-800',
      'Improve': 'bg-orange-100 text-orange-800',
      'Control': 'bg-purple-100 text-purple-800'
    }
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'active': 'bg-green-100 text-green-800',
      'completed': 'bg-blue-100 text-blue-800',
      'on-hold': 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStage = selectedStage === 'all' || project.stage === selectedStage
    return matchesSearch && matchesStage
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage your DMAIC improvement projects</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Stages</option>
              <option value="Define">Define</option>
              <option value="Measure">Measure</option>
              <option value="Analyze">Analyze</option>
              <option value="Improve">Improve</option>
              <option value="Control">Control</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{project.description}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStageColor(project.stage)}`}>
                {project.stage}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Updated {new Date(project.updated_at).toLocaleDateString()}
              </div>
              <Link to={`/projects/${project.id}`}>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedStage !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Get started by creating your first DMAIC project.'}
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create New Project
          </Button>
        </div>
      )}
    </div>
  )
}

export default Projects