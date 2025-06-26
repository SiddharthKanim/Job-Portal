from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import date
from fastapi import UploadFile

class JobCreateSchema(BaseModel):
    email: str  # Changed from EmailStr to str for compatibility
    job_title: str
    company_name: str
    location: str
    job_type: str
    description: str
    requirements: List[str]
    salary: Optional[str] = None
    experience: Optional[int] = 0
    posted_date: date
    deadline: Optional[date] = None
    status: str = "active"  

    class Config:
        orm_mode = True

class JobUpdateSchema(BaseModel):
    job_title: Optional[str] = None
    company_name: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[List[str]] = None
    salary: Optional[float] = None
    experience: Optional[int] = None
    deadline: Optional[date] = None
    status: Optional[str] = None

    class Config:
        orm_mode = True

class ApplicantSchema:
    full_name: Optional[str] = None
    Email: Optional[str] = None 
    cover_letter: Optional[str] = None