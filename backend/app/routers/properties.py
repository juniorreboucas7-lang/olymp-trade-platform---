from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database, auth

router = APIRouter(
    prefix="/properties",
    tags=["properties"],
    dependencies=[Depends(auth.get_current_user)]
)

@router.post("/", response_model=schemas.Property)
def create_property(prop: schemas.PropertyCreate, db: Session = Depends(database.get_db)):
    db_prop = models.Property(**prop.dict())
    db.add(db_prop)
    db.commit()
    db.refresh(db_prop)
    return db_prop

@router.get("/", response_model=List[schemas.Property])
def read_properties(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    properties = db.query(models.Property).offset(skip).limit(limit).all()
    return properties

@router.get("/{property_id}", response_model=schemas.Property)
def read_property(property_id: int, db: Session = Depends(database.get_db)):
    db_prop = db.query(models.Property).filter(models.Property.id == property_id).first()
    if db_prop is None:
        raise HTTPException(status_code=404, detail="Property not found")
    return db_prop

@router.put("/{property_id}", response_model=schemas.Property)
def update_property(property_id: int, prop: schemas.PropertyCreate, db: Session = Depends(database.get_db)):
    db_prop = db.query(models.Property).filter(models.Property.id == property_id).first()
    if db_prop is None:
        raise HTTPException(status_code=404, detail="Property not found")

    for var, value in prop.dict().items():
        setattr(db_prop, var, value) if value is not None else None

    db.commit()
    db.refresh(db_prop)
    return db_prop

@router.delete("/{property_id}")
def delete_property(property_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.check_admin_role)):
    db_prop = db.query(models.Property).filter(models.Property.id == property_id).first()
    if db_prop is None:
        raise HTTPException(status_code=404, detail="Property not found")
    db.delete(db_prop)
    db.commit()
    return {"message": "Property deleted"}
