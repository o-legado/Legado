



function reveal(){
    // Seleciona todos os elementos com a classe reveal
    const elementos = document.querySelectorAll('.reveal');
    
    // Cria o observador
    const observer = new IntersectionObserver((entries) => {
    
        entries.forEach((entry) => {
    
            // Verifica se o elemento entrou na tela
            if (entry.isIntersecting) {
    
                // Adiciona a classe active
                entry.target.classList.add('active');
    
            }
    
        });
    
    }, {
        threshold: 0.2
    });
    
    // Observa cada elemento
    elementos.forEach((elemento) => {
        observer.observe(elemento);
    });
    
}
reveal()



//Para funcionar em mobiles
const mediaQuery = window.matchMedia("(min-width: 768px)")
function vereficarViewPort(){

    if(mediaQuery.matches){
        
    }
}
vereficarViewPort()
