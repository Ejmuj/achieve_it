const menuBtn = document.getElementById("menuButton");
const menu = document.getElementById("sidemenu");



menuBtn.addEventListener("click", () => {
    menu.classList.toggle("active");
    menuBtn.classList.toggle("active");
});

document.addEventListener("click", (e) => {
    const clickedInsideMenu = menu.contains(e.target);
    const clickedButton = menuBtn.contains(e.target);

    if (!clickedInsideMenu && !clickedButton) {
        menu.classList.remove("active");
        menuBtn.classList.remove("active");
    }
});

const menuBtn2 = document.getElementById("menuButton2");
const menu2 = document.getElementById("sidemenu2");



menuBtn2.addEventListener("click", () => {
    menu2.classList.toggle("active");
    menuBtn2.classList.toggle("active");
});

document.addEventListener("click", (e) => {
    const clickedInsideMenu = menu2.contains(e.target);
    const clickedButton = menuBtn2.contains(e.target);

    if (!clickedInsideMenu && !clickedButton) {
        menu2.classList.remove("active");
        menuBtn2.classList.remove("active");
    }
});

const menuBtn3 = document.getElementById("menuButton3");
const menu3 = document.getElementById("sidemenu3");

menuBtn3.addEventListener("click", () => {
    menu3.classList.toggle("active");
    menuBtn3.classList.toggle("active");
});

document.addEventListener("click", (e) => {
    const clickedInsideMenu = menu3.contains(e.target);
    const clickedButton = menuBtn3.contains(e.target);

    if (!clickedInsideMenu && !clickedButton) {
        menu3.classList.remove("active");
        menuBtn3.classList.remove("active");
    }
});
