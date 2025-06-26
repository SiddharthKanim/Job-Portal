import React from 'react';
import { ProfileInformation } from './ProfileInformation';
import { Education } from './Education';
import { WorkExperience } from './WorkExperience';
import { Skills } from './Skills';
 

export function Overview( isEditing, setIsEditing ) {
  return (
    <div className="space-y-6">
      {/* <ProfileInformation isEditing={isEditing} setIsEditing={setIsEditing} />
      <Education />
      <WorkExperience />  */}
    </div>
  );
}