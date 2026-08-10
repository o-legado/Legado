
let jogadores 
let equipes 
let dataClicada

const resultadoFinalA = [];
const resultadoFinalB = [];
const resultadoFinalGrupoFinal = []

async function carregarDados() {
    const resposta = await fetch("../../../assets/data/semanal/equipe.json")
    equipes = await resposta.json()
    


    const resposta2 = await fetch("../../../assets/data/semanal/jogadores.json")
    
    jogadores = await resposta2.json()
    
    
}
//o js para e espera pegar todos os dados no json
async function iniciarApp() {
    
    await carregarDados()
    
    dataClicada = localStorage.getItem("dataDoXtreino");
    organizarDadosEquipeA.start(equipes)
    organizarDadosEquipeB.start(equipes)
    organizarDadosEquipeFinal.start(equipes)
    
    // formarDadosJogadores.start(jogadores)

    // 🔥 ADICIONE ISSO AQUI:
    // Agora sim! Avisa que TUDO (equipes e ranking) está 100% pronto.
    setTimeout(() => {
        window.dispatchEvent(new CustomEvent("dadosProntos"));
    }, 50);
    setTimeout(() => {
        window.dispatchEvent(new CustomEvent("dadosProntosTop4"));
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



//GRUPO A aq formula os dados e organiza em ordem decrescente
const organizarDadosEquipeA = {

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
                        
                        this.pegarDadosDasEquipes(treinoEquipe.grupoA);
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

            resultadoFinalA.push({
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
        resultadoFinalA.sort((a, b) => {

            // 1º critério: Pontos
            if (b.pts !== a.pts) {
                return b.pts - a.pts;
            }

            // 2º critério: Booyahs
            if (b.booyah !== a.booyah) {
                return b.booyah - a.booyah;
            }

            // 3º critério: Kills
            if (b.abate !== a.abate) {
                return b.abate - a.abate;
            }

            // Continua empatado
            return 0;
        });

        // 2. ATRIBUIÇÃO DA POSIÇÃO REAL DE CLASSIFICAÇÃO
        // O array já está ordenado. O primeiro (índice 0) vira 1º colocado, o segundo vira 2º, etc.
        resultadoFinalA.forEach((item, index) => {
            item.posicao = index + 1;
        });

       

        // Envia os dados ordenados e com pontos de posição computados para a tabela
        enviarDadosTabelaEquipeA.start(resultadoFinalA);
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
const enviarDadosTabelaEquipeA = {
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

            criarTabelaEquipeA.start(posição, equipe, quedas, abate, booyah, pts, data, logo, puniçãoPontos)
           
        });
    }
}

//aq ira montar a tabela
const criarTabelaEquipeA = {

    start(posição, equipe, quedas, abate, booyah, pts, data, logo, puniçãoPontos) {
        this.posição = posição
        this.equipe = equipe
        this.quedas = quedas

        this.abate = abate
        this.booyah = booyah
        this.pts = pts
        this.data = data
        this.logo = logo
        const tbody = document.querySelector("#tbodyGrupoA")
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
        // spanData.innerHTML = `${data}`
    }

}
//GRUPO A



//GRUPO B aq formula os dados e organiza em ordem decrescente
const organizarDadosEquipeB = {

    // Seleciona o mês e filtra o treino correto baseado na data clicada
    start(equipes) {
        const mesDoHtmlSelecionado = document.querySelector("#mes").textContent.toLowerCase().trim();

        
        for (let mesEquipes in equipes) {
            if (mesEquipes === mesDoHtmlSelecionado) {
                const mesSelecionadoJson = equipes[mesEquipes];
                
                for (let indice in mesSelecionadoJson) {
                    const dataTodosTreinos = mesSelecionadoJson[indice].data;

                    if (dataTodosTreinos == dataClicada) {
                        const treinoEquipe = mesSelecionadoJson[indice].grupoB;
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


            resultadoFinalB.push({
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
        resultadoFinalB.sort((a, b) => {

            // 1º critério: Pontos
            if (b.pts !== a.pts) {
                return b.pts - a.pts;
            }

            // 2º critério: Booyahs
            if (b.booyah !== a.booyah) {
                return b.booyah - a.booyah;
            }

            // 3º critério: Kills
            if (b.abate !== a.abate) {
                return b.abate - a.abate;
            }

            // Continua empatado
            return 0;
        });

        // 2. ATRIBUIÇÃO DA POSIÇÃO REAL DE CLASSIFICAÇÃO
        // O array já está ordenado. O primeiro (índice 0) vira 1º colocado, o segundo vira 2º, etc.
        resultadoFinalB.forEach((item, index) => {
            item.posicao = index + 1;
        });

       

        // Envia os dados ordenados e com pontos de posição computados para a tabela
        enviarDadosTabelaEquipeB.start(resultadoFinalB);
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
const enviarDadosTabelaEquipeB = {
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

            criarTabelaEquipeB.start(posição, equipe, quedas, abate, booyah, pts, data, logo, puniçãoPontos)
           
        });
    }
}

//aq ira montar a tabela
const criarTabelaEquipeB = {

    start(posição, equipe, quedas, abate, booyah, pts, data, logo, puniçãoPontos) {
        this.posição = posição
        this.equipe = equipe
        this.quedas = quedas

        this.abate = abate
        this.booyah = booyah
        this.pts = pts
        this.data = data
        this.logo = logo
        const tbody = document.querySelector("#tbodyGrupoB")
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
        // spanData.innerHTML = `${data}`
    }

}
//GRUPO B



//GRUPO FINAL aq formula os dados e organiza em ordem decrescente
const organizarDadosEquipeFinal = {

    // Seleciona o mês e filtra o treino correto baseado na data clicada
    start(equipes) {
        const mesDoHtmlSelecionado = document.querySelector("#mes").textContent.toLowerCase().trim();
        
        
        for (let mesEquipes in equipes) {
            if (mesEquipes === mesDoHtmlSelecionado) {
                const mesSelecionadoJson = equipes[mesEquipes];
                
                for (let indice in mesSelecionadoJson) {
                    const dataTodosTreinos = mesSelecionadoJson[indice].data;

                    if (dataTodosTreinos == dataClicada) {
                        const treinoEquipe = mesSelecionadoJson[indice].grupoFinal;
                        
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

            resultadoFinalGrupoFinal.push({
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
        resultadoFinalGrupoFinal.sort((a, b) => {

            // 1º critério: Pontos
            if (b.pts !== a.pts) {
                return b.pts - a.pts;
            }

            // 2º critério: Booyahs
            if (b.booyah !== a.booyah) {
                return b.booyah - a.booyah;
            }

            // 3º critério: Kills
            if (b.abate !== a.abate) {
                return b.abate - a.abate;
            }

            // Continua empatado
            return 0;
        });

        // 2. ATRIBUIÇÃO DA POSIÇÃO REAL DE CLASSIFICAÇÃO
        // O array já está ordenado. O primeiro (índice 0) vira 1º colocado, o segundo vira 2º, etc.
        resultadoFinalGrupoFinal.forEach((item, index) => {
            item.posicao = index + 1;
        });

       

        // Envia os dados ordenados e com pontos de posição computados para a tabela
        enviarDadosTabelaEquipeFinal.start(resultadoFinalGrupoFinal);
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
const enviarDadosTabelaEquipeFinal = {
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

            criarTabelaEquipeFinal.start(posição, equipe, quedas, abate, booyah, pts, data, logo, puniçãoPontos)
           
        });
    }
}

//aq ira montar a tabela
const criarTabelaEquipeFinal = {

    start(posição, equipe, quedas, abate, booyah, pts, data, logo, puniçãoPontos) {
        this.posição = posição
        this.equipe = equipe
        this.quedas = quedas

        this.abate = abate
        this.booyah = booyah
        this.pts = pts
        this.data = data
        this.logo = logo
        const tbody = document.querySelector("#tbodyGrupoFinal")
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
        // spanData.innerHTML = `${data}`
    }

}
//GRUPO FINAL



export {resultadoFinalGrupoFinal}
export {resultadoFinalA, resultadoFinalB}
export async function obterJogadores() {
    if (!jogadores) {
        await carregarDados();
    }

    return jogadores;
}

// console.log(resultadoFinal)
// console.log(ranking)