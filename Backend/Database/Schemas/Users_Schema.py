from pydantic import BaseModel, Field, EmailStr, field_validator , HttpUrl
from typing import Literal , Optional

class UserSchema(BaseModel):
    firstName: str = Field(..., max_length=50, description="First Name")
    lastName: str = Field(..., max_length=50, description="Last Name")
    email: EmailStr = Field(..., description="Email address")
    mobileNumber: str = Field(..., description="Mobile Number")
    password: str = Field(..., description="User password")
    companyName: str = Field(..., max_length=50, description="Company Name")
    jobType: Literal["job_seeker", "job_poster"] = Field(..., description="Job Type")

    @field_validator("mobileNumber")
    @classmethod
    def validate_mobile(cls, v):
        if not v.isdigit():
            raise ValueError("Mobile number should contain only digits.")
        if len(v) != 10:
            raise ValueError("Mobile number should be exactly 10 digits.")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters long.")
        return v

class LoginSchema(BaseModel):
    mobileNumber: str = Field(..., description="Mobile Number")
    password: str = Field(..., description="User password")

    @field_validator("mobileNumber")
    @classmethod
    def validate_mobile(cls, v):
        if not v.isdigit():
            raise ValueError("Mobile number should contain only digits.")
        if len(v) != 10:
            raise ValueError("Mobile number should be exactly 10 digits.")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters long.")
        return v
    
class UpdateAbout(BaseModel):
    full_name: Optional[str] = None
    job_title: Optional[str] = None
    email: Optional[EmailStr] = None
    mobileNumber: Optional[str] = None
    summary: Optional[str] = None
    location: Optional[str] = None
    website: Optional[HttpUrl] = None
    linkedin_url: Optional[HttpUrl] = None
    github_url: Optional[HttpUrl] = None

class EducationSchema(BaseModel):
    degree_name: str
    college_name: str
    start_year: str
    end_year: Optional[str] = None 

class workexperienceSchema(BaseModel):
    company_name: str
    position: str
    start_date: str 
    end_date: Optional[str] = None
    description: Optional[str] = None

class workexperienceSchema1(BaseModel):
    company_name: str
    position: str
    start_date: str
    id: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None

class verifyEmailSchema(BaseModel):
    email: EmailStr = Field(..., description="Email address")

class forgotpassword(BaseModel):
    email: EmailStr = Field(..., description="Email address")
    password: str 

class verifyotp(BaseModel):
    email: EmailStr = Field(..., description="Email address")
    otp: int


