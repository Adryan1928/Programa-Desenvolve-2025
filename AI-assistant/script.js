const URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

function carregarRespostas() {
    const respostas = JSON.parse(localStorage.getItem("respostas")) || [];
    respostas.forEach(({ pergunta, resposta }) => {
        adicionarResposta(resposta, pergunta);
    });
}

function adicionarResposta(resposta, pergunta) {
    const respostasDiv = document.querySelector("#respostas");
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
    localStorage.setItem("respostas", JSON.stringify([...JSON.parse(localStorage.getItem("respostas") || "[]"), { pergunta, resposta }]));
}

async function fazerPergunta(pergunta) {
    const apiKey = document.querySelector("#api-key").value;
    const headers = {
        'content-type': 'application/json',
        'X-goog-api-key': apiKey,
    }


    try {
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

        if (apiKey) {
            localStorage.setItem("apiKey", apiKey)
        }
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Error ao fazer a pergunta:", error);
    }

    return "ERROR!"
}

document.addEventListener("DOMContentLoaded", (event) => {
    const form = document.querySelector(".pergunta-box");
    const toggleBtn = document.querySelector("#toggle-theme");

    const temaSalvo = localStorage.getItem("tema");
    if (temaSalvo === "escuro") {
        document.body.classList.add("dark-mode");
        toggleBtn.textContent = "Modo Claro";
    } else {
        toggleBtn.textContent = "Modo Escuro";
    }



    const apiKey = localStorage.getItem("apiKey");

    if (apiKey) {
        document.querySelector("#api-key").value = apiKey;
    }
    carregarRespostas();
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const pergunta = document.querySelector("#pergunta").value;

        const resposta = await fazerPergunta(pergunta);

        adicionarResposta(resposta, pergunta);
        document.querySelector("#pergunta").value = "";
    });

    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        const isDark = document.body.classList.contains("dark-mode");
        localStorage.setItem("tema", isDark ? "escuro" : "claro");

        toggleBtn.textContent = isDark ? "Modo Claro" : "Modo Escuro";
    });
});