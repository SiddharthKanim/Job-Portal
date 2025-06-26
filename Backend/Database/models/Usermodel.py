from Database.connect import db
from Database.utils.security import hash_password, verify_password
from Database.Schemas.Users_Schema import UserSchema, LoginSchema
from bson import ObjectId
from datetime import datetime, timedelta
from fastapi import HTTPException

# Get reference to users collection
users = db.get_collection("Users")

class UserModel:
    @staticmethod
    async def create_user(user_data: UserSchema):
        """Insert a new user into the database after checking if username/email exists."""
        # Check if mobile number 
        existing_mobile = await users.find_one({"mobileNumber": user_data.mobileNumber})
        if existing_mobile:
            return {"error": "Mobile Number already exists"}
        
        # Check if email exists
        existing_email = await users.find_one({"email": user_data.email})
        if existing_email:
            return {"error": "Email already exists"}
        
        # Create user
        user_dict = user_data.dict()
        user_dict["password"] = hash_password(user_dict["password"]) 
        user_dict["full_name"] = user_dict["firstName"] + " " + user_dict["lastName"]
        result = await users.insert_one(user_dict)
        return {"user_id": str(result.inserted_id),"fullname": user_dict["full_name"],"companyname": user_dict['companyName']}

    @staticmethod
    async def authenticate_user(data: LoginSchema):
        """Authenticate a user by verifying the hashed password."""
        user = await users.find_one({"mobileNumber": data.mobileNumber})
        
        if not user:
            return {"error": "Invalid mobile number or password"}
        
        if not verify_password(data.password, user["password"]):
            return {"error": "Invalid mobile number or password"}

        print("user :- ",user)
        return {

            "user_id": str(user["_id"]),
            "mobile": user["mobileNumber"],
            "jobType":user["jobType"],
            "email":user["email"],
            "fullname": user["full_name"],
            "companyname": user['companyName']
        }
