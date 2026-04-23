
//pega os dados do json
let season
let jogadores
async function carregarDados() {
    const resposta = await fetch("../data/equipe.json")
    season = await resposta.json()

    const resposta2 = await fetch("../data/jogadores.json")
    jogadores = await resposta2.json()
}
//o js para e espera pegar todos os dados no json
async function iniciarApp() {
    await carregarDados()
    tabela.start()

    vereficaçãoPlayer.start()
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

//aq ele pega e armazena todos os dados do json
const pegarDados = {
    start(seasonSelecionada) {
        //aq da um return nessa função com os dados
        return this.pegarDadosDasEquipes(season[seasonSelecionada], seasonSelecionada)
    },
    pegarDadosDasEquipes(seasonSelecionada, nomeDaSeason) {

        //aq ira pegar o arrays dos objs equipes
        const arrayEquipes = seasonSelecionada.equipes
        const resultadoFinal = []
        const data = seasonSelecionada.data
        const nomeSeason = nomeDaSeason

        arrayEquipes.forEach(infoEquipes => {
            //serve para ajudar ao somatorio
            let equipePts = 0
            let kill = 0
            let posição = 0
            let booyah = 0

            //aq mostra os nomes das equipes
            const nomeEquipe = infoEquipes.equipe

            const arrayQuedas = infoEquipes.detalhes
            arrayQuedas.forEach(objQuedas => {
                //aq pega todos os dados das quedas,kills,posição
                const numeroDaQueda = objQuedas.queda
                const numeroDaKills = objQuedas.kills
                const numeroDaPosição = objQuedas.posicao
                //seria aq os dados individuais
                if (numeroDaPosição == 1) {
                    booyah++
                }
                //aq soma todas as kills e os pts de posição e armazena
                kill = this.somarPontosKill(kill, numeroDaKills)
                posição = this.somaPontosPosição(posição, numeroDaPosição)
            })
            equipePts = kill + posição

            resultadoFinal.push({
                equipe: nomeEquipe,
                quedas: arrayQuedas.length,
                abate: kill,
                booyah: booyah,
                pts: equipePts,
                data: data,
                nomeSeason: nomeSeason
            })

        });

        return resultadoFinal


    },

    //aq soma as kills
    somarPontosKill(kill, numeroDaKills) {
        let pontuaçãoKill = kill + numeroDaKills
        return pontuaçãoKill
    },

    //ira somar os pontos de posição
    somaPontosPosição(posição, numeroDaPosição) {
        //essa variavel ir armazenar os pts por queda
        let pontoGanhoPorPartida = 0

        //ira percorrer os objs dentro do array classificação
        classificação.forEach(objClassificaçãoPosição => {
            //se o numero da posição na queda for igual ao numero de posição da lista faça
            if (objClassificaçãoPosição.posição == numeroDaPosição) {
                //ira somar os pts feito na partida
                pontoGanhoPorPartida = objClassificaçãoPosição.pts
            }
        })
        return pontoGanhoPorPartida + posição

    }

}
let dados = []




//aq ira formar os dados para criar a tabela    
const tabela = {
    start() {
        const select = document.querySelector(".container_select")
        
        //isso vai aparecer a tabela logo quando entrar
        const option = document.querySelector(".container_select").value
        const dados = pegarDados.start("treino1")
        this.carregarTabela(dados)

        //quando seleciona o valor do select
        select.addEventListener("change", () => {
            const seasonSelecionada = select.value


            //são as seasons que estão do json
            const seasonJson = season

            //pega todos os seasons um por um
            for (let seasons in seasonJson) {
                console.log(dados)
                //se as seasons do json for igual a que foi selecionada faz isso
                if (seasons == seasonSelecionada) {
                    const dados = pegarDados.start(seasonSelecionada)
                    this.carregarTabela(dados)
                }

            }
        })
    },
    carregarTabela(arrayEquipes) {
       
        const tbody = document.querySelector("#tbody")
        tbody.innerHTML = ""
        arrayEquipes.sort((a, b) => b.pts - a.pts)
        arrayEquipes.forEach((equipe, index) => {
            equipe.posicao = index + 1
            


            criarTabela.start(equipe.posicao, equipe.equipe, equipe.quedas, equipe.abate, equipe.booyah, equipe.pts, equipe.data, equipe.nomeSeason)
        })
        // new Equipe("1", "detonadores", 1,2,3,4, "01/01/2000", "season6")
    }
}

const criarTabela = {

    start(posição, equipe, quedas, abate, booyah, pts, data, season) {
        this.posição = posição
        this.equipe = equipe
        this.quedas = quedas
        
        this.abate = abate
        this.booyah = booyah
        this.pts = pts
        this.data = data
        this.season = season
        const tbody = document.querySelector("#tbody")
        this.criarTr(tbody, posição, equipe)
        this.mudarData(data)
        this.mudarNomeSeason(season)
    },
    criarTr(tbody, posição, equipe) {
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
        this.criarBtn(tr, posição)
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
    criarBtn(tr, posição) {
        const td = document.createElement("td")
        const btn = document.createElement("button")
        btn.setAttribute("id", `info${posição}`)
        td.appendChild(btn)
        btn.textContent = "📋"
        tr.appendChild(td)

    },
    mudarData(data) {
        const spanData = document.querySelector("#data")
        spanData.innerHTML = `${data}`
    },
    mudarNomeSeason(nomeSeason) {
        const season = document.querySelector("#rankingSeason")
        season.innerHTML = `TREINO ${nomeSeason.slice(-1)}`
    }

}


//aq ira vereficar se a season esta correta no rank dos jogadores
const vereficaçãoPlayer = {
    start() {
        const select = document.querySelector(".container_select")

        //isso aq aparece o primeiro treino
        const option = document.querySelector(".container_select").value
        this.seasonSelecionada("treino1")

        //quando seleciona o valor do select
        select.addEventListener("change", () => {

            //armazena o value do select selecionado
            const seasonSelecionada = select.value
            this.seasonSelecionada(seasonSelecionada)
        })
    },
    seasonSelecionada(seasonEscolhida) {
        for (let seasonJson in jogadores) {
            if (seasonEscolhida == seasonJson) {
                const equipesPlayers = jogadores[seasonJson].equipes
                formarDadosJogadores.start(equipesPlayers)
            }
        }
    }
}

//aq ira pegar os dados em json e organizar eles para enviar no criarRankJogador
const formarDadosJogadores = {
    start(equipesPlayers) {

        this.ranking = []
        // console.log(equipesPlayers)

        //aq ira percorrer os nomes das equipes
        for (let nomeEquipe in equipesPlayers) {


            //aq vai armazenar todos os jogadores de uma equipe
            const jogadoresEquipe = equipesPlayers[nomeEquipe]


            //aq ira percorrer todos os jogadores de uma equipe
            for (let nomeJogadores in jogadoresEquipe) {

                // aq ira armazenar a soma total de cada jogador
                let somaKills = 0

                //aq ira armazenar as  partidas de cada jogador
                let jogadoresPartidaKillArray = jogadoresEquipe[nomeJogadores]

                //aq ira percorrer cada kill que o jogador fez
                for (let i = 0; i < jogadoresPartidaKillArray.length; i++) {
                    //aq ira somar e armazenar as kills
                    somaKills += jogadoresPartidaKillArray[i]
                }

                this.ordemDoRanking(nomeEquipe, nomeJogadores, jogadoresPartidaKillArray, somaKills)
                // criarRankJogador.start(nomeEquipe, nomeJogadores, jogadoresPartidaKillArray, somaKills)

            }



        }

        //aq ira ordenar quem tem mais pontos
        this.ranking.sort((a, b) => b.pts - a.pts)

        //aq ira colocar as posições de cada jogador
        this.ranking.forEach((jogador, index) => {
            jogador.posição = index + 1
        })
        criarRankJogador.start(this.ranking)
    },
    ordemDoRanking(nomeEquipe, nomeJogadores, jogadoresPartidaKillArray, somaKills) {

        const infoJogador = {
            equipe: nomeEquipe,
            jogador: nomeJogadores,
            kills: jogadoresPartidaKillArray,
            pts: somaKills
        }
        this.ranking.push(infoJogador)

    }
}

//aq com os dados eles pegam os dados e coloca na tela
const criarRankJogador = {
    start(objJogadores) {

        const div = document.querySelector(".top_kills_grid")
        div.textContent = ""

        //aq ira percorrer cada cada chave do objeto dos joagdores
        objJogadores.forEach(players => {
            //aq ira enviar os dados para criar o rank na tela
            this.criaContainerJogador(players.posição, players.jogador, players.pts, players.equipe)

        })
        // this.criaContainerJogador(posicao, nomeJogadores, somaKills, nomeEquipe)
    },
    criaContainerJogador(posicao, nomeJogador, kill, equipe) {
        const top_kills_grid = document.querySelector(".top_kills_grid")
        const containerJogador = document.createElement("div")
        containerJogador.setAttribute("id", posicao)
        containerJogador.setAttribute("class", "kill_card")
        if (posicao == 1) {
            containerJogador.setAttribute("class", "kill_card rank-1")
        } if (posicao == 2) {
            containerJogador.setAttribute("class", "kill_card rank-2")
        } if (posicao == 3) {
            containerJogador.setAttribute("class", "kill_card rank-3")
        }
        top_kills_grid.appendChild(containerJogador)
        this.criaPosição(containerJogador, posicao, nomeJogador, kill, equipe)
    },
    criaPosição(containerJogador, posicao, nomeJogador, kill, equipe) {
        const p = document.createElement("p")
        p.setAttribute("class", "badge")
        p.textContent = posicao
        containerJogador.appendChild(p)
        this.criarNomeEquipe(containerJogador, posicao, nomeJogador, kill, equipe)
    },
    criarNomeEquipe(containerJogador, posicao, nomeJogador, kill, equipe) {
        const divPlayerInfo = document.createElement("div")
        divPlayerInfo.setAttribute("class", "player_info")
        containerJogador.appendChild(divPlayerInfo)


        const nick = document.createElement("h4")
        nick.textContent = nomeJogador
        divPlayerInfo.appendChild(nick)

        const nomeEquipe = document.createElement("p")
        nomeEquipe.textContent = equipe
        divPlayerInfo.appendChild(nomeEquipe)

        this.criarKill(containerJogador, posicao, nomeJogador, kill, equipe)
    },
    criarKill(containerJogador, posicao, nomeJogador, kill, equipe) {
        const divKill = document.createElement("div")
        divKill.setAttribute("class", "kill_stats")
        containerJogador.appendChild(divKill)


        const nomeKills = document.createElement("span")
        nomeKills.setAttribute("class", "lbl")
        nomeKills.textContent = "Kills"
        divKill.appendChild(nomeKills)

        const kills = document.createElement("span")
        kills.setAttribute("class", "num")
        kills.textContent = kill
        divKill.appendChild(kills)

        this.criarBtn(containerJogador, posicao)
    },
    criarBtn(containerJogador, posicao){
        const btn = document.createElement("button")
        btn.setAttribute("class", "btnPlayer")
        btn.setAttribute("id", `playerInfo${posicao}`)
        btn.textContent = "📋"
        containerJogador.appendChild(btn)
    }
}







