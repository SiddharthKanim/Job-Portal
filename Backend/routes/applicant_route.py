from Database.connect import db
from fastapi import APIRouter, HTTPException, Depends
from Database.models.Jobsmodel import Jobmodels
from Database.Schemas.applicant_schema import Applicantstatus
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
from datetime import datetime
from uuid import uuid4 
from utils.email import send_mail
from zoneinfo import ZoneInfo

applicant_route = APIRouter()
applicants_collection = db.get_collection("applicants")
jobs_collection = db.get_collection("Jobs")
notification_collection = db.get_collection("notification")

UPLOAD_FOLDER = "static/resumes"  
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@applicant_route.post("/create_applicant")
async def create_applicants(
    current_users = Depends(get_current_user),
    name: Optional[str] = Form(None), 
    coverLetter: Optional[str] = Form(None),
    resume: UploadFile = File(...),
    job_id: Optional[str] = Form(None)
):
    try: 
        user_email = current_users['email']
 
        extension = os.path.splitext(resume.filename)[1]  
        resume_filename = f"{uuid4().hex}{extension}"
        resume_path = os.path.join(UPLOAD_FOLDER, resume_filename)
 
        with open(resume_path, "wb") as f:
            content = await resume.read()
            f.write(content)
 
        resume_link = f"/static/resumes/{resume_filename}"
 
        job = await jobs_collection.find_one({"_id": ObjectId(job_id)})
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")

        job_mail = job.get("email", None)

        job_dict = {
            "user_email": user_email,
            "full_name": name, 
            "cover_letter": coverLetter,
            "resume_link": resume_link,
            "job_mail": job_mail,
            "applicant_status": 'Hold',
            "applicant_date": datetime.utcnow(),    
            "job_id": job_id,
            "job_title": job.get("job_title") if job else "Unknown"
        }

        result = await applicants_collection.insert_one(job_dict)
        return {"message": "Applicant created successfully", "applicant_id": str(result.inserted_id)}

    except PyMongoError as db_error:
        raise HTTPException(status_code=500, detail=f"Database error: {str(db_error)}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
    

@applicant_route.get("/get_applicant")
async def get_applicant(current_users=Depends(get_current_user)):
    try: 
        user_email = current_users['email']
 
        applicants_cursor = applicants_collection.find({"job_mail": user_email}) 
        applicants = await applicants_cursor.to_list(length=None)

        if not applicants:
            raise HTTPException(status_code=404, detail="No applicants found")
 
        for applicant in applicants:
            applicant["_id"] = str(applicant["_id"])
 
            job_id = applicant.get("job_id")
            if job_id:
                job = await jobs_collection.find_one({"_id": ObjectId(job_id)})
                applicant["job_title"] = job.get("job_title") if job else "Unknown"
            else:
                applicant["job_title"] = "Unknown"

        return applicants

    except PyMongoError as db_error:
        raise HTTPException(status_code=500, detail=f"Database error: {str(db_error)}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
    
@applicant_route.get("/get_appliedJobs")
async def get_applicant(current_users=Depends(get_current_user)):
    try: 
        user_email = current_users['email']
 
        applicants_cursor = applicants_collection.find({"user_email": user_email}) 
        applicants = await applicants_cursor.to_list(length=None)

        if not applicants:
            raise HTTPException(status_code=404, detail="No applicants found")
 
        for applicant in applicants:
            applicant["_id"] = str(applicant["_id"])
 
            job_id = applicant.get("job_id")
            if job_id:
                job = await jobs_collection.find_one({"_id": ObjectId(job_id)})
                applicant["job_title"] = job.get("job_title") if job else "Unknown"
            else:
                applicant["job_title"] = "Unknown"

        return applicants

    except PyMongoError as db_error:
        raise HTTPException(status_code=500, detail=f"Database error: {str(db_error)}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
    

@applicant_route.put("/change_applicant_status")
async def change_applicant_status(data: Applicantstatus, current_user=Depends(get_current_user)):
    try:
        applicant_id = data.applicant_id
        new_status = data.job_status

        applicant = await applicants_collection.find_one({"_id": ObjectId(applicant_id)})
        if not applicant:
            raise HTTPException(status_code=404, detail="Applicant not found")

        await applicants_collection.update_one(
            {"_id": ObjectId(applicant_id)},
            {"$set": {"applicant_status": new_status}}
        )
        update_applicant_data = await applicants_collection.find_one(
            {"_id": ObjectId(applicant_id)},
        )

        job_data = await jobs_collection.find_one({
            "_id": ObjectId(update_applicant_data["job_id"])
        })
        user_mail = update_applicant_data['user_email']
        created_at_ist = datetime.now(ZoneInfo("Asia/Kolkata"))

        # Insert notification data
        notification_data = await notification_collection.insert_one({
            "applicant_id": applicant_id,
            "job_status": new_status,
            "job_title": job_data.get("job_title", "N/A"),
            "email": update_applicant_data.get("user_email", "N/A"),
            "createdAt": created_at_ist
        })

        # Construct the message based on the new status
        if new_status == "Approved":
            message = f"Congratulations {update_applicant_data['full_name']}, your application to {job_data['job_title']} has been {new_status}. Check the Job portal application for more details."
        elif new_status == "Declined":
            message = f"Sorry {update_applicant_data['full_name']}, your application to {job_data['job_title']} has been {new_status}. We appreciate your interest, and we encourage you to apply for other opportunities in the future."
        else:
            message = f"Your application to {job_data['job_title']} has been updated to {new_status}. Check the Job portal for more details."

        title = f"Application {new_status}"
        email = update_applicant_data.get("user_email", "N/A")
        
        # Send email notification
        send_mail(title, message, email)

        return {"message": "Applicant status updated successfully", "status": new_status}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


from bson import ObjectId

def convert_objectid(obj):
    if isinstance(obj, list):
        return [convert_objectid(item) for item in obj]
    if isinstance(obj, dict):
        return {
            key: convert_objectid(value)
            for key, value in obj.items()
        }
    if isinstance(obj, ObjectId):
        return str(obj)
    return obj


@applicant_route.get("/applicant_notification")
async def get_all_notification_applicant(current_user=Depends(get_current_user)):
    email = current_user['email']
    cursor = notification_collection.find({"email": email})
    notification_data = await cursor.to_list(length=None)
    clean_data = convert_objectid(notification_data)

    return {
        "status": "success",
        "notification_data": clean_data
    }

@applicant_route.get("/clear_notification")
async def clear_notification(current_user=Depends(get_current_user)):
    # """Clear notification for the current user"""
    
    delete = await notification_collection.delete_many({"email": current_user['email']})

    return {
        "status": "success",
        "message": f"Cleared {delete.deleted_count} notifications."
    }