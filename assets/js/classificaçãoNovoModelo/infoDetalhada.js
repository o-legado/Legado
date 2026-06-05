
let jogadores 
let equipes 
let dataClicada
let trEquipe
let ptsPosiçãoTotal = 0;
async function carregarDados() {
    const resposta = await fetch("../../../assets/data/xtreinoMensal/equipe.json")
    equipes = await resposta.json()


    const resposta2 = await fetch("../../../assets/data/xtreinoMensal/jogadores.json")
    jogadores = await resposta2.json()
}
//o js para e espera pegar todos os dados no json
async function iniciarApp() {
    await carregarDados()
    
    dataClicada = localStorage.getItem("dataDoXtreino");
}
iniciarApp()

const classificação = [
    { posição: 1, pts: 12 },
    { posição: 2, pts: 9 },
    { posição: 3, pts: 8 },
    { posição: 4, pts: 7 },
    { posição: 5, pts: 6 },
    { posição: 6, pts: 5 },
    { posição: 7, pts: 4 },
    { posição: 8, pts: 3 },
    { posição: 9, pts: 2 },
    { posição: 10, pts: 1 },
    { posição: 11, pts: 0 },
    { posição: 12, pts: 0 },
    { posição: 13, pts: 0 }
];


//aq ira descobrir qul btn foi clicado
document.addEventListener("click", function (e) {
    if(e.target.textContent === '📋') {

        if(e.target.id == "infoEquipe"){

            const btnClicado = e.target
            trEquipe = pegarTrEquipe(btnClicado)
            organizarDadosEquipe.start(equipes, btnClicado, trEquipe)

        } else if(e.target.id == "infoPlayer"){
            const btnClicado = e.target
            const namePlayer = pegarNamePlayer(btnClicado)
            const namePLayerEquipe = pegarNamePlayerEquipe(btnClicado)
            organizarDadosPlayer.start(jogadores, btnClicado, namePlayer, namePLayerEquipe)
        }
        
    }
})

//aq ira pegar o tr da equipe para usar como base para criar o tr info
function pegarTrEquipe(btnClicado){
    const trEquipe = btnClicado.parentElement.parentElement
    return trEquipe
}
function pegarNamePlayer(btnClicado){
    const div = btnClicado.parentElement;
    const nomeJogador = div.querySelector(".player_info h4");

    return nomeJogador.textContent
}
function pegarNamePlayerEquipe(btnClicado){

    const card = btnClicado.parentElement;

    const nomeEquipe = card.querySelector(".player_info p").textContent;
    return nomeEquipe
}





//aq ira organizar os dados especifico no btn clicado
const organizarDadosEquipe = {

    // Seleciona o mês e filtra o treino correto baseado na data clicada
    start(equipes, btnClicado, trEquipe) {
        const mesDoHtmlSelecionado = document.querySelector("#mes").textContent.toLowerCase().trim();
        

        for (let mesEquipes in equipes) {
            if (mesEquipes === mesDoHtmlSelecionado) {
                const mesSelecionadoJson = equipes[mesEquipes];

                for (let indice in mesSelecionadoJson) {
                    const dataTodosTreinos = mesSelecionadoJson[indice].data;
                    
                    if (dataTodosTreinos == dataClicada) {
                        const treinoEquipe = mesSelecionadoJson[indice];
                        this.chegarNoDetalhes(treinoEquipe, btnClicado, trEquipe)
                        break;
                    }
                }
            }
        }
    },

    // Processa os dados, soma os pontos, ordena e define as posições reais da tabela
    chegarNoDetalhes(treinoEquipe, btnClicado, trEquipe) {
        const equipesArray = treinoEquipe.equipes

        let contador = 1
        let tdEquipe = btnClicado.parentElement
        do{
            tdEquipe = tdEquipe.previousElementSibling
            contador++
        } while (contador <= 5)
        const tdNameEquipe = tdEquipe.textContent

        equipesArray.forEach(equipe => {

            if(equipe.equipe == tdNameEquipe){
                criarHtmlEquipeInfo.start(trEquipe, equipe)
            }
            
        });
        
    }

};

