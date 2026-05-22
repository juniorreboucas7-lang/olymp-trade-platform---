from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from .models import UserRole, ServiceType, ServiceStatus, FinancialType

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserBase(BaseModel):
    username: str
    full_name: str
    role: UserRole

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

class ClientBase(BaseModel):
    name: str
    cpf_cnpj: str
    rg: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    photo_url: Optional[str] = None
    observations: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class Client(ClientBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class PropertyBase(BaseModel):
    name: str
    total_area: float
    city: str
    ccir: Optional[str] = None
    car: Optional[str] = None
    sigef: Optional[str] = None
    registration_number: Optional[str] = None
    cns: Optional[str] = None
    land_situation: Optional[str] = None
    coordinates: Optional[str] = None
    owner_id: int

class PropertyCreate(PropertyBase):
    pass

class Property(PropertyBase):
    id: int
    class Config:
        from_attributes = True

class ServiceBase(BaseModel):
    service_type: ServiceType
    status: ServiceStatus = ServiceStatus.PENDING
    due_date: Optional[datetime] = None
    value: float = 0.0
    costs: float = 0.0
    profit: float = 0.0
    observations: Optional[str] = None
    client_id: int
    property_id: int
    responsible_id: int

class ServiceCreate(ServiceBase):
    pass

class Service(ServiceBase):
    id: int
    start_date: datetime
    class Config:
        from_attributes = True

class FinancialRecordBase(BaseModel):
    type: FinancialType
    description: str
    amount: float
    date: datetime = datetime.now()
    category: str
    service_id: Optional[int] = None

class FinancialRecordCreate(FinancialRecordBase):
    pass

class FinancialRecord(FinancialRecordBase):
    id: int
    class Config:
        from_attributes = True
