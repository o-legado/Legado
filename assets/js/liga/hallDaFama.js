import { ranking, resultadoFinal as equipes } from "./ligaCriarTabela.js";

const selecionarDadosCampeãos = {
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
        const img = document.querySelector(".avatar-container")
        img.setAttribute("src", ranking[0].logoPlayer)
        if (name && ranking[0]) {
            name.textContent = ranking[0].jogador; // Exemplo para preencher o nick do MVP na tela
            kills.textContent = ranking[0].pts
            nameEquipe.textContent = ranking[0].equipe
        }
    }
}

const selecionarDadosTop3 ={
    start(equipes, ranking){
        if (!equipes || equipes.length === 0) return;

        //top 1 img
        const img1 = document.querySelector(".logo-primeiro")
        const logo1 = equipes[0].logo; 
        img1.setAttribute("src", logo1);

        //top 1 nome da equipe
        const name = document.querySelector("#top3-1")
        name.textContent = equipes[0].equipe

        //top 1 pontos finais
        const pts = document.querySelector("#top3-pts")
        pts.textContent = equipes[0].pts

        ///top 2 img 
        const img2 = document.querySelector(".logo-segundo")
        const logo2 = equipes[1].logo; 
        img2.setAttribute("src", logo2);

        //top 2 nome da equipe
        const name2 = document.querySelector("#top3-2")
        name2.textContent = equipes[1].equipe

        //top 2 pontos finais
        const pts2 = document.querySelector("#top3-2pts")
        pts2.textContent = equipes[1].pts

        ///top 3 img 
        const img3 = document.querySelector(".logo-terceiro")
        const logo3 = equipes[2].logo; 
        img3.setAttribute("src", logo3);

        //top 3 nome da equipe
        const name3 = document.querySelector("#top3-3")
        name3.textContent = equipes[2].equipe

        //top 3 pontos finais
        const pts3 = document.querySelector("#top3-3pts")
        pts3.textContent = equipes[2].pts

        this.criarTop3Player(ranking)
    },
    criarTop3Player(ranking){
        console.log(ranking)

        //top 1
        const name1 = document.querySelector("#top1KillName")
        const kill1 = document.querySelector("#top1Killkills")
        const nameEquipe1 = document.querySelector("#top1killEquipe")
        const img1 = document.querySelector(".avatar-ouro")
        img1.setAttribute("src", ranking[0].logoPlayer)
        name1.textContent = ranking[0].jogador
        kill1.textContent = ranking[0].pts
        nameEquipe1.textContent = ranking[0].equipe

        //top 2
        const name2 = document.querySelector("#top2KillName")
        const kill2 = document.querySelector("#top2Killkills")
        const nameEquipe2 = document.querySelector("#top2killEquipe")
        const img2 = document.querySelector(".avatar-prata")
        img2.setAttribute("src", ranking[1].logoPlayer)
        name2.textContent = ranking[1].jogador
        kill2.textContent = ranking[1].pts
        nameEquipe2.textContent = ranking[1].equipe

         //top 3
        const name3 = document.querySelector("#top3KillName")
        const kill3 = document.querySelector("#top3Killkills")
        const nameEquipe3 = document.querySelector("#top3killEquipe")
        const img3 = document.querySelector(".avatar-bronze")
        img3.setAttribute("src", ranking[2].logoPlayer)
        name3.textContent = ranking[2].jogador
        kill3.textContent = ranking[2].pts
        nameEquipe3.textContent = ranking[2].equipe
    }
}


// 🎯 O SEGREDO ESTÁ AQUI:
// O script fica esperando o sinal do 'criarTabela.js'. Quando o sinal chega, ele executa!
window.addEventListener("dadosProntos", () => {
    selecionarDadosCampeãos.start(equipes, ranking);
    selecionarDadosTop3.start(equipes,ranking)
});