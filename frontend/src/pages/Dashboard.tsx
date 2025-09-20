import { useAuth } from '@/contexts/AuthContext'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

function Dashboard() {
  const { user } = useAuth()

  const stats = [
    { name: 'Active Projects', value: '12', icon: '📁', color: 'bg-blue-100 text-blue-800' },
    { name: 'Completed Projects', value: '8', icon: '✅', color: 'bg-green-100 text-green-800' },
    { name: 'Data Uploads', value: '24', icon: '📊', color: 'bg-purple-100 text-purple-800' },
    { name: 'Reports Generated', value: '15', icon: '📄', color: 'bg-orange-100 text-orange-800' },
  ]

  const recentProjects = [
    { id: 1, name: 'Manufacturing Defect Reduction', stage: 'Analyze', progress: 60 },
    { id: 2, name: 'Customer Service Improvement', stage: 'Improve', progress: 80 },
    { id: 3, name: 'Supply Chain Optimization', stage: 'Measure', progress: 40 },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.first_name}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Here's your DMAIC project overview and recent activity.
            </p>
          </div>
          <Link to="/projects">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              + New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <span className="text-xl">{stat.icon}</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
            <Link to="/projects" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
              View all →
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-500">Current Stage:</span>
                    <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {project.stage}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{project.progress}%</p>
                    <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  <Link to={`/projects/${project.id}`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DMAIC Process Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">DMAIC Process Overview</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {['Define', 'Measure', 'Analyze', 'Improve', 'Control'].map((stage, index) => (
              <div key={stage} className="text-center">
                <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-blue-600 font-bold">{index + 1}</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{stage}</h3>
                <p className="text-sm text-gray-500">
                  {stage === 'Define' && 'Problem definition & project charter'}
                  {stage === 'Measure' && 'Data collection & baseline metrics'}
                  {stage === 'Analyze' && 'Root cause analysis & hypotheses'}
                  {stage === 'Improve' && 'Solution implementation'}
                  {stage === 'Control' && 'Monitoring & sustainability'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard