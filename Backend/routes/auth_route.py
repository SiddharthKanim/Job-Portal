from fastapi import APIRouter, HTTPException, Depends
from Database.models.Usermodel import UserModel
from Database.Schemas.Users_Schema import UserSchema, LoginSchema , verifyEmailSchema , forgotpassword , verifyotp
from Database.utils.security import hash_password, verify_password
from utils.auth import create_access_token
from datetime import timedelta
from Database.connect import db
from utils.email import send_mail
from data.otp_map import otp_storage
import random
auth_router = APIRouter()
users = db.get_collection("Users")
@auth_router.post("/signup")
async def signup(user: UserSchema):
    """Register a new user in the database."""
    result = await UserModel.create_user(user)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    
    # Create access token for the new user
    access_token = create_access_token(
        data={"sub": str(result["user_id"]), "mobile": user.mobileNumber,"email":user.email,"fullname": result['fullname'],"companyname": result['companyname']}
    )
    return {
        "message": "User registered successfully",
        "user_id": result["user_id"],
        "access_token": access_token,
        "token_type": "bearer"
    }

@auth_router.post("/login")
async def login(user: LoginSchema):
    """Authenticate user login."""
    result = await UserModel.authenticate_user(user)
    if "error" in result:
        raise HTTPException(status_code=401, detail=result["error"])
    print(result)
    # Create access token
    access_token = create_access_token(
        data={"sub": str(result["user_id"]), "mobile": user.mobileNumber ,"jobType":
               result.get("jobType", "user"),"email":result.get("email","user"),"fullname": result['fullname'],"companyname": result['companyname']}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": result["user_id"]
    }

@auth_router.post("/verifyemail")
async def verify_email(user: verifyEmailSchema):
    """Verify user email."""
    result = await users.find_one({"email": user.email})
    if not result:
        raise HTTPException(status_code=400, detail="Error in verifying email")
    return {"message": "Email verified successfully"}


@auth_router.post("/sendotp")
async def otp_send(user: verifyEmailSchema):
    """Send a 6-digit OTP to the user's email."""
    try:
        otp = random.randint(100000, 999999)  
        otp_storage[user.email] = otp
        result = send_mail(
            subject="Your OTP Code",
            body=f"Your OTP is {otp}",
            recipient_email=user.email
        )
 
 
        return {
            "message": "OTP sent successfully"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@auth_router.post("/verifyotp")
async def otp_verify(data: verifyotp):
    """Verify the OTP sent to the user's email."""
    try:
        print(otp_storage)
        stored_otp = otp_storage.get(data.email)
        if stored_otp is None:
            raise HTTPException(status_code=404, detail="OTP not found for this email")
        if data.otp != stored_otp:
            raise HTTPException(status_code=400, detail="Invalid OTP")
        del otp_storage[data.email]
        return {"message": "OTP verified successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@auth_router.post("/forgotpassword")
async def forgot_password(user: forgotpassword):
    """Send a password reset link to the user's email."""
    try:
        user_data = await users.find_one({"email": user.email})
        if "error" in user_data:
            raise HTTPException(status_code=400, detail=user_data["error"]) 
        raw_password = user.password
        hasher = hash_password(raw_password)
        update_password = await users.update_one({"email": user.email}, {"$set": {"password": hasher}})
        
        result = send_mail(
            subject="Password Reset Link",
            body=f"Your password has changed",
            recipient_email=user.email
        )
 
        return {
            "message": "Password reset link sent successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    