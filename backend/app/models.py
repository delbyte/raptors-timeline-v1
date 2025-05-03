from pydantic import BaseModel
from datetime import datetime

class HackathonBase(BaseModel):
    name: str
    start_date: datetime

class HackathonCreate(HackathonBase):
    pass

class Hackathon(HackathonBase):
    id: int
    invitation_sent: bool
    registration_ended: bool
    submission_deadline: bool
    judging_period: bool
    thank_you_sent: bool

    class Config:
        from_attributes = True