from fastapi import APIRouter, HTTPException, Depends
from Database.models.Jobsmodel import Jobmodels
from Database.Schemas.Job_Schema import JobCreateSchema, JobUpdateSchema
from typing import List
from utils.auth import verify_token
from fastapi.security import HTTPBearer
from Database.models.Applicants import JobApplicants
from Database.Schemas.Job_Schema import ApplicantSchema
from fastapi import Query
from bson import ObjectId
from middleware import get_current_user
from pydantic import BaseModel
from fastapi import UploadFile, Form, File, APIRouter
from typing import Optional
import base64
from pymongo.errors import PyMongoError
from motor.motor_asyncio import AsyncIOMotorClient
import os
from uuid import uuid4

from Database.connect import db

# Get reference to 'Jobs' collection
jobs_collection = db.get_collection("Jobs")  # Using db directly for async operations
job_route = APIRouter()
applicants_collection = db.get_collection("applicants") 
# security = HTTPBearer()
UPLOAD_FOLDER = "static/resumes"  # Make sure this folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@job_route.get("/")
async def root():
    """Root endpoint to check API status"""
    return {"message": "Job Portal API is running", "status": "ok"}

@job_route.post("/jobs", response_model=dict)
async def create_job(job: JobCreateSchema):
    """Create a new job posting"""
    result = await Jobmodels.create_jobs(job)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return {"message": "Job posted successfully", "job_id": result["id"]}

@job_route.get("/jobs")
async def get_jobs_by_email(current_users = Depends(get_current_user)):
    """Fetch all active job postings by user email"""
    email=current_users["email"] 
    jobs = await Jobmodels.get_jobs_by_email(email)
    print("JOBS GETTING", jobs)
    return jobs
@job_route.get("/get_all_job")
async def get_jobs_by_email(current_users = Depends(get_current_user)):
    """Fetch all active job postings by user email"""
    email=current_users["email"] 
    cursor = jobs_collection.find({"email": email}) 
    jobs = await cursor.to_list(length=None)
    for job in jobs:
            job["_id"] = str(job["_id"])
    return jobs
@job_route.delete("/jobs/{job_id}", response_model=dict)
async def delete_job(job_id: str):
    """Delete a job posting"""
    result = await Jobmodels.delete_job(job_id)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return {"message": "Job deleted successfully"}

@job_route.get("/jobs/all")
async def get_job_all():
    # """Fetch all job postings"""
    
    jobs = await Jobmodels.get_all_jobs()

    # Ensure we return only valid job objects
    if isinstance(jobs, dict) and "error" in jobs:
        raise HTTPException(status_code=500, detail=jobs["error"])

    return jobs

@job_route.get("/dashboard_data")
async def get_dash(current_users=Depends(get_current_user)):
    user_email = current_users['email']

    # Get total jobs posted by the user
    total_jobs = await jobs_collection.count_documents({"email": user_email})

    # Get active jobs (assuming status = "active")
    active_jobs = await jobs_collection.count_documents({
        "email": user_email,
        "status": "active"
    })
    applicant_job = await applicants_collection.count_documents({
       "job_mail":user_email,

    })
    return {
        "applicant_job": applicant_job,
        "total_jobs": total_jobs,
        "active_jobs": active_jobs
    }


@job_route.get("/jobid/")
async def get_job_id(id: str = Query(..., description="Job ID")):
    """Fetch a job by ID"""
    try:
        if not ObjectId.is_valid(id):
            raise HTTPException(status_code=400, detail="Invalid Job ID format")

        job = await jobs_collection.find_one({"_id": ObjectId(id)})

        if not job:
            raise HTTPException(status_code=404, detail="Job not found")

        # Convert ObjectId to string before returning
        job["_id"] = str(job["_id"])
        return job

    except Exception as e:
        print(f"Error fetching job: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@job_route.put("/change_jobstatus/")
async def change_job_status(id: str = Query(..., description="Job ID")):
    """Change job status to inactive"""
    try:
        if not ObjectId.is_valid(id):
            raise HTTPException(status_code=400, detail="Invalid Job ID format")

        job = await jobs_collection.find_one({"_id": ObjectId(id)})
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")

        update_result = await jobs_collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": {"status": "inactive"}}
        )

        if update_result.modified_count == 0:
            raise HTTPException(status_code=500, detail="Failed to update job status")

        return {"message": "Job status updated to inactive"}

    except Exception as e:
        print(f"Error updating job status: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    


 