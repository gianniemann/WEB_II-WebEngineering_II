"use strict";

let user = {
    "givenName": "Daniel",
    "familyName": "Krebs",
    "age": 26
};

function init() {
    let output = "";
    for (let property in user) {
        output += `<p>${property}: ${user[property]}</p>`;
    }
    output += `<p>Hallo ${user["givenName"]} ${user.familyName} (${user.age})!</p>`;
    document.getElementById("output").innerHTML = output;
}
