from pydantic import BaseModel
from typing import Optional, Dict

class WorkflowStepBase(BaseModel):
    name: str
    action_type: str
    config: Optional[Dict] = None
    position_x: Optional[float] = 0
    position_y: Optional[float] = 0
    next_step_id: Optional[int] = None

class WorkflowStepCreate(WorkflowStepBase):
    pass 

class WorkflowStepUpdate(BaseModel):
    name: Optional[str] = None
    action_type: Optional[str] = None
    config: Optional[Dict] = None
    position_x: Optional[float] = None
    position_y: Optional[float] = None
    next_step_id: Optional[int] = None

class WorkflowStepResponse(WorkflowStepBase):
    id: int
    class Config:
        orm_mode = True
