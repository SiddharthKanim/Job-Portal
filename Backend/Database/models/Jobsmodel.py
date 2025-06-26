from datetime import datetime
from bson import ObjectId
from Database.connect import get_collection
from Database.Schemas.Job_Schema import JobCreateSchema, JobUpdateSchema
from Database.connect import db
 
jobs_collection = db.get_collection("Jobs")  

class Jobmodels:
    @staticmethod
    async def create_jobs(job_data: JobCreateSchema):
        try:
            job_dict = job_data.dict()

            # Convert date fields to string format (ISO 8601) before inserting
            job_dict["posted_date"] = job_dict["posted_date"].isoformat()
            if job_dict["deadline"]:
                job_dict["deadline"] = job_dict["deadline"].isoformat()

            result = await jobs_collection.insert_one(job_dict)
            return {"id": str(result.inserted_id)}
        except Exception as e:
            return {"error": str(e)}

    
    @staticmethod
    async def get_jobs_by_email(email: str):
        """Fetch all active job postings by user email"""
        try:
            cursor = jobs_collection.find({"email": email, "status": "active"})
            print("Cursor: ", cursor)
            jobs = await cursor.to_list(length=None)
            for job in jobs:
                job["_id"] = str(job["_id"])
            print("Jobs: ", jobs)
            return jobs  
        except Exception as e:
            return {"error": "Failed to fetch jobs. Please try again later."}


    @staticmethod
    async def get_job_by_id(job_id: str):
        try:
            job = await jobs_collection.find_one({"_id": ObjectId(job_id)})
            if job:
                return job
            return None
        except Exception as e:
            return {"error": str(e)}

    @staticmethod
    async def update_job(job_id: str, job_update: JobUpdateSchema):
        try:
            update_data = {k: v for k, v in job_update.dict(exclude_unset=True).items() 
                            if v is not None}
            
            # Convert date fields if present
            if "deadline" in update_data:
                update_data["deadline"] = update_data["deadline"].isoformat()

            result = await jobs_collection.update_one(
                {"_id": ObjectId(job_id)},
                {"$set": update_data}
            )
            
            if result.modified_count == 0:
                return {"error": "Job not found or no changes made"}
            return {"message": "Job updated successfully"}
        except Exception as e:
            return {"error": str(e)}

    @staticmethod
    async def delete_job(job_id: str):
        try:
            result = await jobs_collection.delete_one({"_id": ObjectId(job_id)})
            if result.deleted_count == 0:
                return {"error": "Job not found"}
            return {"message": "Job deleted successfully"}
        except Exception as e:
            return {"error": str(e)}

    @staticmethod
    async def get_all_jobs():
        """Fetch all job postings with status 'inactive'"""
        try:
            cursor = jobs_collection.find({"status": "active"})  # <-- Filter here
            jobs = await cursor.to_list(length=None)

            if not jobs:
                return []  # Return empty list if no jobs are found

            for job in jobs:
                job["_id"] = str(job["_id"])  # Convert ObjectId to string
                job["JobId"] = job["_id"]     # Optional: add JobId field

            return jobs
        except Exception as e:
            print(f"Error fetching jobs: {e}")
            return {"error": "Failed to fetch inactive jobs."}  # Return an empty list instead of raising an error
        
     




