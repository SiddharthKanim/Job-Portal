import React, { useEffect, useState } from 'react';
import { GraduationCap, PlusCircle, X } from 'lucide-react';
import api from '../../api';

export function Education() {
  const [education, setEducation] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEdu, setNewEdu] = useState({
    degree_name: '',
    college_name: '',
    start_year: '',
    end_year: '',
  });

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const response = await api.get('/user/profile');
        setEducation(response.data.data.education || []);
      } catch (error) {
        console.error('Failed to fetch education:', error);
      }
    };
    fetchEducation();
  }, []);

  const handleChange = (e) => {
    setNewEdu({ ...newEdu, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post('/user/profile/education', newEdu);
      if (response.status === 200) {
        const refreshed = await api.get('/user/profile');
        setEducation(refreshed.data.data.education || []);
        setShowModal(false);
        setNewEdu({ degree_name: '', college_name: '', start_year: '', end_year: '' });
      }
    } catch (error) {
      console.error('Failed to add education:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/user/profile/education?experience_id=${id}`);
      if (response.status === 200) {
        setEducation((prev) => prev.filter((edu) => edu.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete education:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <GraduationCap className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold">Education</h3>
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
          {education.length > 0 ? (
            education.map((edu, index) => (
              <div key={edu.id || index} className="border-b pb-4">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{edu.degree_name}</h4>
                    <p className="text-gray-600">{edu.college_name}</p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-gray-500">{edu.start_year} - {edu.end_year}</p>
                    <button
                      onClick={() => handleDelete(edu.id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No education details available</p>
          )}
        </div>
      </div>

      {/* Add Education Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Education</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                name="degree_name"
                value={newEdu.degree_name}
                onChange={handleChange}
                placeholder="Degree Name"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="college_name"
                value={newEdu.college_name}
                onChange={handleChange}
                placeholder="College Name"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="start_year"
                value={newEdu.start_year}
                onChange={handleChange}
                placeholder="Start Year"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="end_year"
                value={newEdu.end_year}
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
