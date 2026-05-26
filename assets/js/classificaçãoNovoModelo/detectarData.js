
document.addEventListener("click", function (e) {
    //se caso clicar na span, ele ira na arvore do DOM e procura um pai chamado "a"
    const link = e.target.closest("a")

    if (!link) return
    const data = link.dataset.diamesano

    localStorage.setItem("dataDoXtreino", data)

})

