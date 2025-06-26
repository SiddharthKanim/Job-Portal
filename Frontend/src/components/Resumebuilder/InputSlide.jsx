import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

export const InputSlide = ({ currentSlide, resumeData, updateResumeData }) => {
  const [newSkill, setNewSkill] = useState('');
  const [showSkillInput, setShowSkillInput] = useState(false);

  const handleContactChange = (field, value) => {
    updateResumeData('contactInfo', {
      ...resumeData.contactInfo,
      [field]: value,
    });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      updateResumeData('skills', [...resumeData.skills, newSkill.trim()]);
      setNewSkill('');
      setShowSkillInput(false);
    }
  };

  const removeSkill = (index) => {
    const newSkills = resumeData.skills.filter((_, i) => i !== index);
    updateResumeData('skills', newSkills);
  };

  const addExperience = () => {
    updateResumeData('experience', [
      ...resumeData.experience,
      {
        title: '',
        company: '',
        location: '',
        duration: '',
        responsibilities: [''],
      },
    ]);
  };

  const updateExperience = (index, field, value) => {
    const newExperience = [...resumeData.experience];
    newExperience[index] = {
      ...newExperience[index],
      [field]: value,
    };
    updateResumeData('experience', newExperience);
  };

  const addEducation = () => {
    updateResumeData('education', [
      ...resumeData.education,
      {
        degree: '',
        school: '',
        location: '',
        startYear: '',
        endYear: '',
        sgpa: '',
      },
    ]);
  };

  const addCertification = () => {
    updateResumeData('certifications', [
      ...resumeData.certifications,
      {
        name: '',
        organization: '',
        date: '',
      },
    ]);
  };

  const addProject = () => {
    updateResumeData('projects', [
      ...resumeData.projects,
      {
        title: '',
        description: '',
        technologies: '',
      },
    ]);
  };

  const renderSlide = () => {
    switch (currentSlide) {
      case 0:
        return (
          <div className="space-y-4">
            <input type="text" placeholder="Full Name" value={resumeData.contactInfo.fullName} onChange={(e) => handleContactChange('fullName', e.target.value)} className="w-full p-2 border rounded" />
            <input type="tel" placeholder="Phone" value={resumeData.contactInfo.phone} onChange={(e) => handleContactChange('phone', e.target.value)} className="w-full p-2 border rounded" />
            <input type="email" placeholder="Email" value={resumeData.contactInfo.email} onChange={(e) => handleContactChange('email', e.target.value)} className="w-full p-2 border rounded" />
            <input type="text" placeholder="Location" value={resumeData.contactInfo.location} onChange={(e) => handleContactChange('location', e.target.value)} className="w-full p-2 border rounded" />
          </div>
        );

      case 1:
        return (
          <textarea placeholder="Write your professional summary..." value={resumeData.summary} onChange={(e) => updateResumeData('summary', e.target.value)} className="w-full p-2 border rounded h-40" />
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Education</h3>
              <button onClick={addEducation} className="p-1 rounded-full hover:bg-gray-100">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="space-y-2 border-b pb-4">
                <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => {
                  const newEducation = [...resumeData.education];
                  newEducation[index] = { ...newEducation[index], degree: e.target.value };
                  updateResumeData('education', newEducation);
                }} className="w-full p-2 border rounded" />
                <input type="text" placeholder="School/College/University" value={edu.school} onChange={(e) => {
                  const newEducation = [...resumeData.education];
                  newEducation[index] = { ...newEducation[index], school: e.target.value };
                  updateResumeData('education', newEducation);
                }} className="w-full p-2 border rounded" />
                <div className="flex gap-2">
                  <input type="number" placeholder="Start Year" value={edu.startYear || ''} onChange={(e) => {
                    const newEducation = [...resumeData.education];
                    newEducation[index] = { ...newEducation[index], startYear: e.target.value };
                    updateResumeData('education', newEducation);
                  }} className="w-1/2 p-2 border rounded" />
                  <input type="number" placeholder="End Year" value={edu.endYear || ''} onChange={(e) => {
                    const newEducation = [...resumeData.education];
                    newEducation[index] = { ...newEducation[index], endYear: e.target.value };
                    updateResumeData('education', newEducation);
                  }} className="w-1/2 p-2 border rounded" />
                </div>
                <input type="text" placeholder="SGPA (optional)" value={edu.sgpa} onChange={(e) => {
                  const newEducation = [...resumeData.education];
                  newEducation[index] = { ...newEducation[index], sgpa: e.target.value };
                  updateResumeData('education', newEducation);
                }} className="w-1/2 p-2 border rounded" />
              </div>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Skills</h3>
                <button onClick={() => setShowSkillInput(!showSkillInput)} className="p-1 rounded-full hover:bg-gray-100">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {showSkillInput && (
                <div className="flex flex-wrap mb-2 gap-2">
                  <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Enter a skill" className="border px-2 py-1 rounded" />
                  <button onClick={addSkill} className="p-1 rounded-full hover:bg-gray-100">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                    {skill}
                    <button onClick={() => removeSkill(index)} className="hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Projects</h3>
              <button onClick={addProject} className="p-1 rounded-full hover:bg-gray-100">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            {resumeData.projects.map((project, index) => (
              <div key={index} className="space-y-2 mb-4">
                <input type="text" placeholder="Project Title" value={project.title} onChange={(e) => {
                  const newProjects = [...resumeData.projects];
                  newProjects[index] = { ...newProjects[index], title: e.target.value };
                  updateResumeData('projects', newProjects);
                }} className="w-full p-2 border rounded" />
                <textarea placeholder="Project Description" value={project.description} onChange={(e) => {
                  const newProjects = [...resumeData.projects];
                  newProjects[index] = { ...newProjects[index], description: e.target.value };
                  updateResumeData('projects', newProjects);
                }} className="w-full p-2 border rounded h-24" />
                <input type="text" placeholder="Technologies Used" value={project.technologies} onChange={(e) => {
                  const newProjects = [...resumeData.projects];
                  newProjects[index] = { ...newProjects[index], technologies: e.target.value };
                  updateResumeData('projects', newProjects);
                }} className="w-full p-2 border rounded" />
              </div>
            ))}

            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Certifications</h3>
              <button onClick={addCertification} className="p-1 rounded-full hover:bg-gray-100">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            {resumeData.certifications.map((cert, index) => (
              <div key={index} className="space-y-2 mb-4">
                <input type="text" placeholder="Certification Name" value={cert.name} onChange={(e) => {
                  const newCerts = [...resumeData.certifications];
                  newCerts[index] = { ...newCerts[index], name: e.target.value };
                  updateResumeData('certifications', newCerts);
                }} className="w-full p-2 border rounded" />
                <input type="text" placeholder="Organization" value={cert.organization} onChange={(e) => {
                  const newCerts = [...resumeData.certifications];
                  newCerts[index] = { ...newCerts[index], organization: e.target.value };
                  updateResumeData('certifications', newCerts);
                }} className="w-full p-2 border rounded" />
                <input type="date" placeholder="Date" value={cert.date} onChange={(e) => {
                  const newCerts = [...resumeData.certifications];
                  newCerts[index] = { ...newCerts[index], date: e.target.value };
                  updateResumeData('certifications', newCerts);
                }} className="w-full p-2 border rounded" />
              </div>
            ))}
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Work Experience</h3>
              <button onClick={addExperience} className="p-1 rounded-full hover:bg-gray-100">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="space-y-2 border-b pb-4">
                <input type="text" placeholder="Job Title" value={exp.title} onChange={(e) => updateExperience(index, 'title', e.target.value)} className="w-full p-2 border rounded" />
                <input type="text" placeholder="Company" value={exp.company} onChange={(e) => updateExperience(index, 'company', e.target.value)} className="w-full p-2 border rounded" />
                <input type="text" placeholder="Duration (e.g., Jan 2022 - Dec 2023)" value={exp.duration} onChange={(e) => updateExperience(index, 'duration', e.target.value)} className="w-full p-2 border rounded" />
                <textarea placeholder="Responsibilities (one per line)" value={exp.responsibilities.join('\n')} onChange={(e) => updateExperience(index, 'responsibilities', e.target.value.split('\n'))} className="w-full p-2 border rounded h-24" />
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="space-y-4">{renderSlide()}</div>;
};
