from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class ClientBase(BaseModel):
    name: str
    cpf_cnpj: str
    rg: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    observations: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class Client(ClientBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class CropBase(BaseModel):
    property_id: int
    culture_type: str
    area: float
    production_estimate: Optional[float] = 0.0
    actual_production: Optional[float] = 0.0
    planting_date: Optional[datetime] = None
    harvest_date: Optional[datetime] = None

class CropCreate(CropBase):
    pass

class Crop(CropBase):
    id: int

    class Config:
        from_attributes = True

class EnvironmentalRecordBase(BaseModel):
    property_id: int
    license_type: str
    expiration_date: Optional[datetime] = None
    status: str
    observations: Optional[str] = None

class EnvironmentalRecordCreate(EnvironmentalRecordBase):
    pass

class EnvironmentalRecord(EnvironmentalRecordBase):
    id: int

    class Config:
        from_attributes = True

class PropertyBase(BaseModel):
    name: str
    total_area: float
    consolidated_area: Optional[float] = None
    app_area: Optional[float] = None
    legal_reserve_area: Optional[float] = None
    city: Optional[str] = None
    car_number: Optional[str] = None
    ccir_number: Optional[str] = None
    sigef_number: Optional[str] = None
    land_situation: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class PropertyCreate(PropertyBase):
    owner_id: int

class Property(PropertyBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True

class ServiceBase(BaseModel):
    client_id: int
    property_id: int
    type: str
    status: str
    technical_responsible: Optional[str] = None
    value: Optional[float] = 0.0
    costs: Optional[float] = 0.0
    deadline: Optional[datetime] = None

class ServiceCreate(ServiceBase):
    pass

class Service(ServiceBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class FinancialRecordBase(BaseModel):
    service_id: Optional[int] = None
    type: str # Income, Expense
    category: str
    amount: float
    description: Optional[str] = None
    date: datetime
    is_paid: bool = False

class FinancialRecordCreate(FinancialRecordBase):
    pass

class FinancialRecord(FinancialRecordBase):
    id: int

    class Config:
        from_attributes = True
