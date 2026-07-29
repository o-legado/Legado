
document.addEventListener("click", function (e) {
    const link = e.target.closest("a");

    if (!link) return;

    const season = link.dataset.season;

    localStorage.setItem("season", season);
});

