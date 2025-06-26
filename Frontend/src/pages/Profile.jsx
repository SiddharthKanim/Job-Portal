import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Briefcase,
  FileText,
  Bell,
  User,
  BookMarked,
  ArrowLeft,
  PersonStandingIcon
} from 'lucide-react';

import Overview from '../pages/ProfileRoutes/Overview';
import AppliedJobs from '../pages/ProfileRoutes/AppliedJobs';
import Notification from '../pages/ProfileRoutes/Notificatication'; // ✅ Fixed typo
import SavedJobs from '../pages/ProfileRoutes/SavedJobs';
import SettingsPage from '../pages/ProfileRoutes/Settings';
import Profilesec from '../components/Profilesec';
import Resume from './Resume';

import { LazyStore } from '@tauri-apps/plugin-store';
import { jwtDecode } from 'jwt-decode';

function Profile() {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const authStore = new LazyStore('.auth.json');
  const [mail,setmail] = useState('');
  const [fullname,setfullname] = useState('');

  const navigation = [
    { name: 'Overview', icon: User, id: 'overview', component: <Overview /> },
    { name: 'Profile', icon: PersonStandingIcon, id: 'profile', component: <Profilesec /> },
    { name: 'Applied Jobs', icon: Briefcase, id: 'appliedjobs', component: <AppliedJobs /> },
    { name: 'Resume Builder', icon: FileText, id: 'resume', component: <Resume /> },
    { name: 'Saved Jobs', icon: BookMarked, id: 'savedjobs', component: <SavedJobs /> },
    { name: 'Notifications', icon: Bell, id: 'notifications', component: <Notification /> },
   
  ];

  useEffect(() => {
    const checkAuth = async () => {
      const token = await authStore.get('jwt');
      if (!token) {
        navigate('/login');
      } else {
        try {
          const decoded = jwtDecode(token);
          setmail(decoded.email);
          setfullname(decoded.fullname);
          console.log('Decoded JWT:', decoded);
        } catch (error) {
          console.error('Invalid JWT token:', error);
          navigate('/login');
        }
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="min-h-screen w-1/4 bg-white shadow-lg p-6 flex flex-col">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        {/* User Info */}
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 flex items-center justify-center bg-gray-200 rounded-full">
            <User className="w-12 h-12 text-gray-600" />
          </div>

          <div className="mt-4">
            <p className='text-lg text-black'>{fullname}</p>
            <p className="text-sm text-gray-500">{mail}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex-grow flex flex-col space-y-2">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center px-4 py-2 text-md rounded-md transition-colors ${
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

      {/* Main Content */}
      <div className="flex-grow bg-gray-100 p-6">
        {navigation.find((tab) => tab.id === activeTab)?.component || <Overview />}
      </div>
    </div>
  );
}

export default Profile;
