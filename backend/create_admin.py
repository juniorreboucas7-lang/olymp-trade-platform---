from app.database import SessionLocal
from app import models, auth

def create_admin():
    db = SessionLocal()
    # Check if admin already exists
    admin = db.query(models.User).filter(models.User.username == "admin").first()
    if not admin:
        admin = models.User(
            username="admin",
            hashed_password=auth.get_password_hash("admin123"),
            full_name="Administrador do Sistema",
            role=models.UserRole.ADMIN
        )
        db.add(admin)
        db.commit()
        print("Usuário Admin criado: admin / admin123")
    else:
        print("Usuário Admin já existe.")
    db.close()

if __name__ == "__main__":
    create_admin()
