from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database, auth

router = APIRouter(prefix="/services", tags=["services"])

@router.post("/", response_model=schemas.Service)
def create_service(service: schemas.ServiceCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_service = models.Service(**service.dict())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

@router.get("/", response_model=List[schemas.Service])
def read_services(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    services = db.query(models.Service).offset(skip).limit(limit).all()
    return services

@router.get("/{service_id}", response_model=schemas.Service)
def read_service(service_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if db_service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    return db_service

@router.put("/{service_id}", response_model=schemas.Service)
def update_service(service_id: int, service: schemas.ServiceCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if db_service is None:
        raise HTTPException(status_code=404, detail="Service not found")

    for var, value in vars(service).items():
        setattr(db_service, var, value) if value is not None else None

    db.commit()
    db.refresh(db_service)
    return db_service

@router.delete("/{service_id}")
def delete_service(service_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.RoleChecker(["Admin"]))):
    db_service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if db_service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    db.delete(db_service)
    db.commit()
    return {"message": "Service deleted"}
