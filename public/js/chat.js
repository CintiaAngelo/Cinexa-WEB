let currentStep = 0;
let newIdea = {};

async function loadNewsletter() {
    const response = await fetch('/api/newsletter');
    const data = await response.json();
    addMessage(data.content);
    addMessage("Caso queira enviar uma mensagem de inovação, digite 'cadastrar nova proposta'.");
}

function addMessage(text) {
    const chat = document.getElementById('chat');
    chat.innerHTML += `<div class="message">${text}</div>`;
    chat.scrollTop = chat.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('userInput');
    const text = input.value.trim();
    if(!text) return;
    addMessage(`Você: ${text}`);
    input.value = '';

    if(currentStep > 0) handleIdeaStep(text);
    else if(text.toLowerCase() === 'cadastrar nova proposta') startIdeaStep();
}

function startIdeaStep() {
    currentStep = 1;
    newIdea = {};
    addMessage("Vamos cadastrar sua ideia. Primeiro, digite o título da ideia:");
}

function handleIdeaStep(text) {
    if(currentStep === 1) {
        newIdea.title = text;
        currentStep++;
        addMessage("Agora, digite a descrição da ideia:");
    } else if(currentStep === 2) {
        newIdea.description = text;
        currentStep++;
        addMessage("Por fim, digite seu nome:");
    } else if(currentStep === 3) {
        newIdea.author = text;
        submitIdea(newIdea);
        currentStep = 0;
    }
}

async function submitIdea(idea) {
    const response = await fetch('/api/idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(idea)
    });
    const data = await response.json();
    addMessage(data.message);
}

document.addEventListener('DOMContentLoaded', loadNewsletter);
