// console.log("oal")

import { resultadoFinalA, resultadoFinalB } from "./semanalCriarTabela.js"

window.addEventListener("dadosProntosTop4", () => {
    grupoA.start(resultadoFinalA)
    grupoB.start(resultadoFinalB)
});


const grupoA = {
    start(resultadoFinalA){
        
        const equipe1 = resultadoFinalA[0].equipe
        const pts1 = resultadoFinalA[0].pts
        const logo1 = resultadoFinalA[0].logo

        const equipe2 = resultadoFinalA[1].equipe
        const pts2 = resultadoFinalA[1].pts
        const logo2 = resultadoFinalA[1].logo

        const equipe3 = resultadoFinalA[2].equipe
        const pts3 = resultadoFinalA[2].pts
        const logo3 = resultadoFinalA[2].logo

        const equipe4 = resultadoFinalA[3].equipe
        const pts4 = resultadoFinalA[3].pts
        const logo4 = resultadoFinalA[3].logo
        

        //dados do html posição 1
        const htmlImg1 = document.querySelector("#logoGrupoA1")
        const htmlNome1 = document.querySelector("#nomeGrupoA1")
        const htmlPts1 = document.querySelector("#ptsGrupoA1")

        htmlImg1.setAttribute("src", logo1)
        htmlNome1.textContent = equipe1
        htmlPts1.textContent = pts1

        //dados do html posição 2
        const htmlImg2 = document.querySelector("#logoGrupoA2")
        const htmlNome2 = document.querySelector("#nomeGrupoA2")
        const htmlPts2 = document.querySelector("#ptsGrupoA2")

        htmlImg2.setAttribute("src", logo2)
        htmlNome2.textContent = equipe2
        htmlPts2.textContent = pts2

        //dados do html posição 3
        const htmlImg3 = document.querySelector("#logoGrupoA3")
        const htmlNome3 = document.querySelector("#nomeGrupoA3")
        const htmlPts3 = document.querySelector("#ptsGrupoA3")

        htmlImg3.setAttribute("src", logo3)
        htmlNome3.textContent = equipe3
        htmlPts3.textContent = pts3

        //dados do html posição 4
        const htmlImg4 = document.querySelector("#logoGrupoA4")
        const htmlNome4 = document.querySelector("#nomeGrupoA4")
        const htmlPts4 = document.querySelector("#ptsGrupoA4")

        htmlImg4.setAttribute("src", logo4)
        htmlNome4.textContent = equipe4
        htmlPts4.textContent = pts4


    }
}


const grupoB = {
    start(resultadoFinalB){
        console.log(resultadoFinalB)
        const equipe1 = resultadoFinalB[0].equipe
        const pts1 = resultadoFinalB[0].pts
        const logo1 = resultadoFinalB[0].logo

        const equipe2 = resultadoFinalB[1].equipe
        const pts2 = resultadoFinalB[1].pts
        const logo2 = resultadoFinalB[1].logo

        const equipe3 = resultadoFinalB[2].equipe
        const pts3 = resultadoFinalB[2].pts
        const logo3 = resultadoFinalB[2].logo

        const equipe4 = resultadoFinalB[3].equipe
        const pts4 = resultadoFinalB[3].pts
        const logo4 = resultadoFinalB[3].logo
        

        //dados do html posição 1
        const htmlImg1 = document.querySelector("#logoGrupoB1")
        const htmlNome1 = document.querySelector("#nomeGrupoB1")
        const htmlPts1 = document.querySelector("#ptsGrupoB1")

        htmlImg1.setAttribute("src", logo1)
        htmlNome1.textContent = equipe1
        htmlPts1.textContent = pts1

        //dados do html posição 2
        const htmlImg2 = document.querySelector("#logoGrupoB2")
        const htmlNome2 = document.querySelector("#nomeGrupoB2")
        const htmlPts2 = document.querySelector("#ptsGrupoB2")

        htmlImg2.setAttribute("src", logo2)
        htmlNome2.textContent = equipe2
        htmlPts2.textContent = pts2

        //dados do html posição 3
        const htmlImg3 = document.querySelector("#logoGrupoB3")
        const htmlNome3 = document.querySelector("#nomeGrupoB3")
        const htmlPts3 = document.querySelector("#ptsGrupoB3")

        htmlImg3.setAttribute("src", logo3)
        htmlNome3.textContent = equipe3
        htmlPts3.textContent = pts3

        //dados do html posição 4
        const htmlImg4 = document.querySelector("#logoGrupoB4")
        const htmlNome4 = document.querySelector("#nomeGrupoB4")
        const htmlPts4 = document.querySelector("#ptsGrupoB4")

        htmlImg4.setAttribute("src", logo4)
        htmlNome4.textContent = equipe4
        htmlPts4.textContent = pts4
    }
}




