from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database, auth

router = APIRouter(prefix="/clients", tags=["clients"])

@router.post("/", response_model=schemas.Client)
def create_client(client: schemas.ClientCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_client = models.Client(**client.dict())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

@router.get("/", response_model=List[schemas.Client])
def read_clients(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    clients = db.query(models.Client).offset(skip).limit(limit).all()
    return clients

@router.get("/{client_id}", response_model=schemas.Client)
def read_client(client_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_client = db.query(models.Client).filter(models.Client.id == client_id).first()
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return db_client

@router.put("/{client_id}", response_model=schemas.Client)
def update_client(client_id: int, client: schemas.ClientCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_client = db.query(models.Client).filter(models.Client.id == client_id).first()
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")

    for var, value in vars(client).items():
        setattr(db_client, var, value) if value else None

    db.commit()
    db.refresh(db_client)
    return db_client

@router.delete("/{client_id}")
def delete_client(client_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.RoleChecker(["Admin"]))):
    db_client = db.query(models.Client).filter(models.Client.id == client_id).first()
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    db.delete(db_client)
    db.commit()
    return {"message": "Client deleted"}
