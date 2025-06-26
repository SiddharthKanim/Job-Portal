import React, { useState, useEffect } from 'react';
import { AtSign, Phone, MapPin, Globe, Github, Linkedin, Loader2 } from 'lucide-react';
import api from '../../api';

export function ProfileInformation() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    api.get('/user/profile')
      .then((response) => {
        setProfile(response.data.data);
        setFormData(response.data.data);
      })
      .catch((error) => console.error('Error fetching profile:', error))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    api.put('/user/profile_update', formData)
      .then(() => {
        setProfile(formData);
        setIsEditing(false);
      })
      .catch((error) => console.error('Error updating profile:', error));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  const ProfileInput = ({ label, icon: Icon, field }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          name={field}
          value={formData[field] || ''}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
        />
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Profile Information</h3>
          <button 
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className="px-4 py-2 text-sm rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileInput label="Full Name" icon={AtSign} field="full_name" />
          <ProfileInput label="Job Title" icon={AtSign} field="job_title" />
          <ProfileInput label="Email" icon={AtSign} field="email" />
          <ProfileInput label="Phone" icon={Phone} field="mobileNumber" />
          <ProfileInput label="Location" icon={MapPin} field="location" />
          <ProfileInput label="LinkedIn" icon={Linkedin} field="linkedin_url" />
        </div>
      </div>
    </div>
  );
}