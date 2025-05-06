import logging
from .database import get_db
from .models import HackathonCreate
from datetime import datetime, timedelta, timezone

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_hackathon(hackathon: HackathonCreate):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO hackathons (name, start_date) VALUES (?, ?)",
            (hackathon.name, hackathon.start_date.isoformat())
        )
        conn.commit()
        return cursor.lastrowid

def get_hackathons():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM hackathons")
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

def get_hackathon_by_id(hackathon_id: int):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM hackathons WHERE id = ?", (hackathon_id,))
        row = cursor.fetchone()
        return dict(row) if row else None

def update_hackathon_status(hackathon_id: int, fields: dict):
    with get_db() as conn:
        cursor = conn.cursor()
        set_clause = ", ".join(f"{k} = ?" for k in fields.keys())
        values = list(fields.values()) + [hackathon_id]
        cursor.execute(f"UPDATE hackathons SET {set_clause} WHERE id = ?", values)
        conn.commit()

def delete_hackathon(hackathon_id: int):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM hackathons WHERE id = ?", (hackathon_id,))
        conn.commit()

def check_and_update_hackathons():
    now = datetime.now(timezone.utc)  # Make now timezone-aware in UTC
    hackathons = get_hackathons()
    logger.info(f"Checking hackathons at {now}")
    for hackathon in hackathons:
        start_date = datetime.fromisoformat(hackathon["start_date"])
        milestones = {
            "invitation_sent": start_date - timedelta(weeks=4),
            "registration_ended": start_date,
            "submission_deadline": start_date + timedelta(days=3),
            "judging_period": start_date + timedelta(days=16),
            "thank_you_sent": start_date + timedelta(days=23),  # 16 + 7
        }
        updates = {}
        for milestone, date in milestones.items():
            if now >= date and not hackathon[milestone]:
                updates[milestone] = 1
                logger.info(f"Marking {milestone} as completed for hackathon {hackathon['id']}")
        if updates:
            logger.info(f"Updating hackathon {hackathon['id']} with {updates}")
            update_hackathon_status(hackathon['id'], updates)
            # Fetch the updated hackathon to check if all milestones are complete
            updated_hackathon = get_hackathon_by_id(hackathon['id'])
            if updated_hackathon and all(updated_hackathon[m] for m in ["invitation_sent", "registration_ended", "submission_deadline", "judging_period", "thank_you_sent"]):
                logger.info(f"Deleting hackathon {hackathon['id']} - all milestones complete")
                delete_hackathon(hackathon["id"])
        else:
            logger.info(f"No updates for hackathon {hackathon['id']}")
            # Still check if all milestones are complete (in case they were already complete)
            if all(hackathon[m] for m in ["invitation_sent", "registration_ended", "submission_deadline", "judging_period", "thank_you_sent"]):
                logger.info(f"Deleting hackathon {hackathon['id']} - all milestones complete")
                delete_hackathon(hackathon["id"])