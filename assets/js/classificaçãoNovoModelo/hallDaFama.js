import { ranking, resultadoFinal as equipes } from "./criarTabela.js";

const selecionarDados = {
    start(equipes, ranking){

        const img = document.querySelector(".equipe-logo-placeholder");
        const pNameEquipe = document.querySelector(".campeao-equipe");
        const pPts = document.querySelector("#pts")
        const pKills = document.querySelector("#kills")
        const pBooyah = document.querySelector("#booyah")

        // Validação de segurança
        if (!equipes || equipes.length === 0) return;

        pPts.textContent = equipes[0].pts
        pNameEquipe.textContent = equipes[0].equipe;
        pKills.textContent = equipes[0].abate
        pBooyah.textContent = equipes[0].booyah
        
        // Pega o caminho ajustado com ../../../ que você alterou no JSON
        const logo = equipes[0].logo; 
        img.setAttribute("src", logo);
        this.mvp(ranking);
    },
    mvp(ranking){
        const name = document.querySelector(".mvp-nick")
        const kills = document.querySelector(".score-numero")
        const nameEquipe = document.querySelector(".detalhe-seta")
        console.log(ranking[0])
        if (name && ranking[0]) {
            name.textContent = ranking[0].jogador; // Exemplo para preencher o nick do MVP na tela
            kills.textContent = ranking[0].pts
            nameEquipe.textContent = ranking[0].equipe
        }
    }
}

// 🎯 O SEGREDO ESTÁ AQUI:
// O script fica esperando o sinal do 'criarTabela.js'. Quando o sinal chega, ele executa!
window.addEventListener("dadosProntos", () => {
    selecionarDados.start(equipes, ranking);
});