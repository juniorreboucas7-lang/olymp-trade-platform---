from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, clients, properties, services, financial, agriculture, environmental, reports
from .database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="2F Consultoria API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(clients.router)
app.include_router(properties.router)
app.include_router(services.router)
app.include_router(financial.router)
app.include_router(agriculture.router)
app.include_router(environmental.router)
app.include_router(reports.router)

@app.get("/")
async def root():
    return {"message": "Welcome to 2F Consultoria API"}
