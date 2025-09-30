const hamburger = document.querySelector('.menu-hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links a');

const toggleMenu = () => {
navLinks.classList.toggle('active');
hamburger.classList.toggle('toggle');
};

hamburger.addEventListener('click', toggleMenu);

links.forEach(link => {
link.addEventListener('click', () => {
if (navLinks.classList.contains('active')) {
toggleMenu();
}
});
});

const form = document.getElementById('contact-form');
const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const whatsappInput = document.getElementById('whatsapp');
const modeloInput = document.getElementById('modelo');
const submitButton = document.getElementById('submit-button');
const loadingMessage = form.querySelector('.loading');
const errorMessage = form.querySelector('.error-message');
const successMessage = form.querySelector('.success-message');

whatsappInput.addEventListener('input', (event) => {
const input = event.target;
let valor = input.value.replace(/\D/g, '');
valor = valor.substring(0, 11);
let valorFormatado = '';
if (valor.length > 0) { valorFormatado = '(' + valor.substring(0, 2); }
if (valor.length > 2) { valorFormatado += ') ' + valor.substring(2, 7); }
if (valor.length > 7) { valorFormatado += '-' + valor.substring(7, 11); }
input.value = valorFormatado;
});

form.addEventListener('submit', async (event) => {
event.preventDefault();

errorMessage.textContent = '';
successMessage.style.display = 'none';

// --- VALIDAÇÃO ROBUSTA DE TODOS OS CAMPOS ---

const nome = nomeInput.value.trim();
const email = emailInput.value.trim();
const whatsapp = whatsappInput.value.replace(/\D/g, ''); // Apenas os dígitos
const modelo = modeloInput.value;

// 1. Validação do Nome
if (nome.split(' ').length < 2) {
errorMessage.textContent = 'Por favor, digite seu nome completo.';
return;
}
if (/\d/.test(nome)) { // Esta linha verifica se existe algum número no nome
errorMessage.textContent = 'O nome não pode conter números.';
return;
}

// 2. Validação do Email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
errorMessage.textContent = 'Por favor, digite um e-mail válido.';
return;
}

// 3. Validação do WhatsApp
if (whatsapp.length !== 11) {
errorMessage.textContent = 'Digite um WhatsApp válido com 11 dígitos (DDD + número).';
return;
}

// 4. Validação do Modelo
if (!modelo) {
errorMessage.textContent = 'Por favor, selecione um modelo de interesse.';
return;
}

// Se todas as validações passaram, continua com o envio...
loadingMessage.style.display = 'block';
submitButton.disabled = true;

const scriptURL = 'https://script.google.com/macros/s/AKfycbzg6qLPnO_aeZ1ktmw0s6VZPC1tpbHjw6nxxozkz0vfRl-ZMNfSo2dLIXZ8IHunq7e6/exec';

const payload = {
nome: nome,
email: email,
whatsapp: whatsappInput.value.trim(), // Envia o número com a máscara
modelo: modelo
};

try {
const response = await fetch(scriptURL, {
method: 'POST',
headers: { 'Content-Type': 'text/plain;charset=utf-8' },
body: JSON.stringify(payload)
});
const result = await response.json();

if (result.result === 'success') {
successMessage.textContent = 'Proposta enviada com sucesso! Obrigado.';
successMessage.style.display = 'block';
form.reset();
setTimeout(() => {
successMessage.style.display = 'none';
}, 5000);
} else {
 throw new Error(result.message || 'Erro desconhecido no servidor.');
}
} catch (error) {
console.error('Erro ao enviar o formulário:', error);
errorMessage.textContent = 'Ocorreu um erro. Por favor, tente novamente.';
} finally {
loadingMessage.style.display = 'none';
submitButton.disabled = false;
}
});
