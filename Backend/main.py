from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import job_route, auth_route
from Database.connect import check_connection

app = FastAPI(title="Job Portal API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    """Initialize database connection on startup"""
    await check_connection()

# Include routers
app.include_router(auth_route.auth_router, prefix="/api/v1/auth", tags=["authentication"])
app.include_router(job_route.router, prefix="/api/v1", tags=["jobs"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
