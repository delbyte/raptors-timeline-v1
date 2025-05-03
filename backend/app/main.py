from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from .database import init_db
from .crud import create_hackathon, get_hackathons, check_and_update_hackathons
from .schemas import HackathonCreateSchema, HackathonSchema
from apscheduler.schedulers.background import BackgroundScheduler
from dotenv import load_dotenv
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
app.mount("/static", StaticFiles(directory="../static"), name="static")
app.mount("/templates", StaticFiles(directory="../frontend/templates"), name="templates")
app.mount("/assets", StaticFiles(directory="../frontend/assets"), name="assets")

load_dotenv()
SECRET_SLUG = os.getenv("SECRET_SLUG", "secret-raptor-2025")

@app.on_event("startup")
def startup_event():
    init_db()
    # Run the update immediately on startup
    check_and_update_hackathons()
    logger.info("Initial hackathon update completed on startup")
    
    # Schedule future updates
    scheduler = BackgroundScheduler()
    scheduler.add_job(check_and_update_hackathons, "interval", hours=1)
    scheduler.start()
    logger.info("Application started and scheduler initialized")

@app.on_event("shutdown")
def shutdown_event():
    scheduler.shutdown()
    logger.info("Scheduler shut down")

@app.get("/api/hackathons", response_model=list[HackathonSchema])
async def read_hackathons():
    try:
        hackathons = get_hackathons()
        return hackathons
    except Exception as e:
        logger.error(f"Error fetching hackathons: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/api/hackathons/{slug}", response_model=HackathonSchema)
async def add_hackathon(slug: str, hackathon: HackathonCreateSchema):
    if slug != SECRET_SLUG:
        logger.error(f"Invalid slug: {slug}")
        raise HTTPException(status_code=403, detail="Invalid slug")
    try:
        hackathon_id = create_hackathon(hackathon)
        return {**hackathon.dict(), "id": hackathon_id, "invitation_sent": False, "registration_ended": False, "submission_deadline": False, "judging_period": False, "thank_you_sent": False}
    except Exception as e:
        logger.error(f"Error creating hackathon: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")