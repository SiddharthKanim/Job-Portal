from motor.motor_asyncio import AsyncIOMotorClient

# MongoDB connection URI (local instance)
MONGO_URI = "mongodb://localhost:27017/"

# Create an async MongoDB client
client = AsyncIOMotorClient(MONGO_URI)

# Select a database (replace 'my_database' with your actual database name)
db = client.JobPortal1

# Function to get a collection
def get_collection(collection_name):
    return db[collection_name]

# Function to check database connection
async def check_connection():
    try:
        await client.admin.command("ping")
        print("✅ Connected to MongoDB!")
        return True
    except Exception as e:
        print(f"❌ Error connecting to MongoDB: {e}")
        return False