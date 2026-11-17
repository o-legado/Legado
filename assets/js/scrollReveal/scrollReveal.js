function reveal(){
    //pega todos os elementos do html com essa classe
    const elementos = document.querySelectorAll(".reveal")


    const observador = new IntersectionObserver((entradas) =>{

        entradas.forEach(function(entrada){

            //ela verifica se o elemento está aparecendo dentro da área de observação da tela.
            if(entrada.isIntersecting){
                entrada.target.classList.add("active")
            }

        })
    },{
        //aq mostra que quando 10% do conteudo tiver na tela, ira aparecer
        threshold: 0.5
    })


    //como a variavel elementos tem mais de um elemento, precisa do foreach para percorrerr
    elementos.forEach(function(elementos){

        //// Aqui você informa qual elemento será observado
        observador.observe(elementos)
    })
    

}
reveal()

