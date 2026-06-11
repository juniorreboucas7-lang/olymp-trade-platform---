# Guia de Instalação e Execução - Sistema 2F Consultoria

Este guia orienta como configurar e rodar o sistema de gestão da **2F Consultoria** em seu computador com Windows 11.

## 1. Pré-requisitos

Certifique-se de ter instalado em seu PC:
- **Node.js** (Versão 18 ou superior)
- **Python** (Versão 3.10 ou superior)

---

## 2. Configuração do Backend (Servidor)

1. Abra o terminal na pasta `backend/`.
2. Crie um ambiente virtual (opcional, mas recomendado):
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   ```
3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```
4. Inicialize o Banco de Dados (Opcional, o sistema faz automático no início):
   ```bash
   python init_db.py
   python create_admin.py
   ```
   *O usuário padrão é `admin` com a senha `admin123`.*
5. Inicie o servidor:
   ```bash
   python -m uvicorn app.main:app --reload
   ```
   *O backend ficará rodando em http://localhost:8000.*

---

## 3. Configuração do Frontend (Interface)

1. Abra um novo terminal na pasta `frontend/`.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   *A interface ficará acessível em http://localhost:5173.*

---

## 4. Executando como Aplicativo Desktop (Electron)

Se desejar rodar o sistema como um aplicativo de janela (estilo Windows 11), em vez de usar o navegador:

1. Certifique-se de que tanto o **Backend** quanto o **Frontend (npm run dev)** estão rodando.
2. Abra um terminal na **raiz do projeto** (onde está o arquivo `main.js`).
3. Instale as dependências do Electron:
   ```bash
   npm install
   ```
4. Inicie o aplicativo:
   ```bash
   npm start
   ```

---

## Estrutura de Cores e Acesso
- **Identidade:** Verde Escuro, Dourado e Branco.
- **Login Inicial:**
  - **Usuário:** admin
  - **Senha:** admin123

## Suporte Técnico
Desenvolvido para **2F Consultoria – Agrícola, Ambiental & Agrimensura**.
Rodapé padrão: *Francisco Rebouças Junior – Téc. em Agrimensura, Meio Ambiente e Agricultura.*
