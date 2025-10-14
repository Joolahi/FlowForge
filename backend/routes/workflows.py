from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
from schemas import workflow_schemas
from routes.projects import get_current_user

router = APIRouter(prefix="/workflows", tags=["Workflows"])


@router.get("/{project_id}", response_model=list[workflow_schemas.WorkflowStepResponse])
def get_workflow(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    project = (
        db.query(models.Project)
        .filter_by(id=project_id, owner_id=current_user.id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    steps = db.query(models.WorkflowStep).filter_by(project_id=project_id).all()
    return steps


@router.post("/{project_id}", response_model=workflow_schemas.WorkflowStepResponse)
def add_step(
    project_id: int,
    step: workflow_schemas.WorkflowStepCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    project = (
        db.query(models.Project)
        .filter_by(id=project_id, owner_id=current_user.id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    new_step = models.WorkflowStep(
        project_id=project_id,
        name=step.name,
        action_type=step.action_type,
        config=step.config,
        position_x=step.position_x,
        position_y=step.position_y,
        next_step_id=step.next_step_id,
    )
    db.add(new_step)
    db.commit()
    db.refresh(new_step)
    return new_step


@router.put("/{step_id}", response_model=workflow_schemas.WorkflowStepResponse)
def update_step(
    step_id: int,
    step_update: workflow_schemas.WorkflowStepUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    step = (
        db.query(models.WorkflowStep)
        .join(models.Project)
        .filter(
            models.WorkflowStep.id == step_id,
            models.Project.owner_id == current_user.id,
        )
        .first()
    )

    if not step:
        raise HTTPException(status_code=404, detail="Step not found")

    for key, value in step_update.dict(exclude_unset=True).items():
        setattr(step, key, value)

    db.commit()
    db.refresh(step)
    return step


@router.delete("/{step_id}")
def delete_step(
    step_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    step = (
        db.query(models.WorkflowStep)
        .join(models.Project)
        .filter(
            models.WorkflowStep.id == step_id,
            models.Project.owner_id == current_user.id,
        )
        .first()
    )

    if not step:
        raise HTTPException(status_code=404, detail="Step not found")

    db.delete(step)
    db.commit()
    return {"message": "Step deleted successfully"}
