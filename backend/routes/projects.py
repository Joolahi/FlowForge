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
        payload = jwt.decode(token, utils.SECRET_KEY, algorithms=[utils.ALGORITHM])
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
def get_projects(
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
    ):
    projects = db.query(models.Project).filter(models.Project.owner_id == current_user.id).all()

    # Counting progress to project
    for project in projects:
        total_task = len(project.tasks)
        if total_task > 0:
            done_task = len([d for d in project.tasks if d.status == models.TaskStatus.DONE])
            project.progress = round((done_task/total_task) * 100, 2)
        else: 
            project.progress = 0.0
    return projects

@router.post("/{project_id}/tasks", response_model=project_schemas.TaskResponse)
def add_task(project_id: int, task: project_schemas.TaskCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    project = db.query(models.Project).filter(models.Project.id == project_id, models.Project.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    new_task = models.Task(title=task.title, description=task.description, project_id=project_id, status=task.status or models.TaskStatus.TODO)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.put(
    "/{project_id}/tasks/{task_id}", response_model=project_schemas.TaskUpdateResponse
)
def update_task(
    project_id: int,
    task_id: int,
    task_update: project_schemas.TaskUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    task = (
        db.query(models.Task)
        .join(models.Project)
        .filter(
            models.Task.id == task_id,
            models.Project.id == project_id,
            models.Project.owner_id == current_user.id,
        )
        .first()
    )
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Päivitä tehtävän kentät
    if task_update.title is not None:
        task.title = task_update.title
    if task_update.description is not None:
        task.description = task_update.description
    if task_update.is_completed is not None:
        task.is_completed = task_update.is_completed
    if task_update.status is not None:
        task.status = task_update.status

    db.commit()
    db.refresh(task)

    # ✅ Lasketaan projektin eteneminen
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    total_tasks = len(project.tasks)
    done_tasks = len([t for t in project.tasks if t.status == models.TaskStatus.DONE])
    progress = round((done_tasks / total_tasks) * 100, 2) if total_tasks > 0 else 0.0

    # Palautetaan päivitetty tehtävä ja laskettu progress
    return {"task": project_schemas.TaskResponse.from_orm(task), "progress": progress}


@router.delete("/{project_id}/tasks/{task_id}")
def delete_task(project_id: int, task_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    task = (
        db.query(models.Task)
        .join(models.Project)
        .filter(
            models.Task.id == task_id,
            models.Project.id == project_id,
            models.Project.owner_id == current_user.id,
        ).first()
    )

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}
