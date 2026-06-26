
let jogadores 
let equipes 
let dataClicada
const resultadoFinal = [];
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
    organizarDadosEquipe.start(equipes)
    formarDadosJogadores.start(jogadores)

    // 🔥 ADICIONE ISSO AQUI:
    // Agora sim! Avisa que TUDO (equipes e ranking) está 100% pronto.
    setTimeout(() => {
        window.dispatchEvent(new CustomEvent("dadosProntos"));
    }, 50);

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
    { kill: 1 },
]

//aq formula os dados e organiza em ordem decrescente
const organizarDadosEquipe = {

    // Seleciona o mês e filtra o treino correto baseado na data clicada
    start(equipes) {
        const mesDoHtmlSelecionado = document.querySelector("#mes").textContent.toLowerCase().trim();

        for (let mesEquipes in equipes) {
            if (mesEquipes === mesDoHtmlSelecionado) {
                const mesSelecionadoJson = equipes[mesEquipes];

                for (let indice in mesSelecionadoJson) {
                    const dataTodosTreinos = mesSelecionadoJson[indice].data;

                    if (dataTodosTreinos == dataClicada) {
                        const treinoEquipe = mesSelecionadoJson[indice];
                        this.pegarDadosDasEquipes(treinoEquipe);
                        break;
                    }
                }
            }
        }
    },

    // Processa os dados, soma os pontos, ordena e define as posições reais da tabela
    pegarDadosDasEquipes(treinoEquipe) {
        
        const equipes = treinoEquipe.equipes;

        equipes.forEach(infoEquipes => {
            let kill = 0;
            let posicaoPts = 0;
            let booyah = 0;
            let equipePts;
            

            const nomeEquipe = infoEquipes.equipe;
            const arrayQuedas = infoEquipes.detalhes;
            const logo = infoEquipes.logo;
            const punição = Number(infoEquipes.puniçãoPontos)
            

            // BLINDAGEM: Pega a punição do seu JSON mesmo se estiver escrita com ou sem acento
            const punicaoDescricao = infoEquipes.puniçãoDescrição
            const punicaoPontosAtual = infoEquipes.puniçãoPontos

            // Calcula abates, pontos por posição e booyahs de todas as quedas
            arrayQuedas.forEach(objQuedas => {
                const numeroDaKills = Number(objQuedas.kills || 0);

                // Pega a posição da queda vinda do seu JSON ("posicao")
                const numeroDaPosicao = Number(objQuedas.posicao || objQuedas.posição || 0);

                if (numeroDaPosicao === 1) booyah++;

                kill = this.somarPontosKill(kill, numeroDaKills);
                posicaoPts = this.somaPontosPosicao(posicaoPts, numeroDaPosicao);
            });

            // Total de pontos: (Soma dos Abates + Soma dos Pontos de Posição) - Punição aplicada
            if(punicaoPontosAtual !== "" && punicaoPontosAtual !== null && punicaoPontosAtual !== undefined){
                equipePts = (kill + posicaoPts - punicaoPontosAtual)
            }else{
                equipePts = (kill + posicaoPts)
            }

            resultadoFinal.push({
                posicao: 0, // Será definida logo abaixo após a ordenação decrescente
                equipe: nomeEquipe,
                quedas: arrayQuedas.length,
                abate: kill,
                booyah: booyah,
                pts: equipePts,
                data: treinoEquipe.data,
                logo: logo,
                punicaoPontosAtual: punicaoPontosAtual,
                puniçãoPontos: punição
                
            });
        });

        // 1. ORDENAÇÃO DECRESCENTE (Quem somou mais pontos vai para o topo da tabela)
        resultadoFinal.sort((a, b) => b.pts - a.pts);

        // 2. ATRIBUIÇÃO DA POSIÇÃO REAL DE CLASSIFICAÇÃO
        // O array já está ordenado. O primeiro (índice 0) vira 1º colocado, o segundo vira 2º, etc.
        resultadoFinal.forEach((item, index) => {
            item.posicao = index + 1;
        });

       

        // Envia os dados ordenados e com pontos de posição computados para a tabela
        enviarDadosTabela.start(resultadoFinal);
    },

    somarPontosKill(kill, numeroDaKills) {
        return kill + numeroDaKills;
    },

    somaPontosPosicao(posicaoPts, numeroDaPosicao) {
        let pontoGanhoPorPartida = 0;

        // BLINDAGEM: Varre a lista global aceitando o formato com ou sem acento para não zerar os pontos
        classificação.forEach(objClassificacaoPosicao => {
            const posTabela = objClassificacaoPosicao.posição !== undefined ? objClassificacaoPosicao.posição : objClassificacaoPosicao.posicao;

            if (posTabela == numeroDaPosicao) {
                pontoGanhoPorPartida = objClassificacaoPosicao.pts;
            }
        });

        return pontoGanhoPorPartida + posicaoPts;
    }
};

