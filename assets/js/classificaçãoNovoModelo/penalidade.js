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

}
iniciarApp()

console.log(equipes)