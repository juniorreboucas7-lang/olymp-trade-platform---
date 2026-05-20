from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from .. import models, schemas, database, auth

router = APIRouter(prefix="/financial", tags=["financial"])

@router.post("/", response_model=schemas.FinancialRecord)
def create_financial_record(record: schemas.FinancialRecordCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_record = models.FinancialRecord(**record.dict())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

@router.get("/", response_model=List[schemas.FinancialRecord])
def read_financial_records(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    records = db.query(models.FinancialRecord).offset(skip).limit(limit).all()
    return records

@router.get("/summary")
def get_financial_summary(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    income = db.query(func.sum(models.FinancialRecord.amount)).filter(models.FinancialRecord.type == "Income").scalar() or 0
    expense = db.query(func.sum(models.FinancialRecord.amount)).filter(models.FinancialRecord.type == "Expense").scalar() or 0
    return {
        "total_income": income,
        "total_expense": expense,
        "net_profit": income - expense
    }

@router.put("/{record_id}", response_model=schemas.FinancialRecord)
def update_financial_record(record_id: int, record: schemas.FinancialRecordCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_record = db.query(models.FinancialRecord).filter(models.FinancialRecord.id == record_id).first()
    if db_record is None:
        raise HTTPException(status_code=404, detail="Record not found")

    for var, value in vars(record).items():
        setattr(db_record, var, value) if value is not None else None

    db.commit()
    db.refresh(db_record)
    return db_record

@router.delete("/{record_id}")
def delete_financial_record(record_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.RoleChecker(["Admin", "Financial"]))):
    db_record = db.query(models.FinancialRecord).filter(models.FinancialRecord.id == record_id).first()
    if db_record is None:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(db_record)
    db.commit()
    return {"message": "Record deleted"}
