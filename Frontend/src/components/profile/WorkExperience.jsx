import React, { useEffect, useState } from 'react';
import { Building2, PlusCircle, X } from 'lucide-react';
import api from '../../api';

export function WorkExperience() {
  const [experience, setExperience] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newExp, setNewExp] = useState({
    company_name: '',
    position: '',
    description: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/user/profile');
        if (response.status === 200) {
          console.log('Fetched experience data:', response.data.data.experience);
          setExperience(response.data.data.experience || []);
        }
      } catch (err) {
        console.error('Failed to fetch experience data', err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setNewExp({ ...newExp, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post('user/profile/work_experience', newExp);
      if (response.status === 200) {
        const refreshed = await api.get('/user/profile');
        setExperience(refreshed.data.experience || []);
        setShowModal(false);
        setNewExp({ role: '', company: '', description: '', startYear: '', endYear: '' });
      }
    } catch (err) {
      console.error('Failed to add experience', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/user/profile/work_experience?experience_id=${id}`);
      if (response.status === 200) {
        setExperience((prev) => prev.filter((exp) => exp.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete experience', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Building2 className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold">Work Experience</h3>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <PlusCircle className="w-5 h-5 mr-1" />
            Add
          </button>
        </div>

        <div className="space-y-4">
          {experience.map((exp, index) => (
            <div key={exp.id || index} className={`pb-4 ${index !== experience.length - 1 ? 'border-b' : ''}`}>
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium">{exp.position}</h4>
                  <p className="text-gray-600">{exp.company_name}</p>
                  <p className="text-gray-500 text-sm mt-1">{exp.description}</p>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-gray-500">{exp.start_date} - {exp.end_date}</p>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Work Experience</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                name="position"
                value={newExp.position}
                onChange={handleChange}
                placeholder="Role"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="company_name"
                value={newExp.company_name}
                onChange={handleChange}
                placeholder="Company"
                className="w-full p-2 border rounded"
              />
              <textarea
                name="description"
                value={newExp.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full p-2 border rounded"
                rows="3"
              />
              <input
                type="number"
                name="start_date"
                value={newExp.start_date}
                onChange={handleChange}
                placeholder="Start Year"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="end_date"
                value={newExp.end_date}
                onChange={handleChange}
                placeholder="End Year"
                className="w-full p-2 border rounded"
              />
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
