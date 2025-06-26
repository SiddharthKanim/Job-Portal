import React from 'react';
import { ProfileInformation } from './profile/Profileinformation';
import { Education } from './profile/Education';
import { WorkExperience } from '../components/profile/WorkExperience';
import { Skills } from '../components/profile/Skills';
 

export default function Overview( isEditing, setIsEditing ) {
  return (
    <div className="space-y-6">
      <ProfileInformation isEditing={isEditing} setIsEditing={setIsEditing} />
      <Education />
      <WorkExperience />
    </div>
  );
}