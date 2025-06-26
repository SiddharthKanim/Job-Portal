from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import date
from fastapi import UploadFile

class Applicantstatus(BaseModel):
    applicant_id: str
    job_status: str 