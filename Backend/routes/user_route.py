from fastapi import APIRouter, HTTPException, Depends
from Database.Schemas.Users_Schema import UpdateAbout , EducationSchema , workexperienceSchema, workexperienceSchema1
from middleware import get_current_user
from Database.connect import db
from pymongo.errors import PyMongoError
from pydantic.networks import HttpUrl
from bson import ObjectId
from fastapi.encoders import jsonable_encoder
from uuid import uuid4
from fastapi import Query

user_route = APIRouter()
users = db.get_collection("Users") 
saved_jobs = db.get_collection("savedjobs") 
jobs_collection = db.get_collection("Jobs")
applicants_collection = db.get_collection("applicants")
@user_route.get("/profile", response_model=dict)
async def get_user_profile(current_user=Depends(get_current_user)):
    """Fetch the authenticated user's profile"""
    email = current_user["email"]

    try:
        user = await users.find_one({"email": email}, {"_id": 0})  # Exclude _id from response

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return {"status": "success", "data": user}

    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
@user_route.get("/profile/view", response_model=dict)
async def delete_user_education(
    user_mail: str = Query(..., description="The ID of the experience to delete") 
):
    """Delete a specific work experience entry from the user's profile"""
    email = user_mail

    try:
        user = await users.find_one({"email": email}, {"_id": 0}) 
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return {"status": "success", "data": user}

    except PyMongoError:
        raise HTTPException(status_code=500, detail="Database delete failed")

@user_route.put("/profile_update", response_model=UpdateAbout)
async def update_user_profile(user_data: UpdateAbout, current_user=Depends(get_current_user)):
    """Update the authenticated user's profile"""
    email = current_user["email"]   

    try:
        update_data = {
            k: (str(v) if isinstance(v, HttpUrl) else v) 
            for k, v in user_data.dict(exclude_unset=True).items()
        }

        
        if not update_data:
            raise HTTPException(status_code=400, detail="No valid fields provided for update")

        result = await users.update_one({"email": email}, {"$set": update_data})

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")

        return {"status": "success"}

    except PyMongoError as e:
        raise HTTPException(status_code=500, detail="Database update failed")
    
