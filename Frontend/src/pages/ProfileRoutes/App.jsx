import React, { useState } from 'react';
import { 
  Settings, 
  Briefcase, 
  FileText, 
  Bell, 
  User, 
  BookMarked,
  Mail,
  Calendar,
  Award
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const navigation = [
    { name: 'Overview', icon: User, id: 'overview' },
    { name: 'Profile', icon: FileText, id: 'Dashboard' },
    { name: '', icon: Briefcase, id: 'applied' },
    { name: 'Resume Builder', icon: FileText, id: 'resume' },
    { name: 'Saved Jobs', icon: BookMarked, id: 'saved' },
    { name: 'Notifications', icon: Bell, id: 'notifications' },
    { name: 'Settings', icon: Settings, id: 'settings' },
  ];

  const recentApplications = [
    { company: 'Google', position: 'Senior React Developer', status: 'Under Review', date: '2024-03-10' },
    { company: 'Microsoft', position: 'Frontend Engineer', status: 'Rejected', date: '2024-03-08' },
    { company: 'Apple', position: 'UI Developer', status: 'Interview', date: '2024-03-05' },
  ];

  const stats = [
    { label: 'Applied Jobs', value: '24', icon: Briefcase },
    { label: 'Interviews', value: '5', icon: Calendar },
    { label: 'Messages', value: '12', icon: Mail },
    { label: 'Skills', value: '18', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Dash</h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Bell className="w-6 h-6 text-gray-600" />
              </button>
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="bg-black col-span-12 lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="text-center">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Profile"
                    className="w-24 h-24 rounded-full mx-auto"
                  />
                  <h2 className="mt-4 text-xl font-semibold">John Doe</h2>
                  <p className="text-gray-600">Senior Frontend Developer</p>
                </div>
                <nav className="mt-6 space-y-1">
                  {navigation.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                        activeTab === item.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-50">
                      <stat.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-semibold">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Applications</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Company</th>
                        <th className="text-left py-3 px-4">Position</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentApplications.map((app, index) => (
                        <tr key={index} className="border-b last:border-b-0">
                          <td className="py-3 px-4">{app.company}</td>
                          <td className="py-3 px-4">{app.position}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              app.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                              app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">{app.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  <FileText className="w-6 h-6 mr-2 text-gray-600" />
                  <span>Update Resume</span>
                </button>
                <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  <Briefcase className="w-6 h-6 mr-2 text-gray-600" />
                  <span>Browse Jobs</span>
                </button>
                <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  <Mail className="w-6 h-6 mr-2 text-gray-600" />
                  <span>Check Messages</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;