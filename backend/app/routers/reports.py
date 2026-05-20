from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from .. import models, database, auth
import io
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import cm
from reportlab.lib import colors

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("/proposal/{service_id}")
def generate_proposal(service_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    client = service.client
    property = service.property

    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    # Header
    c.setFillColor(colors.HexColor("#004d00"))
    c.rect(0, height - 3*cm, width, 3*cm, fill=1)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 24)
    c.drawString(1*cm, height - 2*cm, "2F CONSULTORIA")
    c.setFont("Helvetica", 10)
    c.drawString(1*cm, height - 2.5*cm, "Agrícola, Ambiental & Agrimensura")

    # Body
    c.setFillColor(colors.black)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(1*cm, height - 5*cm, f"PROPOSTA TÉCNICA E COMERCIAL #{service_id}")

    c.setFont("Helvetica-Bold", 12)
    c.drawString(1*cm, height - 7*cm, "DADOS DO CLIENTE:")
    c.setFont("Helvetica", 12)
    c.drawString(1*cm, height - 7.6*cm, f"Nome: {client.name}")
    c.drawString(1*cm, height - 8.2*cm, f"CPF/CNPJ: {client.cpf_cnpj}")

    c.setFont("Helvetica-Bold", 12)
    c.drawString(1*cm, height - 10*cm, "OBJETO DA PROPOSTA:")
    c.setFont("Helvetica", 12)
    c.drawString(1*cm, height - 10.6*cm, f"Serviço: {service.type}")
    c.drawString(1*cm, height - 11.2*cm, f"Propriedade: {property.name}")
    c.drawString(1*cm, height - 11.8*cm, f"Localização: {property.city}")

    c.setFont("Helvetica-Bold", 12)
    c.drawString(1*cm, height - 14*cm, "INVESTIMENTO:")
    c.setFont("Helvetica-Bold", 14)
    c.setFillColor(colors.HexColor("#d4af37"))
    c.drawString(1*cm, height - 14.8*cm, f"Valor Total: R$ {service.value:,.2f}")

    # Footer
    c.setFillColor(colors.black)
    c.setFont("Helvetica", 8)
    footer_text = "Francisco Rebouças Junior – Téc. em Agrimensura, Meio Ambiente e Agricultura – CFT 00348436203 – (93) 99185-3915"
    c.drawCentredString(width/2, 1*cm, footer_text)

    c.save()
    buffer.seek(0)

    return StreamingResponse(buffer, media_type='application/pdf', headers={
        "Content-Disposition": f"attachment; filename=proposta_{service_id}.pdf"
    })
