const secretSanta = JSON.parse(sessionStorage.getItem('secretSanta'));
const results = document.getElementById("results");
console.log(secretSanta);
displaySecretSanta();

function displaySecretSanta() {
    for (let [gifter, giftee] of Object.entries(secretSanta)) {
        let node = document.createElement("h4");
        node.innerHTML = `${gifter} &#8702; ${giftee}`;
        results.appendChild(node);
    }
}

function secretSantaJSON(secretSanta) {
    /* Converts the secret santa to a JSON */
    return JSON.stringify(secretSanta);
}

function secretSantaCSV(secretSanta) {
    /* Converts the secret santa to a CSV */
    const csvRows = ["gifter,giftee"];
    for (let [gifter, giftee] of Object.entries(secretSanta)) {
        csvRows.push(`${gifter},${giftee}`);
    }
    return csvRows.join('\n')
}