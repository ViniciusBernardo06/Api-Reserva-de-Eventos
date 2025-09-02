// script.js (VERSÃO COMPLETA E VERIFICADA)

document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://127.0.0.1:8000';

    // --- LÓGICA DA PÁGINA LOGIN.HTML ---
    if (document.getElementById('login-form')) {
        const loginView = document.getElementById('login-view');
        const registerView = document.getElementById('register-view');
        const showRegisterLink = document.getElementById('show-register');
        const showLoginLink = document.getElementById('show-login');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginView.classList.add('hidden');
            registerView.classList.remove('hidden');
        });

        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerView.classList.add('hidden');
            loginView.classList.remove('hidden');
        });

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

            try {
                const response = await fetch(`${API_URL}/users/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                if (response.status === 201) {
                    showMessage('Utilizador registado com sucesso! Faça o login.', 'success');
                    showLoginLink.click();
                } else {
                    const errorData = await response.json();
                    showMessage(`Erro no registo: ${errorData.detail}`, 'error');
                }
            } catch (error) {
                showMessage('Erro de conexão com a API.', 'error');
            }
        });

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);
            
            try {
                const response = await fetch(`${API_URL}/token`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('accessToken', data.access_token);
                    showMessage('Login bem-sucedido! Redirecionando...', 'success');
                    window.location.href = 'index.html';
                } else {
                    const errorData = await response.json();
                    showMessage(`Erro no login: ${errorData.detail}`, 'error');
                }
            } catch (error) {
                showMessage('Erro de conexão com a API.', 'error');
            }
        });
    }


    // --- LÓGICA DA PÁGINA INDEX.HTML ---
    if (window.location.pathname.endsWith('index.html')) {
        const token = localStorage.getItem('accessToken');
        if (!token) { window.location.href = 'login.html'; }

        const logoutButton = document.getElementById('logout-button');
        const createEventForm = document.getElementById('create-event-form');
        const eventsList = document.getElementById('events-list');

        async function populateStatesDropdown() {
            const locationSelect = document.getElementById('event-location');
            try {
                const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
                if (!response.ok) throw new Error('Não foi possível carregar os estados.');
                const states = await response.json();
                locationSelect.innerHTML = '<option value="" disabled selected>Selecione um estado...</option>';
                states.forEach(state => {
                    const option = document.createElement('option');
                    option.value = state.sigla;
                    option.textContent = state.nome;
                    locationSelect.appendChild(option);
                });
            } catch (error) {
                locationSelect.innerHTML = '<option value="" disabled selected>Erro ao carregar estados</option>';
                console.error(error);
            }
        }
        
        flatpickr("#event-date", { enableTime: true, dateFormat: "Y-m-d H:i", locale: "pt", time_24hr: true });
        
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('accessToken');
            window.location.href = 'login.html';
        });
        
        async function fetchEvents() {
            try {
                const response = await fetch(`${API_URL}/events/`);
                if (!response.ok) throw new Error('Não foi possível carregar os eventos.');
                const events = await response.json();
                eventsList.innerHTML = '';
                if (events.length === 0) {
                    eventsList.innerHTML = '<p>Ainda não há eventos. Crie o primeiro!</p>';
                } else {
                    events.forEach(event => {
                        const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
                        const eventDate = new Date(event.date).toLocaleString('pt-BR', options);
                        const eventElement = document.createElement('div');
                        eventElement.className = 'event-card';
                        eventElement.innerHTML = `
                            <h3>${event.title}</h3>
                            <p>${event.description}</p>
                            <div class="event-details">
                                <span><strong>Data:</strong> ${eventDate}</span>
                                <span><strong>Local:</strong> ${event.location}</span>
                                <span><strong>Organizador:</strong> ${event.owner.email}</span>
                            </div>
                            <div class="card-actions">
                                <button class="btn-delete" data-event-id="${event.id}">Excluir</button>
                            </div>
                        `;
                        eventsList.appendChild(eventElement);
                    });
                }
            } catch (error) {
                showMessage(error.message, 'error');
            }
        }

        createEventForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const eventData = {
                title: document.getElementById('event-title').value,
                description: document.getElementById('event-description').value,
                date: document.getElementById('event-date').value,
                location: document.getElementById('event-location').value,
            };
            try {
                const response = await fetch(`${API_URL}/events/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(eventData)
                });
                if (response.status === 201) {
                    showMessage('Evento criado com sucesso!', 'success');
                    createEventForm.reset();
                    fetchEvents();
                } else {
                    const errorData = await response.json();
                    showMessage(`Erro ao criar evento: ${errorData.detail}`, 'error');
                }
            } catch (error) {
                showMessage('Erro de conexão ao criar evento.', 'error');
            }
        });

        eventsList.addEventListener('click', async (e) => {
            if (e.target && e.target.classList.contains('btn-delete')) {
                const eventId = e.target.getAttribute('data-event-id');
                if (confirm("Tem a certeza que deseja excluir este evento? Esta ação não pode ser desfeita.")) {
                    try {
                        const response = await fetch(`${API_URL}/events/${eventId}`, {
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (response.status === 204) {
                            showMessage('Evento excluído com sucesso!', 'success');
                            fetchEvents();
                        } else {
                            const errorData = await response.json();
                            showMessage(`Erro ao excluir evento: ${errorData.detail}`, 'error');
                        }
                    } catch (error) {
                        showMessage('Erro de conexão ao excluir evento.', 'error');
                    }
                }
            }
        });
        
        populateStatesDropdown();
        fetchEvents();
    }
    
    // Função de mensagens global
    const messageArea = document.getElementById('message-area');
    function showMessage(message, type) {
        if(messageArea) {
            messageArea.textContent = message;
            messageArea.className = type === 'success' ? 'message-success' : 'message-error';
            setTimeout(() => {
                messageArea.textContent = '';
                messageArea.className = '';
            }, 5000);
        }
    }
});