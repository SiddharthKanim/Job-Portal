import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { Mail, Phone, MapPin } from 'lucide-react';

export const ResumePreview = ({ resumeData }) => {
  const resumeRef = useRef();

  const handleDownloadPDF = () => {
    const element = resumeRef.current;
    const opt = {
      margin: 0.3,
      filename: `${resumeData.contactInfo.fullName || 'resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div>
      {/* Save Button */}
      <div className="p-4 flex justify-end">
        <button
          onClick={handleDownloadPDF}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Resume as PDF
        </button>
      </div>

      {/* Resume Content */}
      <div
        ref={resumeRef}
        className="bg-white shadow-lg rounded-lg overflow-hidden min-h-screen"
        id="resume"
      >
        {/* Header */}
        <div className="bg-[#2c3e50] text-white p-8 relative min-h-[200px]">
          <h1 className="text-4xl font-bold mb-4">
            {resumeData.contactInfo.fullName || 'Your Name'}
          </h1>
          <p className="text-gray-300 max-w-[600px]">{resumeData.summary}</p>
        </div>

        {/* Contact Info */}
        <div className="bg-[#34495e] text-white p-4">
          <div className="flex flex-wrap gap-6 text-sm">
            {resumeData.contactInfo.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {resumeData.contactInfo.email}
              </div>
            )}
            {resumeData.contactInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {resumeData.contactInfo.phone}
              </div>
            )}
            {resumeData.contactInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {resumeData.contactInfo.location}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Education */}
              <div>
                <h2 className="text-2xl font-bold text-[#2c3e50] border-b-2 border-[#3498db] pb-2 mb-4">
                  EDUCATION
                </h2>
                <div className="space-y-4">
                  {resumeData.education.map((edu, index) => (
                    <div key={index}>
                      <h3 className="font-bold text-gray-800">{edu.degree}</h3>
                      <div className="text-gray-600">{edu.school}</div>
                      <div className="text-gray-500 text-sm italic">
                        {edu.startYear} - {edu.endYear}
                        {edu.sgpa && ` • SGPA: ${edu.sgpa}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h2 className="text-2xl font-bold text-[#2c3e50] border-b-2 border-[#3498db] pb-2 mb-4">
                  PERSONAL PROJECTS
                </h2>
                <div className="space-y-4">
                  {resumeData.projects.map((project, index) => (
                    <div key={index}>
                      <h3 className="font-bold text-gray-800">{project.title}</h3>
                      <div className="text-gray-500 text-sm italic">
                        Technologies: {project.technologies}
                      </div>
                      <p className="text-gray-600 mt-1">{project.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Work Experience */}
              <div>
                <h2 className="text-2xl font-bold text-[#2c3e50] border-b-2 border-[#3498db] pb-2 mb-4">
                  Work Experience
                </h2>
                <div className="space-y-4">
                  {resumeData.experience.map((exp, index) => (
                    <div key={index}>
                      <h3 className="font-bold text-gray-800">{exp.title}</h3>
                      <div className="text-gray-600">{exp.company}</div>
                      <div className="text-gray-500 text-sm italic">
                        {exp.duration}
                      </div>
                      <ul className="list-disc list-inside mt-2 text-gray-600">
                        {exp.responsibilities.map((resp, i) => (
                          <li key={i}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Skills */}
              <div>
                <h2 className="text-2xl font-bold text-[#2c3e50] border-b-2 border-[#3498db] pb-2 mb-4">
                  SKILLS
                </h2>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h2 className="text-2xl font-bold text-[#2c3e50] border-b-2 border-[#3498db] pb-2 mb-4">
                  CERTIFICATES
                </h2>
                <div className="space-y-2">
                  {resumeData.certifications.map((cert, index) => (
                    <div key={index}>
                      <div className="font-semibold text-gray-800">{cert.name}</div>
                      <div className="text-gray-600">
                        {cert.organization} • {cert.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
