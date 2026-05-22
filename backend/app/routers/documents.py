from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from jinja2 import Template
import pdfkit
from datetime import datetime
from .. import models, database, auth
import os

router = APIRouter(
    prefix="/documents",
    tags=["documents"],
    dependencies=[Depends(auth.get_current_user)]
)

TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), "..", "templates", "base_report.html")

@router.get("/generate/{service_id}")
def generate_service_report(service_id: int, db: Session = Depends(database.get_db)):
    service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    with open(TEMPLATE_PATH, "r") as f:
        template_html = f.read()

    template = Template(template_html)

    body_content = f"""
    <h3>Relatório de Serviço</h3>
    <p>Tipo de Serviço: {service.service_type.value}</p>
    <p>Status: {service.status.value}</p>
    <p>Propriedade: {service.property.name if service.property else 'N/A'}</p>
    <p>Valor: R$ {service.value:,.2f}</p>
    <p>Observações: {service.observations or 'Nenhuma'}</p>
    """

    html_out = template.render(
        title="ORDEM DE SERVIÇO / RELATÓRIO TÉCNICO",
        client_name=service.client.name,
        date=datetime.now().strftime("%d/%m/%Y"),
        body_content=body_content
    )

    try:
        # Note: wkhtmltopdf must be installed on the system
        pdf = pdfkit.from_string(html_out, False)
        return Response(content=pdf, media_type="application/pdf", headers={
            "Content-Disposition": f"attachment; filename=relatorio_servico_{service_id}.pdf"
        })
    except Exception as e:
        # Fallback if pdfkit/wkhtmltopdf is not available in this environment
        # In a real environment, we would ensure it is installed.
        # For this sandbox, we might just return the HTML or a message.
        return Response(content=html_out, media_type="text/html")

@router.get("/receipt/{record_id}")
def generate_receipt(record_id: int, db: Session = Depends(database.get_db)):
    record = db.query(models.FinancialRecord).filter(models.FinancialRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Financial record not found")

    with open(TEMPLATE_PATH, "r") as f:
        template_html = f.read()

    template = Template(template_html)

    body_content = f"""
    <div style="border: 1px solid #000; padding: 20px; text-align: center;">
        <h2>RECIBO</h2>
        <p style="font-size: 20px;">Valor: <strong>R$ {record.amount:,.2f}</strong></p>
        <p>Recebemos de 2F Consultoria a importância acima referente a:</p>
        <p><strong>{record.description}</strong></p>
        <br><br>
        <p>__________________________________________</p>
        <p>Assinatura</p>
    </div>
    """

    html_out = template.render(
        title="RECIBO DE PAGAMENTO",
        client_name="2F Consultoria",
        date=record.date.strftime("%d/%m/%Y"),
        body_content=body_content
    )

    try:
        pdf = pdfkit.from_string(html_out, False)
        return Response(content=pdf, media_type="application/pdf")
    except:
        return Response(content=html_out, media_type="text/html")
