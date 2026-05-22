from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
import enum
from datetime import datetime
from .database import Base

class UserRole(str, enum.Enum):
    ADMIN = "Admin"
    TECNICO = "Técnico"
    FINANCEIRO = "Financeiro"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(Enum(UserRole), default=UserRole.TECNICO)
    full_name = Column(String)

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
    photo_url = Column(String)
    observations = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    properties = relationship("Property", back_populates="owner")
    services = relationship("Service", back_populates="client")

class Property(Base):
    __tablename__ = "properties"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    total_area = Column(Float)
    city = Column(String)
    ccir = Column(String)
    car = Column(String)
    sigef = Column(String)
    registration_number = Column(String) # Matrícula
    cns = Column(String)
    land_situation = Column(String)
    coordinates = Column(String) # For now, store as string or GeoJSON

    owner_id = Column(Integer, ForeignKey("clients.id"))
    owner = relationship("Client", back_populates="properties")

    services = relationship("Service", back_populates="property")

class ServiceType(str, enum.Enum):
    GEO = "Georreferenciamento"
    CAR = "CAR"
    CCIR = "CCIR"
    SIGEF = "SIGEF"
    SNCR = "SNCR"
    CREDITO = "Crédito rural"
    LICENCIAMENTO = "Licenciamento ambiental"
    PRAD = "PRAD"
    LAUDO = "Laudo técnico"
    REGULARIZACAO = "Regularização fundiária"
    CONSULTORIA = "Consultoria agrícola"
    TOPOGRAFIA = "Levantamento topográfico"

class ServiceStatus(str, enum.Enum):
    PENDING = "Pendente"
    IN_PROGRESS = "Em andamento"
    COMPLETED = "Concluído"
    CANCELLED = "Cancelado"

class Service(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True, index=True)
    service_type = Column(Enum(ServiceType))
    status = Column(Enum(ServiceStatus), default=ServiceStatus.PENDING)
    start_date = Column(DateTime, default=datetime.utcnow)
    due_date = Column(DateTime)
    value = Column(Float)
    costs = Column(Float)
    profit = Column(Float)
    observations = Column(Text)

    client_id = Column(Integer, ForeignKey("clients.id"))
    client = relationship("Client", back_populates="services")

    property_id = Column(Integer, ForeignKey("properties.id"))
    property = relationship("Property", back_populates="services")

    responsible_id = Column(Integer, ForeignKey("users.id"))
    responsible = relationship("User")

class FinancialType(str, enum.Enum):
    INCOME = "Entrada"
    EXPENSE = "Saída"

class FinancialRecord(Base):
    __tablename__ = "financial_records"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(Enum(FinancialType))
    description = Column(String)
    amount = Column(Float)
    date = Column(DateTime, default=datetime.utcnow)
    category = Column(String)

    service_id = Column(Integer, ForeignKey("services.id"), nullable=True)
    service = relationship("Service")
