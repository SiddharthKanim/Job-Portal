from datetime import datetime
from bson import ObjectId
from Database.connect import get_collection
from Database.Schemas.Job_Schema import ApplicantSchema
from Database.connect import db
import base64
 
applicants_collection = db.get_collection("applicants")   
 
 

class JobApplicants:
    @staticmethod
    async def create_applicants(user_email: str):
        pass
        
