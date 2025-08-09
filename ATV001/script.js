const cardsContainer = document.getElementById("cards");

function createCard(title, description, date) {
    const card = document.createElement("section");
    card.className = "flex flex-col bg-slate-50 p-4 rounded-lg shadow-lg w-full md:w-9/20 gap-4";
    
    card.innerHTML = `
        <div class="flex gap-4 items-center justify-between w-full">
            <h2 class="text-lg">${title}</h2>
            <time datetime="${date}" class="text-sm">${new Date(date).toLocaleDateString("pt-BR")}</time>
        </div>
        <hr class="w-full">
        <p class="text-justify text-sm indent-4 break-words">
            ${description}
        </p>
    `;

    cardsContainer.appendChild(card);
}

function showLoading() {
    cardsContainer.innerHTML = `
        <div class="flex items-center justify-center w-full p-8">
            <p class="text-lg text-slate-600">Carregando entradas do diário...</p>
        </div>
    `;
}

function showError(message) {
    cardsContainer.innerHTML = `
        <div class="flex items-center justify-center w-full p-8">
            <p class="text-lg text-red-600">Erro: ${message}</p>
        </div>
    `;
}

async function loadEntries() {
    try {
        showLoading();
        
        const response = await fetch('./api/entries.json');
        
        if (!response.ok) {
            throw new Error(`Erro ao carregar dados: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Clear loading message
        cardsContainer.innerHTML = '';
        
        // Render entries
        data.entries.forEach(entry => {
            createCard(entry.title, entry.description, entry.date);
        });
        
    } catch (error) {
        console.error('Erro ao carregar entradas:', error);
        showError('Não foi possível carregar as entradas do diário.');
    }
}

// Load entries when the page loads
document.addEventListener('DOMContentLoaded', loadEntries);