const criarHtmlEquipeInfo = {

    start(trEquipe, equipe){

        //se existir o tr, clicando no btn ira remover
        const trExistente = document.querySelector(`#detalhe_linha`)
        if(trExistente){
            trExistente.remove()
            return
        }


        const trInfo = document.createElement("tr")
        trInfo.setAttribute("id",`detalhe_linha`)
        trEquipe.after(trInfo)
        const tdInfo = this.criaTd(trInfo)
        const divDesempenhoDetalhado = this.divDesempenhoDetalhado(tdInfo)
        
        const criarH2 = this.criarH2(divDesempenhoDetalhado, equipe.equipe)
        const divDesempenhoDetalhadoQuedas = this.divDesempenhoDetalhadoQuedas(divDesempenhoDetalhado)

        //aq cria a div de penalidade
        // this.criarPenalidade(divDesempenhoDetalhadoQuedas)


        this.organizarDadosEquipe(equipe, trEquipe, divDesempenhoDetalhadoQuedas)

    },
    criaTd(trInfo){
        const tdInfo = document.createElement("td")
        tdInfo.setAttribute("class", "td_infoPartida")
        tdInfo.colSpan = 7
        trInfo.appendChild(tdInfo)
        return tdInfo
        
    },
    divDesempenhoDetalhado(tdInfo){
        const div = document.createElement("div")
        div.setAttribute("class", "desempenhoDetalhado")
        tdInfo.appendChild(div)
        return div
    },
    criarH2(divDesempenhoDetalhado, nomeEquipe){
        const h2 = document.createElement("h2")
        const span = document.createElement("span")
        span.textContent = nomeEquipe
        h2.textContent = `📊 Desempenho Detalhado - `
        h2.appendChild(span)
        divDesempenhoDetalhado.appendChild(h2)
        return
    },
    divDesempenhoDetalhadoQuedas(divDesempenhoDetalhado){
        const div = document.createElement("div")
        div.setAttribute("class", "desempenhoDetalhado_quedas")
        divDesempenhoDetalhado.appendChild(div)
        return div
    },



    //aq ira organizar os dados
    organizarDadosEquipe(equipe, trEquipe, divDesempenhoDetalhadoQuedas){
        let queda;
        let kills;
        let posicao;
        equipe.detalhes.forEach(element => {
            queda = element.queda
            kills = element.kills
            posicao = element.posicao

            //aq ira chama  a função para pegar os pts da posição
            const ptsPosição = this.ptsPosição(posicao)
            // const totalPosiçãoPts = this.ptsTotalPosição(ptsPosição)

            this.criardivDesempenhoPartida(divDesempenhoDetalhadoQuedas, queda, posicao, kills, ptsPosição)
        });
    },
    ptsPosição(posicao){
        let pontuação
        classificação.forEach(element => {
            if(posicao == element.posição){
                pontuação = element.pts
            }
        });
        return pontuação
    },
    // ptsTotalPosição(ptsPosição){
        
    //     ptsPosiçãoTotal += ptsPosição
    //     console.log(ptsPosiçãoTotal)
    // },


    //aq ira criar cada div
    criardivDesempenhoPartida(divDesempenhoDetalhadoQuedas, index, posição, kills, ptsPos, totalPts){
        const div = document.createElement("div")
        div.setAttribute("class", "desempenhoDetalhado_quedas_partida")
        divDesempenhoDetalhadoQuedas.appendChild(div)

        const h3 = this.criarH3(index)
        const pPosição = this.criarP_posição(posição)
        const pKilss = this.criarP_Kilss(kills)
        const pPtsPos = this.criarP_ptsPos(ptsPos)
        const pPtsKills = this.criarPKills(kills)
        const totalPartida = ptsPos + kills
        const pPtsTotal = this.criarPTotal(totalPartida)
        div.appendChild(h3)
        div.appendChild(pPosição)
        div.appendChild(pKilss)
        div.appendChild(pPtsPos)
        div.appendChild(pPtsKills)
        div.appendChild(pPtsTotal)
        
        return div
    },
    criarH3(index){
        const h3 = document.createElement("h3")
        const span = document.createElement("span")
        span.textContent = index
        h3.textContent = `Partida `
        h3.appendChild(span)
        return h3
    },
    criarP_posição(posição){
        let p = document.createElement("p")
        let span = document.createElement("span")
        span.textContent = posição
        p.setAttribute("class", "desempenhoDetalhado_quedas_partida_posição")
        
        p.textContent = "posição:"
        
        p.appendChild(span)
        if(posição === 13){
            span.textContent = "não jogou"
        }
        return p

    },
    criarP_Kilss(kills){
        const p = document.createElement("p")
        const span = document.createElement("span")
        span.textContent = kills
        p.setAttribute("class", "desempenhoDetalhado_quedas_partida_kills")
        p.textContent = "kills:"
        p.appendChild(span)
        return p

    },
    criarP_ptsPos(ptsPos){
        const p = document.createElement("p")
        const span = document.createElement("span")
        span.textContent = ptsPos
        p.setAttribute("class", "desempenhoDetalhado_quedas_ptsPosição")
        p.textContent = "Pts posição:"
        p.appendChild(span)
        return p

    },
    criarPKills(kills){
        const p = document.createElement("p")
        const span = document.createElement("span")
        span.textContent = kills
        p.setAttribute("class", "desempenhoDetalhado_quedas_ptsKills")
        p.textContent = "Pts kills:"
        p.appendChild(span)
        return p

    },
    criarPTotal(totalPartida){
        const p = document.createElement("p")
        const span = document.createElement("span")
        const soma = totalPartida
        span.textContent = soma
        p.setAttribute("class", "desempenhoDetalhado_quedas_total")
        p.textContent = "Total: "
        p.appendChild(span)
        
        return p

    },

    //aq ira criar a div penalidade
    criarPenalidade(divCards){
        const divPenalidade = document.createElement("div")
        divCards.after(divPenalidade)

        divPenalidade.setAttribute("class", "desempenhoDetalhado_penalidade")
        const h2 = this.criarH2Penalidade()
        const pDescrição = this.criarPdescrição()
        divPenalidade.appendChild(h2)
        divPenalidade.appendChild(pDescrição)
    },
    criarH2Penalidade(){
        const h2 = document.createElement("h2")
        h2.textContent = "⚠️Penalidade Aplicada"
        return h2
    },
    criarPdescrição(){
        const p = document.createElement("p")
        const span = document.createElement("span")
        span.textContent = "ola mundo"
        p.textContent = "📋 Motivo: "
        p.appendChild(span)
        return p
    }




}



