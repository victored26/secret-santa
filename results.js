const secretSanta = JSON.parse(sessionStorage.getItem('secretSanta'));
const downloads = document.getElementById("downloads");
const goBack = document.getElementById("goBack");
goBack.addEventListener("click", goBackAction);
displaySecretSanta();

function resultsTable() {
    const results = document.getElementById("results");
    let counter = 0;
    for (let [gifter, giftee] of Object.entries(secretSanta)) {
        let row = results.insertRow(-1);
        let colOne = row.insertCell(0);
        let colTwo = row.insertCell(1);
        colOne.innerHTML = `${gifter}`;
        colTwo.innerHTML = `${giftee}`;
        let className = counter++ % 2 == 0? "table-success" : "table-danger";
        row.classList.add(className);
    }
}

function displaySecretSanta() {
    resultsTable();
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

function goBackAction() {
    /* Returns the user to the initial page */
    window.location.assign('index.html');
}