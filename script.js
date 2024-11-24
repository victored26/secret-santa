const names = document.getElementById('names');
const submit = document.getElementById("submit");
let lastID = 0;
addNewEntry();
submit.addEventListener('click', submitNames);

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

function submitNames() {
    /* Submits the names as long as there are at least three names. The names
    are then paired accordingly, and the user is sent to the results page. */
    deleteEmptyEntries();
    if (lastID < 4) {
        return
    }
    secretSanta();
    window.location.assign('results.html');
}

function deleteEmptyEntries() {
    /* Deletes all the empty entries except for the very last entry.*/
    let entry;
    let id = 1;
    while (id < lastID) {
        entry = document.getElementById(`name-${id}`);
        if (entry.value == "") {
            removeEntry(id);
        } else{
            id++;
        }
    }
}

function entriesToNameIDs() {
    /* Creates a dictionary mapping IDs to names */
    const nameIDs = {};
    const entries = Array.from(document.querySelectorAll("input"));
    entries.forEach(
        node => {
            const nodeID = parseInt(node.id.replace("name-", ""));
            if (nodeID == lastID) {
                return
            }
            nameIDs[nodeID] = node.value;
        }
    );
    return nameIDs
}

function pairIDs(lastValidID) {
    /* Pairs IDs such that no ID is paired with itself and no two pairs
    of IDs are exclusively paired to each other. To ensure these conditions
    always hold, the resulting pairings must form a polygon */
    const pairings = {};
    const drawn = new Set();
    let gifter = 1;
    let giftee = Math.floor(Math.random()*(lastValidID-1)) + 2;
    pairings[gifter] = giftee;
    drawn.add([gifter, giftee]);
    while (drawn.size < lastValidID) {
        gifter = giftee;
        while (drawn.has(giftee)) {
            giftee = Math.floor(Math.random()*(lastValidID-1)) + 2;
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

function secretSanta() {
    const results = pairNames(entriesToNameIDs(), pairIDs(lastID-1));
    sessionStorage.setItem('secretSanta', JSON.stringify(results));
}