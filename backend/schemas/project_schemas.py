from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None

class TaskCreate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id: int
    is_completed: bool
    created_at: datetime

    class Config:
        orm_mode = True

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    tasks: List[TaskResponse] = []

    class Config:
        orm_mode = True