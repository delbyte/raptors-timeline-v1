import sqlite3
from contextlib import contextmanager
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_PATH = os.getenv("DATABASE_PATH", "./hackathons.db")

def init_db():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS hackathons (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                start_date TEXT NOT NULL,
                invitation_sent INTEGER DEFAULT 0,
                registration_ended INTEGER DEFAULT 0,
                submission_deadline INTEGER DEFAULT 0,
                judging_period INTEGER DEFAULT 0,
                thank_you_sent INTEGER DEFAULT 0
            )
        """)
        conn.commit()

@contextmanager
def get_db():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()