from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database, auth

router = APIRouter(prefix="/environmental", tags=["environmental"])

@router.post("/records", response_model=schemas.EnvironmentalRecord)
def create_environmental_record(record: schemas.EnvironmentalRecordCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_record = models.EnvironmentalRecord(**record.dict())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

@router.get("/records", response_model=List[schemas.EnvironmentalRecord])
def read_environmental_records(property_id: int = None, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    query = db.query(models.EnvironmentalRecord)
    if property_id:
        query = query.filter(models.EnvironmentalRecord.property_id == property_id)
    return query.all()

@router.put("/records/{record_id}", response_model=schemas.EnvironmentalRecord)
def update_environmental_record(record_id: int, record: schemas.EnvironmentalRecordCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_record = db.query(models.EnvironmentalRecord).filter(models.EnvironmentalRecord.id == record_id).first()
    if db_record is None:
        raise HTTPException(status_code=404, detail="Record not found")
    for var, value in vars(record).items():
        setattr(db_record, var, value) if value is not None else None
    db.commit()
    db.refresh(db_record)
    return db_record

@router.delete("/records/{record_id}")
def delete_environmental_record(record_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_record = db.query(models.EnvironmentalRecord).filter(models.EnvironmentalRecord.id == record_id).first()
    if db_record is None:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(db_record)
    db.commit()
    return {"message": "Record deleted"}
