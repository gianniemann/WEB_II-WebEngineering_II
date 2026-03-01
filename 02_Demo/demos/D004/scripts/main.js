"use strict";

let users = [
    {
        "givenName": "Robin",
        "familyName": "Kälin"
    },
    {
        "givenName": "Nebojsa",
        "familyName": "Milosevic"
    },
    {
        "givenName": "Tobias",
        "familyName": "Rudin"
    }
];

function init() {
    let output = "";
    for (let user of users) {
        output += `<p>Hallo ${user.givenName} ${user.familyName}!</p>`;
    }
    document.getElementById("output").innerHTML = output;
}
