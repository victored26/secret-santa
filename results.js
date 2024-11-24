const secretSanta = JSON.parse(sessionStorage.getItem('secretSanta'));
const results = document.getElementById("results");
const downloads = document.getElementById("downloads");
displaySecretSanta();

function displaySecretSanta() {
    for (let [gifter, giftee] of Object.entries(secretSanta)) {
        let node = document.createElement("h3");
        node.innerHTML = `${gifter} &#8702; ${giftee}`;
        results.appendChild(node);
    }
    downloadJSON();
    downloadCSV();
}

function downloadJSON() {
    const blob = new Blob(
        [JSON.stringify(secretSanta, null, 2)],
        {type: 'application/json'}
    );
    const url = URL.createObjectURL(blob);
    const node = document.createElement("a");
    node.setAttribute("href", url);
    node.setAttribute("download", "secret_santa.json");
    node.textContent = "Download as JSON";
    downloads.appendChild(node); 
}

function downloadCSV() {
    const blob = new Blob(
        [secretSantaCSV()],
        {type: 'application/csv'}
    );
    const url = URL.createObjectURL(blob);
    const node = document.createElement("a");
    node.setAttribute("href", url);
    node.setAttribute("download", "secret_santa.csv");
    node.textContent = "Download as CSV";
    downloads.appendChild(node); 
}

function secretSantaCSV() {
    /* Converts the secret santa to a CSV */
    const csvRows = ["gifter,giftee"];
    for (let [gifter, giftee] of Object.entries(secretSanta)) {
        csvRows.push(`${gifter},${giftee}`);
    }
    return csvRows.join('\n')
}