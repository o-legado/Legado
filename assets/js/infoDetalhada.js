
let season;
let jogadores;

async function carregarDados() {
    try {
        const resposta = await fetch("../data/equipe.json");
        season = await resposta.json();

        const resposta2 = await fetch("../data/jogadores.json");
        jogadores = await resposta2.json();
        
        
    } catch (error) {
        // console.error("Erro ao carregar JSON:", error);
    }
}

async function iniciarApp() {
    await carregarDados();
}
iniciarApp();
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

// Processa e busca os dados do jogador no JSON
const dadosPlayer = {
    start(divCard, nomeJogador, nomeEquipe) {
        let select = document.querySelector(".container_select").value;
        if (select == "treinoSelecionado" || select === "") {
            select = "treino1";
        }
        
        // Caminho exato no seu JSON: jogadores -> treinoX -> equipes -> NomeEquipe -> NomeJogador
        const killsArray = jogadores[select].equipes[nomeEquipe][nomeJogador];

        // Manda o array de kills para ser construído no HTML
        criarTrPlayer.start(divCard, nomeJogador, killsArray);
    }
}

// Cria o HTML detalhado dentro do card
const criarTrPlayer = {
    start(divCard, nomeJogador, killsArray){
        const nomeJogadorSemEspaço = nomeJogador.replace(/[^\w]/g, "");
        
        const divExistente = document.querySelector(`#${nomeJogadorSemEspaço}`)
        console.log(nomeJogador)
        if(divExistente){
            divExistente.remove()
            return
        }
        const div = document.createElement("div")
        div.setAttribute("class", "card_infoPlayer")
        div.setAttribute("id", nomeJogadorSemEspaço)

        const h2 = this.criarH2(nomeJogador)
        div.appendChild(h2)

        const divContainerCard = this.divContainerCard()
        div.appendChild(divContainerCard)

        // Envia para a criação das colunas de partidas
        this.divDesempenhoDetalhado(divContainerCard, killsArray)
        
        divCard.appendChild(div)
    },

    criarH2(nomeJogador){
        const h2 = document.createElement("h2")
        const span = document.createElement("span")
        span.textContent = nomeJogador
        h2.textContent = "📊 Desempenho de "
        h2.appendChild(span)
        return h2
    },

    divContainerCard(){
        const div = document.createElement("div")
        div.setAttribute("class", "desempenhoDetalhado_player")
        return div
    },

    divDesempenhoDetalhado(divContainerCard, killsArray){
        // Loop baseado no número de partidas (tamanho do array)
        killsArray.forEach((killDaPartida, index) => {
            const divPartida = document.createElement("div")
            divPartida.setAttribute("class", "desempenhoDetalhado_player_partida")
            
            // index + 1 para a Partida começar em 1 e não em 0
            const h3 = this.criarH3(index + 1)
            divPartida.appendChild(h3)
            
            // CORREÇÃO: Passamos apenas o valor daquela partida específica
            this.criarPKill(killDaPartida, divPartida)

            divContainerCard.appendChild(divPartida)
        })
    },

    criarH3(numberPartida){
        const h3 = document.createElement("h3")
        h3.textContent = `Partida ${numberPartida}`
        return h3
    },

    // Agora recebe o valor individual da kill, não o array
    criarPKill(valorKill, divPartida){
        const p = document.createElement("p")
        
        p.setAttribute("class", "killInfoPlayer")
        p.textContent = "Kills: "

        const span = document.createElement("span")
        span.textContent = valorKill ?? 0

        p.appendChild(span)
        divPartida.appendChild(p)
    }
}
    






// ESCUTADOR DE EVENTOS ÚNICO
document.addEventListener("click", (event) => {
    for (let i = 1; i <= 12; i++) {
        if (event.target.id === `info${i}`) {
            const tr = document.querySelector(`#tr${i}`);
            if (tr) {
                dados.start(tr, event.target, i);
            }
        }
    }

    const btn = event.target;
    if (btn.classList.contains("btnPlayer")) {
        // Pega os dados que escondemos no botão
        const jogador = btn.dataset.jogador;
        const equipe = btn.dataset.equipe;
        
        // Pega a div do card correspondente ao botão clicado
        const divCard = btn.closest(".kill_card"); 
        
        if (divCard) {
            dadosPlayer.start(divCard, jogador, equipe);
        }
    }
});








