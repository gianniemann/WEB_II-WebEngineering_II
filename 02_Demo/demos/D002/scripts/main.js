"use strict";

let names = [
    "Raphael",
    "Pedro",
    "Daniele"
];

function init() {
    let output = "";
    for (let name of names) {
        output += `<p>Hallo ${name}!</p>`;
    }
    document.getElementById("output").innerHTML = output;
}
