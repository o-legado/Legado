
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("recruitment-form");

    form.addEventListener("submit", function (e) {

        e.preventDefault();

    // ======================
    // CAMPOS PRINCIPAIS
    // ======================

    const nick = document.getElementById("nick").value.trim();
    const playerId = document.getElementById("playerId").value.trim();
    const experiencia = document.getElementById("experiencia").value.trim();
    const dispositivo = document.getElementById("dispositivo").value.trim();
    const horarios = document.getElementById("horarios").value.trim();
    const observacoes = document.getElementById("observacoes").value.trim();

    // ======================
    // FUNÇÕES
    // ======================

    const funcoes = [];

    document
    .querySelectorAll('input[name="funcao"]:checked')
            .forEach(item => {
        funcoes.push(item.value);
            });

    // ======================
    // DIAS DISPONÍVEIS
    // ======================

    const diasDisponiveis = [];

    document
    .querySelectorAll('input[name="diasDisponiveis"]:checked')
            .forEach(item => {
        diasDisponiveis.push(item.value);
            });

    // ======================
    // DISCORD
    // ======================

    const discordSelecionado =
    document.querySelector(
    'input[name="possui_discord"]:checked'
    );

    const discord =
    discordSelecionado
    ? discordSelecionado.value
    : "Não informado";

    // ======================
    // MENSAGEM
    // ======================

    const mensagem = `
    🎮 *NOVA INSCRIÇÃO - O LEGADO*

    ━━━━━━━━━━━━━━━

    👤 *Nick*
    ${nick}

    🆔 *ID do Jogador*
    ${playerId}

    🎯 *Funções*
    ${funcoes.length > 0 ? funcoes.join(", ") : "Não informado"}

    🏆 *Experiência*
    ${experiencia}

    📱 *Dispositivo*
    ${dispositivo}

    💬 *Possui Discord*
    ${discord}

    📅 *Dias Disponíveis*
    ${diasDisponiveis.length > 0 ? diasDisponiveis.join(", ") : "Não informado"}

    ⏰ *Horários*
    ${horarios}

    📝 *Observações*
    ${observacoes || "Nenhuma"}

    ━━━━━━━━━━━━━━━
    `;

    // ======================
    // NÚMERO DO WHATSAPP
    // ======================

    const telefone = "5521999999999";

    // ======================
    // URL DO WHATSAPP
    // ======================


    console.log(mensagem)
    const whatsappURL =
    `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    window.open(whatsappURL, "_blank");

    });

});