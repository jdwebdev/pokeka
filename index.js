readFile("./NZH - ポケカー.tsv");

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
        //?                ID,FR,        JP,        OWN
        test = new Pokemon((i+1), row[i][0], row[i][1], row[i][2]);
    }
}

class Pokemon {
    static list = [];
    constructor(id, fr, jp, own) {
        this.id = id;
        this.fr = fr;
        this.jp = jp;
        this.own = !own;
        Pokemon.list.push(this);
    }
}

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
        if (toSearch === "" && i === 0) return;
        if (toSearch.length < 4) toSearch += ""+i;
        fillInputs();
    });
}
let xBtn = id("x");
xBtn.addEventListener("click", e => {
    e.preventDefault();
    toSearch = "";
    for (let i = 0; i < 4; i++) {
        inputs[i].innerHTML = "-";
    }
    resultContainer.innerHTML = `
        <div id="result" class="standby"></div>
        <div class="pokename"></div>
        <div class="pokename"></div>
    `;
});
let vBtn = id("v");
vBtn.addEventListener("click", e => {
    e.preventDefault();
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