from app.database import SessionLocal, engine, Base
from app import models, auth

Base.metadata.create_all(bind=engine)

db = SessionLocal()
admin = db.query(models.User).filter(models.User.username == "admin").first()
if not admin:
    admin = models.User(
        username="admin",
        email="admin@2fconsultoria.com.br",
        hashed_password=auth.get_password_hash("admin123"),
        role="Admin"
    )
    db.add(admin)
    db.commit()
    print("Admin user created")
else:
    print("Admin user already exists")
db.close()
