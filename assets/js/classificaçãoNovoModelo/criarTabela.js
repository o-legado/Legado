let jogadores 
let equipes 
let dataClicada

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
    organizarDados.start(equipes, jogadores)

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
const organizarDados = {

    //aq esta selecionando o mes do json
    start(equipes, jogadores) {
        
        //pega o mes do html selecionado
        const mesDoHtmlSelecionado = document.querySelector("#mes").textContent.toLowerCase()

        //vai percorrer todos os meses no json
        for (let mesEquipes in equipes) {

            //com o mes selecionado no html e o mes percorrido, tem que ser o mesmo
            if (mesEquipes === mesDoHtmlSelecionado) {

                //aq ira mostrar todos os treinos do mes
                const mesSelecionadoJosn = equipes[mesEquipes]

                //aq ira percorrer os treinos, returnando o treino especifico
                for (let indice in mesSelecionadoJosn) {

                    //com o for retornando o treino, da para selecionar os treinos e selecionar as datas
                    const dataTodosTreinos = equipes[mesEquipes][indice].data
                    
                    //se a data do treino for a mesma que a da dataclicada faz isso
                    if (dataTodosTreinos == dataClicada) {
                        const treinoEquipe = equipes[mesEquipes][indice]

                        this.pegarDadosDasEquipes(treinoEquipe)
                        console.log(treinoEquipe)
                        // console.log(equipes[mesEquipes][indice])
                    }


                    
                }
                
            }

        }
    },
    pegarDadosDasEquipes(treinoEquipe) {
        const resultadoFinal = []
        const equipes = treinoEquipe.equipes
        equipes.forEach(infoEquipes => {
            let equipePts = 0
            let kill = 0
            let posição = 0
            let booyah = 0

            const nomeEquipe = infoEquipes.equipe
            const arrayQuedas = infoEquipes.detalhes
            const logo = infoEquipes.logo

            arrayQuedas.forEach(objQuedas => {
                const numeroDaKills = objQuedas.kills
                const numeroDaPosição = objQuedas.posicao

                if (numeroDaPosição == 1) booyah++

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
                data: data
            })
        })

        console.log(resultadoFinal)
        return resultadoFinal
    },
    somarPontosKill(kill, numeroDaKills) {
        return kill + numeroDaKills
    },

    somaPontosPosição(posição, numeroDaPosição) {
        let pontoGanhoPorPartida = 0

        classificação.forEach(objClassificaçãoPosição => {
            if (objClassificaçãoPosição.posição == numeroDaPosição) {
                pontoGanhoPorPartida = objClassificaçãoPosição.pts
            }
        })

        return pontoGanhoPorPartida + posição
    }
}
