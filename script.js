const names = document.getElementById('names');
let lastID = 0;
addNewEntry();

function addNewEntry() {
    /* Loads a new input text and remove button when the very last entry
    is modified for the first time */
    if (lastID > 0){
        document.getElementById(`name-${lastID}`).removeEventListener(
            'input', addNewEntry);
        document.getElementById(`remove-name-${lastID}`).style.display = "initial";
    }
    lastID++;
    createNewEntry();
    createRemoveEntryButton();
}

function createNewEntry() {
    /* Creates an input text */
    const entry = document.createElement("input");
    entry.setAttribute("id", `name-${lastID}`);
    entry.setAttribute("placeholder", `Enter Name ${lastID}`);
    names.appendChild(entry);
    document.getElementById(`name-${lastID}`).addEventListener(
        'input', addNewEntry);
}

function createRemoveEntryButton() {
    /* Creates a button which allows the user to delete a given entry */
    const removeButton = document.createElement("button");
    removeButton.innerText = "Remove";
    removeButton.setAttribute("class", "removeEntry");
    removeButton.setAttribute("id", `remove-name-${lastID}`);
    names.appendChild(removeButton);
    removeButton.addEventListener(
        "click", event => {
            let removeID = parseInt(event.target.id.replace("remove-name-", ""));
            removeEntry(removeID);
        }
    )
    // Upon creation, the button is hidden since the very last entry
    // is meant to provide an additional entry if one is needed 
    removeButton.style.display = "none";
}

function removeEntry(removeID) {
    /* Deletes the specified entry, and updates the remaining entries
    such that their IDs are in the correct order */

    // Remove the entry with ID equal to remove ID
    document.getElementById(`name-${removeID}`).remove();
    document.getElementById(`remove-name-${removeID}`).remove();
    lastID--;

    // Update the IDs with ID > removeID
    const entries = Array.from(document.querySelectorAll("input"));
    entries.forEach(
        node => {
            curID = parseInt(node.id.replace("name-", ""));
            if (curID < removeID) {
                return 
            }
            node.id = `name-${curID-1}`;
            node.placeholder = `Enter Name ${curID-1}`;
        }
    );

    const removes = Array.from(document.querySelectorAll("button.removeEntry"));
    removes.forEach(
        node => {
            curID = parseInt(node.id.replace("remove-name-", ""));
            if (curID < removeID) {
                return 
            }
            node.id = `remove-name-${curID-1}`;
        }
    );
}

function pairIDs(lastID) {
    /* Pairs IDs such that no ID is paired with itself and no two pairs
    of IDs are exclusively paired to each other. To ensure these conditions
    always hold, the resulting pairings must form a polygon */
    const pairings = {};
    const drawn = new Set();
    let gifter = 1;
    let giftee = Math.floor(Math.random()*(lastID-1)) + 2;
    pairings[gifter] = giftee;
    drawn.add([gifter, giftee]);
    while (drawn.size < lastID) {
        gifter = giftee;
        while (drawn.has(giftee)) {
            giftee = Math.floor(Math.random()*(lastID-1)) + 2;
        }
        pairings[gifter] = giftee;
        drawn.add(giftee);
    }
    pairings[giftee] = 1;
    return pairings
}

function pairNames(nameIDs, pairings) {
    /*Creates a dictionary consisting of the giftees each gifter 
    has been assigned*/
    const secretSanta = {};
    for (let [gifter, giftee] of Object.entries(pairings)) {
        secretSanta[nameIDs[gifter]] = nameIDs[giftee];
    }
    return secretSanta
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