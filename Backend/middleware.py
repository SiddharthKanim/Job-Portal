from Database.connect import db
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends, HTTPException
import os
from dotenv import load_dotenv
from jose import jwt
load_dotenv()

users = db.get_collection("Users")

# Get JWT settings from environment variables or use defaults
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

bearer_scheme = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    """ Authenticate user using JWT token and verify if the email exists in the database """
    token = credentials.credentials  

   
    payload = jwt.decode(token,SECRET_KEY, algorithms=["HS256"],options={"verify_signature": False})
    print("Payload:", payload) 
    
    user_data = payload
    if not user_data or "mobile" not in user_data:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user_email = user_data["mobile"]

    user = await users.find_one({"mobileNumber": user_email})

    if not user:
        raise HTTPException(status_code=401, detail="User not found in database")
    
    return user_data
   