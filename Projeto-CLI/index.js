const promptB = require('prompt-sync');
const prompt = promptB()

const URL = "https://viacep.com.br/ws/";

//  {
//     "cep": "01001-000",
//     "logradouro": "Praça da Sé",
//     "complemento": "lado ímpar",
//     "unidade": "",
//     "bairro": "Sé",
//     "localidade": "São Paulo",
//     "uf": "SP",
//     "estado": "São Paulo",
//     "regiao": "Sudeste",
//     "ibge": "3550308",
//     "gia": "1004",
//     "ddd": "11",
//     "siafi": "7107"
// }

async function getCep(cep){
    let response = await fetch(`${URL}${cep}/json/`);
    let data = await response.json();
    return data;
}

async function main() {
    console.log("Bem-vindo ao CLI de Consulta de CEP!");

    let data = {};
    let cep = "";
    
    try {
        cep = prompt("Digite o CEP que deseja consultar: "); // 59870-000
        cep = cep.replace("-", ''); // 59870000
        if (cep.length !== 8) {
            console.log("O formato do CEP é inválido.");
            return;
        }
        data = await getCep(cep);
    } catch (error) {
        console.error("CEP não existe!");
        return;
    }
    

    if (data.erro) {
        console.error("CEP inválido.");
        return;
    } else {
        console.log(`O CEP: ${data.cep}`);

        console.log(`Endereço: ${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`);

        console.log("Informações disponíveis:");
        for (let key of Object.keys(data)){
            if (data[key] != "") {
                console.log(`${key}`);
            }
        }


        let propriedade = prompt("Deseja ver alguma informação específica? ").toLowerCase();

        if (data[propriedade]){
            console.log(`A propriedade ${propriedade} é: ${data[propriedade]}`);

        } else {
            console.log("Propriedade não encontrada.");
        }
    }
}

main();