const organizarDadosPlayer ={
    start(jogadores, btnClicado, namePlayer, namePLayerEquipe){
        const mesDoHtmlSelecionado = document.querySelector("#mes").textContent.toLowerCase().trim();

        for (let mesJogadores in jogadores) {
            if (mesJogadores === mesDoHtmlSelecionado) {
                const mesSelecionadoJson = jogadores[mesJogadores];

                for (let indice in mesSelecionadoJson) {
                    const dataTodosTreinos = mesSelecionadoJson[indice].data;
                    
                    if (dataTodosTreinos == dataClicada) {
                        const treinoEquipe = mesSelecionadoJson[indice];
                        // this.chegarNoDetalhes(treinoEquipe, btnClicado, trEquipe)
                        criarHtmlJogadorInfo.start(treinoEquipe, btnClicado, namePlayer, namePLayerEquipe)
                        break;
                    }
                }
            }
        }
    }
}

const criarHtmlJogadorInfo = {

    start(treinoPlayer, btnClicado, namePlayer, namePLayerEquipe){

        // Se existir a div, clicando no botão irá remover
        const nomeJogadorSemEspaço = namePlayer.replace(/[^\w]/g, "");

        const divExistente = document.querySelector(`#${nomeJogadorSemEspaço}`);

        if(divExistente){
            divExistente.remove();
            return;
        }

        const divPai = btnClicado.parentElement;

        const div = document.createElement("div");
        div.setAttribute("class", "card_infoPlayer");
        div.setAttribute("id", nomeJogadorSemEspaço);

        const h2 = this.criarH2(namePlayer);
        div.appendChild(h2);

        const divContainerCard = this.divContainerCard();
        div.appendChild(divContainerCard);

        // Adiciona toda a estrutura após o card do jogador
        divPai.after(div);

        // Seleciona o array das kills do player
        const equipes = treinoPlayer.equipes;
        const arrayKills = equipes[namePLayerEquipe][namePlayer];

        this.divDesempenhoDetalhado(divContainerCard, arrayKills);

        console.log(div);
    },

    criarH2(nomeJogador){
        const h2 = document.createElement("h2");

        const span = document.createElement("span");
        span.textContent = nomeJogador;

        h2.textContent = "📊 Desempenho de ";
        h2.appendChild(span);

        return h2;
    },

    divContainerCard(){
        const div = document.createElement("div");
        div.setAttribute("class", "desempenhoDetalhado_player");

        return div;
    },

    divDesempenhoDetalhado(divContainerCard, killsArray){

        killsArray.forEach((killDaPartida, index) => {

            const divPartida = document.createElement("div");
            divPartida.setAttribute(
                "class",
                "desempenhoDetalhado_player_partida"
            );

            const h3 = this.criarH3(index + 1);
            divPartida.appendChild(h3);

            this.criarPKill(killDaPartida, divPartida);

            divContainerCard.appendChild(divPartida);
        });

    },

    criarH3(numberPartida){
        const h3 = document.createElement("h3");
        h3.textContent = `Partida ${numberPartida}`;

        return h3;
    },

    criarPKill(valorKill, divPartida){

        const p = document.createElement("p");
        p.setAttribute("class", "killInfoPlayer");
        p.textContent = "Kills: ";

        const span = document.createElement("span");
        span.textContent = valorKill ?? 0;

        p.appendChild(span);
        divPartida.appendChild(p);

        return p;
    }

};


//desempenhoDetalhado_penalidade