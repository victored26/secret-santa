const secretSanta = JSON.parse(sessionStorage.getItem('secretSanta'));
const actions = document.getElementById("actions");
const goBack = document.getElementById("goBack");
goBack.addEventListener("click", goBackAction);
displaySecretSanta();

function displaySecretSanta() {
    /* Displays the results and the download buttons */
    resultsTable();
    downloadJSON();
    downloadCSV();
}

function resultsTable() {
    /* Creates the results table */
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

function downloadJSON() {
    /* Creates a button to download results as a JSON */
    const blob = new Blob(
        [JSON.stringify(secretSanta, null, 2)],
        {type: 'application/json'}
    );
    const url = URL.createObjectURL(blob);
    const node = document.createElement("a");
    node.setAttribute("class", "btn btn-success")
    node.setAttribute("href", url);
    node.setAttribute("download", "secret_santa.json");
    node.textContent = "Download as JSON";
    actions.appendChild(node); 
}

function downloadCSV() {
    /* Creates a button to download results as a CSV */
    const blob = new Blob(
        [secretSantaCSV()],
        {type: 'application/csv'}
    );
    const url = URL.createObjectURL(blob);
    const node = document.createElement("a");
    node.setAttribute("class", "btn btn-success")
    node.setAttribute("href", url);
    node.setAttribute("download", "secret_santa.csv");
    node.textContent = "Download as CSV";
    actions.appendChild(node); 
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