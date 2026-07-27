import { obterJogadores } from "./semanalCriarTabela.js";

let dataClicada;

async function iniciar() {
    dataClicada = localStorage.getItem("dataDoXtreino");

    const jogadores = await obterJogadores();


    formarDadosJogadores.start(jogadores)

    setTimeout(() => {
        window.dispatchEvent(new CustomEvent("dadosProntos"));
    }, 50);
}
iniciar();


//jogadores
let ranking = []

const formarDadosJogadores = {
    
    start(equipesPlayers) {

        const mesDoHtmlSelecionado = document.querySelector("#mes").textContent.toLowerCase().trim();
        
        for (let mesEquipes in equipesPlayers) {
            if (mesEquipes === mesDoHtmlSelecionado) {
                
                const mesSelecionadoJson = equipesPlayers[mesEquipes];
                
                for (let indice in mesSelecionadoJson) {
                    
                    const dataTodosTreinos = mesSelecionadoJson[indice].data;
                    
                    if (dataTodosTreinos == dataClicada) {
                        const treinoJogadores = mesSelecionadoJson[indice];

                        
                        this.pegarDadosDosJogadores(treinoJogadores);
                        break;
                    }
                }
            }
        }

    },
    pegarDadosDosJogadores(treinoJogadores) {
        // ranking = []
        
    
        // Percorre os nomes das equipes
        for (let nomeEquipe in treinoJogadores.equipes) {
    
            // Armazena todos os jogadores de uma equipe
            const jogadoresEquipe = treinoJogadores.equipes[nomeEquipe]
    
            // Percorre todos os jogadores de uma equipe
            for (let nomeJogador in jogadoresEquipe) {
    
                // Armazena a soma total de cada jogador
                let somaKills = 0
    
                let logoPlayer = jogadoresEquipe[nomeJogador].logo

                // Armazena as partidas de cada jogador (array de kills)
                let jogadoresPartidaKillArray = jogadoresEquipe[nomeJogador].dados
    
                // Percorre cada kill que o jogador fez
                for (let i = 0; i < jogadoresPartidaKillArray.length; i++) {
                    // Soma e armazena as kills
                    somaKills += jogadoresPartidaKillArray[i]
                }
    
                this.ordemDoRanking(nomeEquipe, nomeJogador, jogadoresPartidaKillArray, somaKills, logoPlayer)
            }
        }
    
        // Ordena quem tem mais pontos (abates)
        ranking.sort((a, b) => b.pts - a.pts)
    
        // Aplica as posições de cada jogador baseado no index
        ranking.forEach((jogador, index) => {
            jogador.posição = index + 1
        })
    
        // Envia o ranking pronto para renderizar na tela
        criarRankJogador.start(ranking)
        
    },

    ordemDoRanking(nomeEquipe, nomeJogador, jogadoresPartidaKillArray, somaKills, logoPlayer) {
        const infoJogador = {
            equipe: nomeEquipe,
            jogador: nomeJogador,
            kills: jogadoresPartidaKillArray,
            pts: somaKills,
            logoPlayer: logoPlayer
        }
        ranking.push(infoJogador)
    }
}

// OBJETO QUE GERENCIA A RENDERIZAÇÃO E O ESTILO CSS (Mantido seu padrão de encadeamento)
const criarRankJogador = {
    start(objJogadores) {
        // Evita erro caso a variável global não tenha sido declarada no escopo
        if (typeof jogadoresExportadas !== 'undefined') {
            jogadoresExportadas.push(objJogadores)
        }

        const div = document.querySelector(".top_kills_grid")
        if (div) div.textContent = ""

        objJogadores.forEach(players => {
            this.criaContainerJogador(players.posição, players.jogador, players.pts, players.equipe)
        })
    },

    criaContainerJogador(posicao, nomeJogador, kill, equipe) {
        const top_kills_grid = document.querySelector(".top_kills_grid")

        // 1. DIV PRINCIPAL (Card externo)
        const containerJogador = document.createElement("div")
        containerJogador.setAttribute("name", `playerInfo${posicao}`)

        // Lógica de classes de rank mantida para o seu CSS
        let classeRank = "kill_card"
        if (posicao == 1) classeRank += " rank-1"
        else if (posicao == 2) classeRank += " rank-2"
        else if (posicao == 3) classeRank += " rank-3"
        containerJogador.setAttribute("class", classeRank)

        // 2. DIV INTERNA (Onde as informações ficam agrupadas)
        const cardContent = document.createElement("div")
        cardContent.setAttribute("class", "card_content")

        containerJogador.appendChild(cardContent)
        if (top_kills_grid) top_kills_grid.appendChild(containerJogador)

        // Passa a DIV INTERNA (cardContent) adiante na cadeia
        this.criaPosição(cardContent, posicao, nomeJogador, kill, equipe)
    },

    criaPosição(cardContent, posicao, nomeJogador, kill, equipe) {
        const p = document.createElement("p")
        p.setAttribute("class", "badge")
        p.textContent = posicao
        cardContent.appendChild(p)
        this.criarNomeEquipe(cardContent, posicao, nomeJogador, kill, equipe)
    },

    criarNomeEquipe(cardContent, posicao, nomeJogador, kill, equipe) {
        const divPlayerInfo = document.createElement("div")
        divPlayerInfo.setAttribute("class", "player_info")
        cardContent.appendChild(divPlayerInfo)

        const nick = document.createElement("h4")
        nick.textContent = nomeJogador
        divPlayerInfo.appendChild(nick)

        const nomeEquipe = document.createElement("p")
        nomeEquipe.textContent = equipe
        divPlayerInfo.appendChild(nomeEquipe)

        this.criarKill(cardContent, posicao, nomeJogador, kill, equipe)
    },

    criarKill(cardContent, posicao, nomeJogador, kill, equipe) {
        const divKill = document.createElement("div")
        divKill.setAttribute("class", "kill_stats")
        cardContent.appendChild(divKill)

        const nomeKills = document.createElement("span")
        nomeKills.setAttribute("class", "lbl")
        nomeKills.textContent = "Kills"
        divKill.appendChild(nomeKills)

        const kills = document.createElement("span")
        kills.setAttribute("class", "num")
        kills.textContent = kill
        divKill.appendChild(kills)

        this.criarBtn(cardContent, posicao, nomeJogador, equipe)
    },

    criarBtn(cardContent, posicao, nomeJogador, equipe) {
        const btn = document.createElement("button")
        btn.setAttribute("class", "btnPlayer")
        btn.setAttribute("id", `infoPlayer`)

        // Dataset para manter o modal ou informações detalhadas funcionando
        btn.dataset.jogador = nomeJogador;
        btn.dataset.equipe = equipe;

        btn.textContent = "📋"
        cardContent.appendChild(btn)
    }
}

export {ranking}
