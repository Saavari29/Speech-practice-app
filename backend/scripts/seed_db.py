from app.database import SessionLocal
from app.models import DifficultyLevel

db = SessionLocal()

levels = [
    DifficultyLevel(
        
    name = "Easy",
    description = "The topics given will be easier and you will get more time to prepare",
    min_duration = 60,
    max_duration = 120,
    prep_time = 120
    ),

    DifficultyLevel(
        name = "Medium",
    description = "You will get moderately complex topic and 1 min 30 sec to prepare",
    min_duration = 120,
    max_duration = 240,
    prep_time = 90
    ),

    DifficultyLevel(
        name = "Hard",
    description = "The topic given will be complex with a minute to prepare",
    min_duration = 60,
    max_duration = 120,
    prep_time = 180
    )
]

db.add_all(levels)
db.commit()
db.close()

print("Difficulty levels seeded successfully")