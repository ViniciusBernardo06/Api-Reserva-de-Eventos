# app/schemas.py

from pydantic import BaseModel, EmailStr
import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserPublic(BaseModel):
    id: int
    email: EmailStr
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

class EventBase(BaseModel):
    title: str
    description: str | None = None
    date: datetime.datetime
    location: str

class EventCreate(EventBase):
    pass

class EventPublic(EventBase):
    id: int
    owner_id: int
    owner: UserPublic
    class Config:
        from_attributes = True