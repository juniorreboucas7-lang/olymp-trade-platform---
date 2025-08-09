# 📊 Plataforma de Trade em Tempo Real - Olymp Trade

Este projeto é uma plataforma web para análise técnica e operação de trade em tempo real, com integração à Olymp Trade e alertas via Telegram.

---

## 🚀 Funcionalidades

- Cálculo de indicadores técnicos: SMA 20, RSI 14, MACD
- Geração de sinais de trade: **Comprar**, **Vender**, **Manter**
- Alertas via Telegram Bot com controle de spam
- Atualização em tempo real via WebSocket
- Visualização gráfica com Chart.js
- Interface responsiva com Bootstrap

---

## 🧰 Tecnologias Utilizadas

- **Backend**: Python + Flask + Flask-SocketIO
- **Frontend**: HTML, Bootstrap, JavaScript, Chart.js
- **Banco de dados**: SQLite (pode ser substituído por PostgreSQL)
- **Alertas**: Telegram Bot

---

## ⚙️ Instalação Local

### 1. Clone o repositório

```bash
git clone https://github.com/juniorreboucas7-lang/olymp-trade-platform---.git
cd olymp-trade-platform---
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
TELEGRAM_TOKEN=seu_token
TELEGRAM_CHAT_ID=seu_chat_id
DATABASE_URL=sqlite:///data.db
python run.py
heroku create nome-do-app
heroku addons:create heroku-postgresql
heroku config:set TELEGRAM_TOKEN=seu_token
heroku config:set TELEGRAM_CHAT_ID=seu_chat_id
git push heroku main

---

Você pode copiar esse conteúdo e colar diretamente no seu arquivo `README.md`. Se quiser que eu gere também o `.env.example`, `requirements.txt` ou outro arquivo agora, é só pedir!

