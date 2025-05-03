# Hackathon Raptors Timeline
A website to display a timeline of current and upcoming hackathons for Hackathon Raptors.
# Setup
## Backend

1. Navigate to ```backend/```.
2. Create a virtual environment: python -m venv venv.
3. Activate it: source venv/bin/activate (Linux/Mac) or venv\Scripts\activate (Windows).
4. Install dependencies: pip install -r requirements.txt.
5. Create a .env file with:
```
DATABASE_PATH=./hackathons.db
SECRET_SITE=[enter site]
```

7. Run the server: uvicorn app.main:app --host 0.0.0.0 --port 8000.

## Frontend

1. Ensure the frontend/ directory is correctly placed relative to backend/.
2. The frontend is served via FastAPI's static file mounting.
3. Access the main timeline at http://localhost:8000/templates/index.html.
4. Access the organization page at http://localhost:8000/templates/org.html.

## Features

1. Main Timeline: Vertical timeline of hackathons, ordered by start date.
2. Hackathon Details: Click a hackathon to expand a mini-timeline to the right with milestone dates.
3. Organization Page: Add hackathons via a secret URL (/api/hackathons/secret-raptor-2025).
4. Automatic Updates: Backend checks UTC time hourly to mark completed milestones and delete fully completed hackathons.
5. Frontend Polling: Refreshes every minute to reflect updates.
6. Completion Styling: Completed milestones show a strikethrough and green tick.

## Notes

1. All dates are in UTC.
2. SQLite3 is used for simplicity.
3. Errors are logged to the terminal only.

