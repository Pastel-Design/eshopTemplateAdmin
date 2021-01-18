let tabGroupNames = [];
document.querySelectorAll(".tab-content").forEach(a => {
    let b = a.getAttribute("tab-group");
    tabGroupNames.includes(b) || tabGroupNames.push(b)
}), tabGroupNames.forEach(a => {
    let b = document.querySelectorAll(".tab-content[tab-group='" + a + "']");
    b.forEach(a => {
        a.classList.add("hidden")
    }), b[0].classList.remove("hidden")
}), document.querySelectorAll(".tab-links").forEach(a => {
    a.addEventListener("click", () => {
        opentab(a.getAttribute("tab-controls"))
    })
});

function opentab(a) {
    let b = document.querySelector("#" + a);
    document.querySelectorAll(".tab-content[tab-group='" + b.getAttribute("tab-group") + "']").forEach(a => {
        a.classList.add("hidden")
    }), b.classList.remove("hidden")
}