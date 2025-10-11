from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from database import get_db
import models, utils
from schemas import project_schemas
from fastapi.security import OAuth2PasswordBearer

router = APIRouter(prefix="/projects", tags=["Projects"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.encode(token, utils.SECRET_KEY, algorithms=[utils.ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token2")
    
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=project_schemas.ProjectResponse)
def create_project(project: project_schemas.ProjectCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    new_project = models.Project(
        name=project.name,

        description=project.description,
        owner_id=current_user.id
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

@router.get("/", response_model=list[project_schemas.ProjectResponse])
def get_projects(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    projects = db.query(models.Project).filter(models.Project.owner_id == current_user.id).all()
    return projects

@router.post("/{project_id}/tasks", response_model=project_schemas.TaskResponse)
def add_task(project_id: int, task: project_schemas.TaskCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    project = db.query(models.Project).filter(models.Project.id == project_id, models.Project.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    new_task = models.Task(title=task.title, description=task.description, project_id=project_id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task