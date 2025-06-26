from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
import uvicorn
import os
from dotenv import load_dotenv
from routes.auth_route import auth_router
from routes.job_route import job_route
from routes.user_route import user_route
from routes.applicant_route import applicant_route
from pymongo import MongoClient
from Database.connect import check_connection
from fastapi.middleware.cors import CORSMiddleware
# from middleware import AuthenticationMiddleware  # Import the middleware
from fastapi.staticfiles import StaticFiles

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
 
app.include_router(auth_router, prefix="/auth")
app.include_router(job_route, prefix="/job")
app.include_router(user_route, prefix="/user")
app.include_router(applicant_route, prefix="/applicant")


# CORS settings
origins = [
    "tauri://localhost",
    "http://localhost:1420",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change "*" to specific frontend URL for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load authentication tokens from environment variables
# ALLOWED_TOKENS = os.getenv("ALLOWED_TOKENS", "").split(",")

# Add authentication middleware
# app.add_middleware(AuthenticationMiddleware, allowed_tokens=ALLOWED_TOKENS)

@app.get("/")
async def root():
    return {"message": "Welcome to the Job Portal API"}

if __name__ == "__main__":
    check_connection()
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
