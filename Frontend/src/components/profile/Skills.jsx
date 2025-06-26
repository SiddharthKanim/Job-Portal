import React, { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';

export function Skills() {
  const [skills, setSkills] = useState([
    // 'React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3',
    // 'Node.js', 'Git', 'REST APIs', 'GraphQL', 'Webpack', 'Jest', 'CI/CD'
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
      setNewSkill('');
      setShowModal(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Skills</h3>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <PlusCircle className="w-5 h-5 mr-1" />
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Add Skill Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Skill</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter a skill"
                className="w-full p-2 border rounded"
              />
              <button
                onClick={handleAddSkill}
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
