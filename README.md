# Plataforma de Reservas de Eventos (API + Frontend)
Um projeto full-stack de uma plataforma de reserva de eventos, construído para demonstrar competências em desenvolvimento backend com Python e frontend com JavaScript puro.

---

##  Funcionalidades:

* **Autenticação de Utilizadores:** Sistema de registo e login seguro com tokens JWT.
* **Gestão de Eventos (CRUD):** Utilizadores autenticados podem criar, ler, atualizar e apagar os seus próprios eventos.
* **Sistema de Inscrições:** Funcionalidade para os utilizadores se inscreverem nos eventos.
* **Frontend Interativo:** Interface de utilizador moderna e reativa construída com HTML, CSS e JavaScript.
* **Integração com API Externa:** Carregamento dinâmico dos estados brasileiros através da API do IBGE.
* **Documentação Automática:** A API inclui documentação interativa gerada automaticamente pelo Swagger UI.

---

 ## Tecnologias Utilizadas:

**Backend:**
* Python 3.11+
* FastAPI
* SQLAlchemy (ORM) com SQLite
* Pydantic
* Passlib & python-jose (para segurança e JWT)

**Frontend:**
* HTML5
* CSS3 (com Flexbox e Grid)
* JavaScript (Vanilla)
* Flatpickr (para o seletor de data)

---

## ⚙️ Como Executar o Projeto

**Pré-requisitos:** Python 3.10+ e Git instalados.

1.  **Clone o repositório:**
    ```
    git clone [https://github.com/SEU-NOME-DE-UTILIZADOR/api-eventos-fullstack.git](https://github.com/SEU-NOME-DE-UTILIZADOR/api-eventos-fullstack.git)
    cd api-eventos-fullstack
    ```

2.  **Execute o Backend (API):**
    ```
    cd event_booking_api
    python -m venv venv
    .\venv\Scripts\activate
    pip install -r requirements.txt 
    uvicorn app.main:app --reload
    ```
    *A API estará a funcionar em `http://127.0.0.1:8000`.*

3.  **Execute o Frontend:**
    * Abra a pasta `event-booking-frontend` no VSCode.
    * Instale a extensão "Live Server".
    * Clique com o botão direito no ficheiro `login.html` e selecione "Open with Live Server".
    * O frontend estará acessível em `http://127.0.0.1:5500` (ou uma porta similar).

