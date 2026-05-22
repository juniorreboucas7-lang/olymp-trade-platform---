from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from .. import models, schemas, database, auth

router = APIRouter(
    prefix="/finance",
    tags=["finance"],
    dependencies=[Depends(auth.check_financeiro_role)]
)

@router.post("/records", response_model=schemas.FinancialRecord)
def create_financial_record(record: schemas.FinancialRecordCreate, db: Session = Depends(database.get_db)):
    db_record = models.FinancialRecord(**record.dict())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

@router.get("/records", response_model=List[schemas.FinancialRecord])
def read_financial_records(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    records = db.query(models.FinancialRecord).offset(skip).limit(limit).all()
    return records

@router.get("/summary")
def get_finance_summary(db: Session = Depends(database.get_db)):
    income = db.query(func.sum(models.FinancialRecord.amount)).filter(models.FinancialRecord.type == models.FinancialType.INCOME).scalar() or 0.0
    expense = db.query(func.sum(models.FinancialRecord.amount)).filter(models.FinancialRecord.type == models.FinancialType.EXPENSE).scalar() or 0.0

    return {
        "total_income": income,
        "total_expense": expense,
        "balance": income - expense
    }

@router.delete("/records/{record_id}")
def delete_financial_record(record_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.check_admin_role)):
    db_record = db.query(models.FinancialRecord).filter(models.FinancialRecord.id == record_id).first()
    if db_record is None:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(db_record)
    db.commit()
    return {"message": "Record deleted"}
