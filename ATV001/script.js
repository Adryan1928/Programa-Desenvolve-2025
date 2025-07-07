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

const entries = [
    {
        title: "Hoje é um dia especial!",
        description: "Estou iniciando meu diário online. Aqui, poderei registrar meus pensamentos, reflexões e momentos importantes da minha vida. É um espaço para expressar minha criatividade e acompanhar meu crescimento pessoal. ahjsgfhdgfhkasgfhdgfkjagsfjkagkjfgasdjgfdhgfajsdghfagsdkjfgasjfhghjasgdfjkagjdgfhajsgdfkjgashfdsagfkgdksahjfdgshkjfdgfhkjagfhsdgfhjasdgfkjhgdfjgfhdfajghsdfgjfgdshjfgafjsgk",
        date: "2025-02-25"
    },
    {
        title: "Hoje é um dia especial!",
        description: "Estou iniciando meu diário online. Aqui, poderei registrar meus pensamentos, reflexões e momentos importantes da minha vida. É um espaço para expressar minha criatividade e acompanhar meu crescimento pessoal.",
        date: "2025-02-25"
    },
    {
        title: "Hoje é um dia especial!",
        description: "Estou iniciando meu diário online. Aqui, poderei registrar meus pensamentos, reflexões e momentos importantes da minha vida. É um espaço para expressar minha criatividade e acompanhar meu crescimento pessoal.",
        date: "2025-02-25"
    },
];

entries.forEach(entry => {
    createCard(entry.title, entry.description, entry.date);
});