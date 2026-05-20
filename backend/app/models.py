from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from .database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String) # Admin, Technician, Financial
    is_active = Column(Boolean, default=True)

class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    cpf_cnpj = Column(String, unique=True, index=True)
    rg = Column(String)
    phone = Column(String)
    whatsapp = Column(String)
    email = Column(String)
    address = Column(String)
    city = Column(String)
    state = Column(String)
    observations = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    properties = relationship("Property", back_populates="owner")
    services = relationship("Service", back_populates="client")

class Property(Base):
    __tablename__ = "properties"
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("clients.id"))
    name = Column(String)
    total_area = Column(Float)
    consolidated_area = Column(Float)
    app_area = Column(Float)
    legal_reserve_area = Column(Float)
    city = Column(String)
    car_number = Column(String)
    ccir_number = Column(String)
    sigef_number = Column(String)
    land_situation = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)

    owner = relationship("Client", back_populates="properties")
    services = relationship("Service", back_populates="property")

class Service(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    property_id = Column(Integer, ForeignKey("properties.id"))
    type = Column(String) # CAR, CCIR, Topography, etc.
    status = Column(String) # Pending, In Progress, Completed
    technical_responsible = Column(String)
    value = Column(Float)
    costs = Column(Float)
    deadline = Column(DateTime)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    client = relationship("Client", back_populates="services")
    property = relationship("Property", back_populates="services")
    financial_records = relationship("FinancialRecord", back_populates="service")

class FinancialRecord(Base):
    __tablename__ = "financial_records"
    id = Column(Integer, primary_key=True, index=True)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=True)
    type = Column(String) # Income, Expense
    category = Column(String)
    amount = Column(Float)
    description = Column(String)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    is_paid = Column(Boolean, default=False)

    service = relationship("Service", back_populates="financial_records")

class Crop(Base):
    __tablename__ = "crops"
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"))
    culture_type = Column(String) # Acai, Cocoa, etc.
    area = Column(Float)
    production_estimate = Column(Float)
    actual_production = Column(Float)
    planting_date = Column(DateTime)
    harvest_date = Column(DateTime)

class EnvironmentalRecord(Base):
    __tablename__ = "environmental_records"
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"))
    license_type = Column(String)
    expiration_date = Column(DateTime)
    status = Column(String)
    observations = Column(Text)
