from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database, auth

router = APIRouter(prefix="/properties", tags=["properties"])

@router.post("/", response_model=schemas.Property)
def create_property(property: schemas.PropertyCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_property = models.Property(**property.dict())
    db.add(db_property)
    db.commit()
    db.refresh(db_property)
    return db_property

@router.get("/", response_model=List[schemas.Property])
def read_properties(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    properties = db.query(models.Property).offset(skip).limit(limit).all()
    return properties

@router.get("/owner/{owner_id}", response_model=List[schemas.Property])
def read_properties_by_owner(owner_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    properties = db.query(models.Property).filter(models.Property.owner_id == owner_id).all()
    return properties

@router.get("/{property_id}", response_model=schemas.Property)
def read_property(property_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_property = db.query(models.Property).filter(models.Property.id == property_id).first()
    if db_property is None:
        raise HTTPException(status_code=404, detail="Property not found")
    return db_property

@router.put("/{property_id}", response_model=schemas.Property)
def update_property(property_id: int, property: schemas.PropertyCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_property = db.query(models.Property).filter(models.Property.id == property_id).first()
    if db_property is None:
        raise HTTPException(status_code=404, detail="Property not found")

    for var, value in vars(property).items():
        setattr(db_property, var, value) if value else None

    db.commit()
    db.refresh(db_property)
    return db_property

@router.delete("/{property_id}")
def delete_property(property_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.RoleChecker(["Admin"]))):
    db_property = db.query(models.Property).filter(models.Property.id == property_id).first()
    if db_property is None:
        raise HTTPException(status_code=404, detail="Property not found")
    db.delete(db_property)
    db.commit()
    return {"message": "Property deleted"}
