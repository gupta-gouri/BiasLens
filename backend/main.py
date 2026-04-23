from fastapi import FastAPI
from routes.analyze import router as analyze_router 
from dotenv import load_dotenv
load_dotenv()   

app = FastAPI()

app.include_router(analyze_router)