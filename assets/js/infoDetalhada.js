
let season;
let jogadores;

async function carregarDados() {
    try {
        const resposta = await fetch("../data/equipe.json");
        season = await resposta.json();

        const resposta2 = await fetch("../data/jogadores.json");
        jogadores = await resposta2.json();

        
    } catch (error) {
        console.error("Erro ao carregar JSON:", error);
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
        const p = document.createElement("p")
        const span = document.createElement("span")
        span.textContent = posição
        p.setAttribute("class", "desempenhoDetalhado_quedas_partida_posição")
        p.textContent = "posição:"
        p.appendChild(span)
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

