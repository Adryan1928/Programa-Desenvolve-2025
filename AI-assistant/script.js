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
    const contador = document.querySelector("#contador");

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

        contador.textContent = `0 / 100 caracteres`;
        document.querySelector("#perguntar").disabled = true;
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Error ao fazer a pergunta:", error);
    }

    return "ERROR!"
}

document.addEventListener("DOMContentLoaded", (event) => {
    const form = document.querySelector(".pergunta-box");
    const toggleBtn = document.querySelector("#toggle-theme");
    const contador = document.querySelector("#contador");

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

    document.querySelector("#exportPdfBtn").addEventListener("click", () => {
        const element = document.querySelector("#respostas");
        const elementToExport = element.cloneNode(true);
        elementToExport.style.width = "100%";

        const opt = {
            margin:       [10, 10, 10, 10],
            filename:     'chat-conversa.pdf',
            image:        { type: 'jpeg', quality: 1, width: 100 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
        };


        // Gera o PDF
        html2pdf().set(opt).from(elementToExport).save();
    });

    document.querySelector("#pergunta").addEventListener("input", (event) => {
        const inputLength = event.target.value.length;
        contador.textContent = `${inputLength} / 100 caracteres`;
        document.querySelector("#perguntar").disabled = inputLength === 0 || inputLength > 100;
    });

    document.querySelector("#btnLimpar").addEventListener("click", () => {
        const respostas = document.querySelector("#respostas");
        respostas.innerHTML = "";
        respostas.style.display = "none";
        localStorage.removeItem("respostas");
    });

    document.querySelector("#btnCopiar").addEventListener("click", () => {
        const resposta = document.querySelector("#respostas").lastElementChild;
        navigator.clipboard.writeText(resposta.innerText).then(() => {
            alert("Resposta copiada para a área de transferência!");
        }).catch(err => {
            console.error('Erro ao copiar texto: ', err);
        });
    });

});
