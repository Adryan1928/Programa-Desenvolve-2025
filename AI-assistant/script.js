const URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

function carregarRespostas() {
    const respostasSalvas = localStorage.getItem("respostas");
    let respostas = [];
    try {
        respostas = respostasSalvas ? JSON.parse(respostasSalvas) : [];
    } catch (e) {
        console.warn("Erro ao carregar respostas do localStorage");
    }

    respostas.forEach(({ pergunta, resposta }) => {
        adicionarResposta(resposta, pergunta);
    });
}

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
    localStorage.setItem("respostas", JSON.stringify([...JSON.parse(localStorage.getItem("respostas") || "[]"), { pergunta, resposta }]));
}

async function fazerPergunta(pergunta) {
    const apiKey = document.getElementById("api-key").value;

    if (!pergunta || !pergunta.trim()) {
        return "⚠️ Digite uma pergunta antes de enviar.";
    }

    if (!apiKey || !apiKey.trim()) {
        return "⚠️ Insira sua API Key antes de continuar.";
    }

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

        if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            console.warn("Resposta da API não está no formato esperado:", data);
            return "❌ A API não retornou conteúdo válido.";
        }

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

    const apiKey = localStorage.getItem("apiKey");

    if (apiKey) {
        document.getElementById("api-key").value = apiKey;
    }
    carregarRespostas();
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const pergunta = document.getElementById("pergunta").value;

        const resposta = await fazerPergunta(pergunta);

        adicionarResposta(resposta, pergunta);
        document.getElementById("pergunta").value = "";
    });
});
