"use strict";

let user = {
    "givenName": "Daniel",
    "familyName": "Krebs",
    "age": 26
};

function init() {
    let output = "";

    /*
    for (let property in user) {
        output += `<p>${property}: ${user[property]}</p>`;
    }
    */

    /*
    Object.keys(user).forEach(property => output += `<p>${property}: ${user[property]}</p>`);
    */

    Object.entries(user).forEach(entry => {
        const [key, value] = entry;
        output += `<p>${key}: ${value}</p>`
    })

    output += `<p>Hallo ${user["givenName"]} ${user.familyName} (${user.age})!</p>`;
    document.getElementById("output").innerHTML = output;
}