@user_route.post("/profile/education", response_model=dict)
async def add_education(education_data: EducationSchema, current_user=Depends(get_current_user)):
    """Add education details to the authenticated user's profile"""
    email = current_user["email"]

    try:
        user = await users.find_one({"email": email})

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Ensure 'education' is a list
        if "education" not in user or not isinstance(user["education"], list):
            await users.update_one({"email": email}, {"$set": {"education": []}})

        # Add a unique ID to the education entry
        new_education = education_data.dict()
        new_education["id"] = str(uuid4())  # Assign unique UUID

        # Push new education into the array
        result = await users.update_one(
            {"email": email},
            {"$push": {"education": new_education}}
        )

        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Education not added")

        return {"status": "success", "message": "Education added successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


    
@user_route.put("/profile_update/education", response_model=dict)
async def update_user_education(education_data: EducationSchema, current_user=Depends(get_current_user)):
    """Update the authenticated user's education details"""
    email = current_user["email"]  

    try:
        update_data = {"education": education_data.dict()}   

        result = await users.update_one({"email": email}, {"$set": update_data})

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")

        return {"status": "success", "message": "Education updated successfully"}

    except PyMongoError:
        raise HTTPException(status_code=500, detail="Database update failed")

@user_route.delete("/profile/education", response_model=dict)
async def delete_user_education(
    experience_id: str = Query(..., description="The ID of the experience to delete"),
    current_user=Depends(get_current_user)
):
    """Delete a specific work experience entry from the user's profile"""
    email = current_user["email"]

    try:
        result = await users.update_one(
            {"email": email},
            {"$pull": {"education": {"id": experience_id}}}
        )

        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Experience not found or already deleted")

        return {"status": "success", "message": "Work experience deleted successfully"}

    except PyMongoError:
        raise HTTPException(status_code=500, detail="Database delete failed")   

@user_route.post("/profile/work_experience", response_model=dict)
async def add_experience(work: workexperienceSchema, current_user=Depends(get_current_user)):
    """Add work experience details to the authenticated user's profile"""
    email = current_user["email"]

    try:
        user = await users.find_one({"email": email})

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Ensure 'experience' is a list
        if "experience" not in user or not isinstance(user["experience"], list):
            await users.update_one({"email": email}, {"$set": {"experience": []}})

        # Add a unique ID to the experience entry
        new_experience = work.dict()
        new_experience["id"] = str(uuid4())

        # Push new experience into the array
        result = await users.update_one(
            {"email": email},
            {"$push": {"experience": new_experience}}
        )

        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Experience not added")

        return {"status": "success", "message": "Experience added successfully"}

    except PyMongoError as e:
        print(f"Database error: {e}")  # Optional for debugging
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    

@user_route.put("/profile/work_experience", response_model=dict)
async def update_user_experience(work: workexperienceSchema1, current_user=Depends(get_current_user)):
    """Update a specific work experience entry in the user's profile"""
    email = current_user["email"]
    experience_id = work.id  # Make sure your schema includes this field

    try:
        # Match the user and the specific experience entry by ID
        result = await users.update_one(
            {"email": email, "experience.id": experience_id},
            {"$set": {
                "experience.$.company_name": work.company_name,
                "experience.$.position": work.position,
                "experience.$.start_date": work.start_date,
                "experience.$.end_date": work.end_date,
                "experience.$.description": work.description
            }}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Experience entry not found")

        return {"status": "success", "message": "Work experience updated successfully"}

    except PyMongoError:
        raise HTTPException(status_code=500, detail="Database update failed")
    
@user_route.delete("/profile/work_experience", response_model=dict)
async def delete_user_experience(
    experience_id: str = Query(..., description="The ID of the experience to delete"),
    current_user=Depends(get_current_user)
):
    """Delete a specific work experience entry from the user's profile"""
    email = current_user["email"]

    try:
        result = await users.update_one(
            {"email": email},
            {"$pull": {"experience": {"id": experience_id}}}
        )

        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Experience not found or already deleted")

        return {"status": "success", "message": "Work experience deleted successfully"}

    except PyMongoError:
        raise HTTPException(status_code=500, detail="Database delete failed")


    
from pydantic import BaseModel

class JobSaveRequest(BaseModel):
    job_id: str

@user_route.post("/savedjobs")
async def savedjobs(payload: JobSaveRequest, current_user=Depends(get_current_user)):
    email = current_user["email"]
    try: 
        await saved_jobs.update_one(
            {"email": email},
            {"$addToSet": {"job_id": payload.job_id}},   
            upsert=True
        )               
        return {"message": "Job saved successfully"}
    except PyMongoError:
        raise HTTPException(status_code=500, detail="Savedjobs failed")
    
@user_route.put("/unsavedjobs")
async def savedjobs(payload: JobSaveRequest, current_user=Depends(get_current_user)):
    email = current_user["email"]
    try: 
        await saved_jobs.update_one(
            {"email": email},
            {"$pull": {"job_id": payload.job_id}}
        )
        return {"message": "Job Unsaved successfully"}
    except PyMongoError:
        raise HTTPException(status_code=500, detail="UnSavedjobs failed")
    
@user_route.get("/getsavedjobs")
async def get_saved_jobs(current_user=Depends(get_current_user)):
    email = current_user["email"]
    try:
        user_data = await saved_jobs.find_one({"email": email})
        job_ids = user_data.get("job_id", []) if user_data else []
        return {"job_ids": job_ids}
    except PyMongoError:
        raise HTTPException(status_code=500, detail="Failed to fetch saved jobs")
    

@user_route.get("/jobseekerdashboard")
async def jobseeker_dashboard(current_user=Depends(get_current_user)):
    email = current_user["email"]
    
    # Count total applied jobs
    applied_jobs = await applicants_collection.count_documents({"user_email": email})
    
    # Count approved jobs
    approved_jobs = await applicants_collection.count_documents({"user_email": email, "applicant_status": "Approved"})
    
    # Count pending jobs
    pending_jobs = await applicants_collection.count_documents({"user_email": email, "applicant_status": "Hold"})
    
    # Get recent applications
    recent_applications_cursor = applicants_collection.find({"user_email": email}).sort("applicant_date", -1).limit(3)
    recent_applications = await recent_applications_cursor.to_list(length=None)
    
    # Convert ObjectId to string and remove _id field
    def prepare_application(app):
        app_dict = dict(app)
        app_dict['_id'] = str(app_dict['_id'])
        return app_dict

    recent_applications = [prepare_application(app) for app in recent_applications] 
    
    return jsonable_encoder({
        "applied_jobs": applied_jobs,
        "approved_jobs": approved_jobs,
        "pending_jobs": pending_jobs,
        "recent_applications": recent_applications
    })
