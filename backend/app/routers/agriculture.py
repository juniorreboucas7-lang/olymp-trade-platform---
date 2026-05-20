from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database, auth

router = APIRouter(prefix="/agriculture", tags=["agriculture"])

@router.post("/crops", response_model=schemas.Crop)
def create_crop(crop: schemas.CropCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_crop = models.Crop(**crop.dict())
    db.add(db_crop)
    db.commit()
    db.refresh(db_crop)
    return db_crop

@router.get("/crops", response_model=List[schemas.Crop])
def read_crops(property_id: int = None, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    query = db.query(models.Crop)
    if property_id:
        query = query.filter(models.Crop.property_id == property_id)
    return query.all()

@router.put("/crops/{crop_id}", response_model=schemas.Crop)
def update_crop(crop_id: int, crop: schemas.CropCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_crop = db.query(models.Crop).filter(models.Crop.id == crop_id).first()
    if db_crop is None:
        raise HTTPException(status_code=404, detail="Crop not found")
    for var, value in vars(crop).items():
        setattr(db_crop, var, value) if value is not None else None
    db.commit()
    db.refresh(db_crop)
    return db_crop

@router.delete("/crops/{crop_id}")
def delete_crop(crop_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_crop = db.query(models.Crop).filter(models.Crop.id == crop_id).first()
    if db_crop is None:
        raise HTTPException(status_code=404, detail="Crop not found")
    db.delete(db_crop)
    db.commit()
    return {"message": "Crop deleted"}
