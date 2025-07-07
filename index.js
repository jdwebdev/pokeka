readFile("./NZH - ポケカ.tsv");

function readFile(pFile) {
    let rawFile = new XMLHttpRequest();
    rawFile.open("GET", pFile, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                tsvFile = rawFile.responseText;
                createPokemon(tsvFile);
            }
        }
    }
    rawFile.send(null);
}

function createPokemon(pFile) {
    let row = pFile.split(/\r\n|\n/);
    let test;
    for (let i = 0; i < row.length; i++) {
        row[i] = row[i].split('\t');
        //?                ID,    FR,        JP,        OWN,       IMG
        test = new Pokemon((i+1), row[i][0], row[i][1], row[i][2], row[i][4]);
    }

    let listing = id("listing");
    let innerHTML = "";
    let i = 0;
    let tabGens = [
        {own: 0, nb: 151, idMax: 151,  bDone: false},
        {own: 0, nb: 100, idMax: 251,  bDone: false},
        {own: 0, nb: 135, idMax: 386,  bDone: false},
        {own: 0, nb: 107, idMax: 493,  bDone: false},
        {own: 0, nb: 156, idMax: 649,  bDone: false},
        {own: 0, nb: 72,  idMax: 721,  bDone: false},
        {own: 0, nb: 88,  idMax: 809,  bDone: false},
        {own: 0, nb: 96,  idMax: 905,  bDone: false},
        {own: 0, nb: 120, idMax: 1025, bDone: false}
    ];
    
    //? 0 151 251 386 493 649 721 809 905 1025
    Pokemon.list.forEach(p => {
        if (p.id <= tabGens[i].idMax && !tabGens[i].bDone) {
            tabGens[i].bDone = true;
            innerHTML += `<li id="gen_${(i+1)}">---------- ${(i+1)} ---------- </li>`;
        } else if (p.id > tabGens[i].idMax && tabGens[i].bDone) {
            i++;
            tabGens[i].bDone = true;
            innerHTML += `<li id="gen_${(i+1)}">---------- ${(i+1)} ---------- </li>`;
        }
        if (!p.own) {
			if (p.img !== "") {
				innerHTML += `<li><img class="pok_img" src="${p.img}">${p.id} - ${p.fr} ${p.jp}</li>`;
			} else {
				innerHTML += `<li>${p.id} - ${p.fr} ${p.jp}</li>`;
			}
        } else {
            Pokemon.nb++;
            tabGens[i].own++;
        }
    });

    listing.innerHTML = innerHTML;

    for (let j = 0; j < tabGens.length; j++) {
        let li = id("gen_"+(j+1));
        li.innerHTML += `(${tabGens[j].own} / ${tabGens[j].nb})`;
    }
}

class Pokemon {
    static list = [];
    static nb = 0;
    constructor(id, fr, jp, own, img) {
        this.id = id;
        this.fr = fr;
        this.jp = jp;
        this.own = !own;
		this.img = img;
        Pokemon.list.push(this);
    }
}

let main = id("main");
main.style.left = ((window.innerWidth / 2) - (main.offsetWidth/2)) + "px";
let headerContainer = id("header_container");
headerContainer.style.left = ((window.innerWidth / 2) - (headerContainer.offsetWidth/2)) + "px";
let redPart = id("red_part");
let blackPart = id("black_part");
let bOpen = false;


let toSearch = "";
let inputs = [];
let resultContainer = id("result_container");
for (let i = 1; i <= 4; i++) {
    inputs.push(id("input_"+i));
}
for (let i = 0; i < 10; i++) {
    let newBtn = id(i);
    newBtn.addEventListener("click", e => {
        e.preventDefault();
        if (bOpen) return;
        if (toSearch === "" && i === 0) return;
        if (toSearch.length < 4) toSearch += ""+i;
        fillInputs();
    });
}
let xBtn = id("x");
xBtn.addEventListener("click", e => {
    e.preventDefault();
    if (bOpen) return;
    resetInputs();
});
let vBtn = id("v");
vBtn.addEventListener("click", e => {
    e.preventDefault();
    if (bOpen) return;
    search();
});

function fillInputs() {
    let length = toSearch.length;
    for (let i = 0; i < toSearch.length; i++) {
        let input = id("input_" + length);
        input.innerHTML = toSearch[i];
        length--;
    }
}

function search() {
    Pokemon.list.forEach(p => {
        if (p.id == toSearch) {
            resultContainer.innerHTML = `
            <div id="result" class="${p.own ? "motteru" : "mottenai"}">${p.own ? "持ってる":"持ってない"}</div>
            <div class="pokename">${p.fr}</div>
            <div class="pokename">${p.jp}</div>
            `;
        }
    });
}

function resetInputs() {
    toSearch = "";
    for (let i = 0; i < 4; i++) {
        inputs[i].innerHTML = "-";
    }
    resultContainer.innerHTML = `
        <div id="result" class="standby"></div>
        <div class="pokename"></div>
        <div class="pokename"></div>
    `;
}

let maruBtn = id("maru_btn")
maruBtn.addEventListener("click", e => {
    open();
});
function open() {
    bOpen = !bOpen;
    resetInputs();
    let result = id("result");
    if (bOpen) {
        redPart.classList.remove("close");
        maruBtn.classList.remove("close");
        redPart.classList.add("open");
        maruBtn.classList.add("open");
        result.classList.add("paddingTop");
        result.innerHTML = "" + Pokemon.nb + "/" + Pokemon.list.length + "";
    } else {
        redPart.classList.remove("open");
        maruBtn.classList.remove("open");
        redPart.classList.add("close");
        maruBtn.classList.add("close");
    }
}