//aq ira enviar os dados para fazer a tabela organizado
const enviarDadosTabela = {
    start(classificação) {
        //aq ira perccorer o array da classificação
        classificação.forEach(objEquipe => {
            const posição = objEquipe.posicao
            const equipe = objEquipe.equipe
            const quedas = objEquipe.quedas
            const abate = objEquipe.abate
            const booyah = objEquipe.booyah
            const pts = objEquipe.pts
            const data = objEquipe.data
            const logo = objEquipe.logo
            const punicaoPontosAtual = objEquipe.punicaoPontosAtual
            const puniçãoPontos = objEquipe.puniçãoPontos

            criarTabela.start(posição, equipe, quedas, abate, booyah, pts, data, logo, puniçãoPontos)
           
        });
    }
}

//aq ira montar a tabela
const criarTabela = {

    start(posição, equipe, quedas, abate, booyah, pts, data, logo, puniçãoPontos) {
        this.posição = posição
        this.equipe = equipe
        this.quedas = quedas

        this.abate = abate
        this.booyah = booyah
        this.pts = pts
        this.data = data
        this.logo = logo
        const tbody = document.querySelector("#tbody")
        this.criarTr(tbody, posição, equipe, puniçãoPontos)
        this.mudarData(data)
    },
    criarTr(tbody, posição, equipe, puniçãoPontos) {
        const createTr = document.createElement("tr")
        createTr.setAttribute("id", `tr${posição}`)
        createTr.setAttribute("name", `info${posição}`)
        createTr.setAttribute("class", equipe)
        const tr = tbody.appendChild(createTr)

        this.criarPosiçãoTd(tr)
        this.criarEquipeTd(tr)
        this.criarQuedasTd(tr)
        this.criarAbatesTd(tr)
        this.criarBooyahTd(tr)
        this.criarPtsTd(tr)
        this.criarBtn(tr, posição, puniçãoPontos)
    },
    criarPosiçãoTd(tr) {
        const td = document.createElement("td")
        const p = document.createElement("p")
        td.setAttribute("class", "posicao")
        tr.appendChild(td)
        td.appendChild(p)
        p.innerHTML = `${this.posição}`
    },
    criarEquipeTd(tr) {
        const td = document.createElement("td")
        td.setAttribute("class", "equipe")
        tr.appendChild(td)
        td.innerHTML = `${this.equipe}`
    },
    criarQuedasTd(tr) {
        const td = document.createElement("td")
        td.setAttribute("class", "quedas")
        tr.appendChild(td)
        td.innerHTML = `${this.quedas}`
    },
    criarAbatesTd(tr) {
        const td = document.createElement("td")
        td.setAttribute("class", "abates")
        tr.appendChild(td)
        td.innerHTML = `${this.abate}`
    },
    criarBooyahTd(tr) {
        const td = document.createElement("td")
        const p = document.createElement("p")
        if (this.booyah > 0) {
            td.setAttribute("class", "vitoria booay")
        } else {
            td.setAttribute("class", "vitoria")
        }
        tr.appendChild(td)
        td.appendChild(p)
        p.innerHTML = `${this.booyah}`
    },
    criarPtsTd(tr) {
        const td = document.createElement("td")
        const strong = document.createElement("strong")
        td.setAttribute("class", "pts")
        tr.appendChild(td)
        td.appendChild(strong)
        strong.innerHTML = `${this.pts}`
    },
    criarBtn(tr, posição, puniçãoPontos) {
        if(puniçãoPontos != 0){
            const td = document.createElement("td")
            const btn = document.createElement("button")
            const span = document.createElement("span")
            btn.setAttribute("id", `infoEquipe`)
            span.setAttribute("class", "avisoPunição")
            td.appendChild(span)
            td.appendChild(btn)
            span.textContent = "⚠️"

            btn.textContent = "📋"
            tr.appendChild(td)
        }else{

            const td = document.createElement("td")
            const btn = document.createElement("button")
            btn.setAttribute("id", `infoEquipe`)
            td.appendChild(btn)
            btn.textContent = "📋"
            tr.appendChild(td)
        }

    },
    mudarData(data) {
        const spanData = document.querySelector("#data")
        spanData.innerHTML = `${data}`
    }

}


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

export {resultadoFinal, ranking}

// console.log(resultadoFinal)
// console.log(ranking)