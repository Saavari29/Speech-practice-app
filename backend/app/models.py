from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from app.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key = True)
    name = Column(String(255))
    email = Column(String(255), unique = True)
    password = Column(String(255))
    created_date = Column(DateTime, default = datetime.utcnow)


class DifficultyLevel(Base):
    __tablename__ = "difficulty_level"

    id =Column(Integer, primary_key = True)
    name =Column(String(255))
    description =Column(Text)
    min_duration =Column(Integer)
    max_duration =Column(Integer)
    prep_time =Column(Integer)


class Speech(Base):
    __tablename__ = "speeches"

    id = Column(Integer, primary_key = True)
    user_id = Column(Integer, ForeignKey("users.id"))
    difficulty_level_id = Column(Integer, ForeignKey("difficulty_level.id"))
    audio_file = Column(String(255))
    date = Column(DateTime)
    topic = Column(String(255))
    duration = Column(Integer)
    transcript = Column(Text)
    

class Analysis(Base):
    __tablename__ = "analysis"


    id = Column(Integer, primary_key = True)
    speech_id = Column(Integer, ForeignKey("speeches.id"))
    transcript = Column(Text, nullable= True)
    transcript_highlighted = Column(Text)
    filler_words_list = Column(Text)
    filler_words_count = Column(Integer)
    pace_wpm = Column(Integer)
    relevance_score = Column(Integer)
    tone_consistency_score = Column(Integer)
    overall_feedback = Column(Text)
    created_date = Column(DateTime, default = datetime.utcnow)