from pydantic import BaseModel

class DifficultyLevelResponse(BaseModel):
    id: int
    name: str
    description: str
    min_duration: int
    max_duration: int
    prep_time: int

    class Config:
        from_attributes = True