//aq forma os dados das equipes
const dados = {
    start(tr, click, index) {
        const select = document.querySelector(".container_select").value;
        this.processarEquipe(select, tr, click, index);
    },

    processarEquipe(seasonSelecionada, tr, click, index) {
        if (seasonSelecionada == "treinoSelecionado") {
            seasonSelecionada = "treino1"
        }
        const equipes = season[seasonSelecionada].equipes;

        equipes.forEach(equipe => {
            // Verifica se o nome da equipe bate com a classe da linha clicada
            if (tr.className === equipe.equipe) {
                // ENVIAMOS OS DETALHES COMPLETOS (O ARRAY)
                informaçãoDealhadaa.exibir(tr, index, equipe.detalhes, equipe.equipe);


            }
        });
    },

    ptsPosição(pos) {
        const dado = classificação.find(item => item.posição === pos);
        return dado ? dado.pts : 0;
    }
};

//aq ira criar o html de info detalhado
const informaçãoDealhadaa = {
    exibir(tr, index, listaDetalhes, nomeEquipe){
        //se existir o tr, clicando no btn ira remover
        const trExistente = document.querySelector(`#detalhe_linha_${index}`)
        if(trExistente){
            trExistente.remove()
            return
        }

        //se n tiver ira criar
        const trInfo = this.criaTr(tr, index)
        const tdInfo = this.criaTd(trInfo)
        const divDesempenhoDetalhado = this.divDesempenhoDetalhado(tdInfo)
        this.criarH2(divDesempenhoDetalhado, nomeEquipe)
        const divDesempenhoDetalhadoQuedas = this.divDesempenhoDetalhadoQuedas(divDesempenhoDetalhado)

        let totalQueda = 0
        let totalPartida = 0
        //ira criar todas as divs das partidas
        listaDetalhes.forEach(queda => {
            //aq pega os pts de cada posição
            const ptsPos = dados.ptsPosição(queda.posicao);
            //aq pega os pts total somando kill e pos, de cada partida
            totalQueda = queda.kills + ptsPos;
            //aq pega a pontuação total
            totalPartida += totalQueda
            
            const divDesempenhoPartida = this.criardivDesempenhoPartida(divDesempenhoDetalhadoQuedas, queda.queda, queda.posicao, queda.kills, ptsPos, totalPartida)
            divDesempenhoDetalhadoQuedas.appendChild(divDesempenhoPartida)
        });
        //criar a punição das equipes
        
        
        
    },
    //tr e td quando clica no btn
    criaTr(tr, index){
        //cria o tr, e add dps da tr principal
        const trInfo = document.createElement("tr")
        trInfo.setAttribute("id",`detalhe_linha_${index}`)
        tr.after(trInfo)
        return trInfo
    },
    criaTd(trInfo){
        const tdInfo = document.createElement("td")
        tdInfo.setAttribute("class", "td_infoPartida")
        tdInfo.colSpan = 7
        trInfo.appendChild(tdInfo)
        return tdInfo
    },

    //primeira div na tr
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

    //ira criar a div de cada partida, e as coisas dentro
    criardivDesempenhoPartida(divDesempenhoDetalhadoQuedas, index, posição, kills, ptsPos, totalPts){
        const div = document.createElement("div")
        div.setAttribute("class", "desempenhoDetalhado_quedas_partida")
        divDesempenhoDetalhadoQuedas.appendChild(div)

        const h3 = this.criarH3(index)
        const pPosição = this.criarP_posição(posição)
        const pKilss = this.criarP_Kilss(kills)
        const pPtsPos = this.criarP_ptsPos(ptsPos)
        const pPtsKills = this.criarPKills(kills)
        const pPtsTotal = this.criarPTotal(totalPts)
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
        console.log(p)
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
}

