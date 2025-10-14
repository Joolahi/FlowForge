from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Enum, JSON, Float
from database import Base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)

    # Users projects
    projects = relationship("Project", back_populates="owner")

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow())
    
    # User that owns a project
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="projects")

    # Tasks in the project
    tasks = relationship("Task", back_populates="project")

    #Workflow steps
    workflow_steps = relationship("WorkflowStep", back_populates="project")

class TaskStatus(str, enum.Enum):
    TODO = "To Do"
    IN_PROGRESS = "In Progress"
    DONE = "Done"

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    is_completed = Column(Boolean, default=False)
    status = Column(Enum(TaskStatus), default=TaskStatus.TODO)
    created_at = Column(DateTime, default=datetime.utcnow)

    project_id = Column(Integer, ForeignKey("projects.id"))
    project = relationship("Project", back_populates="tasks")

class WorkflowStep(Base):
    __tablename__ = "workflow_steps"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    name = Column(String, nullable=False)
    action_type = Column(String, nullable=False)
    config = Column(JSON, nullable=True)
    position_x = Column(Float, default=0)
    position_y = Column(Float, default=0)
    next_step_id = Column(Integer, ForeignKey("workflow_steps.id"), nullable=True)

    project = relationship("Project", back_populates="workflow_steps", foreign_keys=[project_id])
    next_step = relationship("WorkflowStep", remote_side=[id])

