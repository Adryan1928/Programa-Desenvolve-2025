const URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

function adicionarResposta(resposta, pergunta) {
    const respostasDiv = document.getElementById("respostas");
    const novaResposta = document.createElement("div");
    novaResposta.classList.add("respostas");
    novaResposta.innerHTML = `
    <div class="pergunta">
        <p>${pergunta}</p>
    </div>

    <div class="resposta">
        <p>${resposta}</p>
    </div>`;
    respostasDiv.style.display = "flex";
    respostasDiv.appendChild(novaResposta);
}

async function fazerPergunta(pergunta) {
    const apiKey = document.getElementById("api-key").value;
    const headers = {
        'content-type': 'application/json',
        'X-goog-api-key': apiKey,
    }

    const response = await fetch(URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: pergunta }
                    ]
                }
            ]
        })
    })

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

document.addEventListener("DOMContentLoaded", (event) => {
    const form = document.querySelector(".pergunta-box");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const pergunta = document.getElementById("pergunta").value;

        const resposta = await fazerPergunta(pergunta);

        adicionarResposta(resposta, pergunta);
    });
});