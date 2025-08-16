const URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

function carregarRespostas() {
    const respostasDiv = document.querySelector("#respostas");
    const respostasSalvas = localStorage.getItem("respostas");
    let lengthRespostas = 0;
    let respostas = [];

    try {
        respostas = respostasSalvas ? JSON.parse(respostasSalvas) : [];
    } catch (e) {
        console.warn("Erro ao carregar respostas do localStorage");
    }


    respostas.forEach(({ pergunta, resposta }) => {
        adicionarResposta(resposta, pergunta, false);
    });
}

function adicionarResposta(resposta, pergunta, isSetItem = true) {
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
    if (isSetItem){
        localStorage.setItem("respostas", JSON.stringify([...JSON.parse(localStorage.getItem("respostas") || "[]"), { pergunta, resposta }]));
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }
}

async function fazerPergunta(pergunta) {
    const apiKey = document.querySelector("#api-key").value;

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

    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });

    document.getElementById("exportPdfBtn").addEventListener("click", () => {
        // Seleciona o chat inteiro
        const element = document.getElementById("respostas");

        const opt = {
            margin:       [10, 10, 10, 10], // top, left, bottom, right
            filename:     'chat-conversa.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] } // evita que divs quebrem no meio
        };


        // Gera o PDF
        html2pdf().set(opt).from(element).save();
    });
});
