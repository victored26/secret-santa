const names = document.getElementById('names');
const submit = document.getElementById("submit");
const session = JSON.parse(sessionStorage.getItem('secretSanta'));
let lastID = 0;
addNewEntry();
populateExistingEntries(session);
submit.addEventListener('click', submitNames);

function populateExistingEntries(session) {
    /* Repopulates the entries with the names that were submitted by
    the user */
    for (let name in session) {
        document.getElementById(`name-${lastID}`).value = name;
        addNewEntry();
    }
}

function addNewEntry() {
    /* Loads a new input text and remove button when the very last entry
    is modified for the first time */
    if (lastID > 0){
        document.getElementById(`name-${lastID}`).removeEventListener(
            'input', addNewEntry);
        document.getElementById(`remove-name-${lastID}`).style.display = "initial";
    }
    lastID++;
    createNewEntryDiv();
    createNewEntry();
    createRemoveEntryButton();
}

function createNewEntryDiv() {
    /* Creates a container for input text and delete button */
    const container = document.createElement("div");
    container.setAttribute("id", `div-${lastID}`);
    container.setAttribute("class", `entries`);
    names.appendChild(container);
}

function createNewEntry() {
    /* Creates an input text */
    const entry = document.createElement("input");
    entry.setAttribute("id", `name-${lastID}`);
    entry.setAttribute("placeholder", `Enter Name ${lastID}`);
    document.getElementById(`div-${lastID}`).appendChild(entry);
    document.getElementById(`name-${lastID}`).addEventListener(
        'input', addNewEntry);
    document.getElementById(`name-${lastID}`).scrollIntoView({behavior: "smooth"});
}

function createRemoveEntryButton() {
    /* Creates a button which allows the user to delete a given entry */
    const removeButton = document.createElement("button");
    removeButton.innerHTML = "x";
    removeButton.setAttribute("class", "btn btn-outline-danger removeEntry");
    removeButton.setAttribute("id", `remove-name-${lastID}`);
    document.getElementById(`div-${lastID}`).appendChild(removeButton);
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

    // Remove the entry div with ID equal to remove ID
    document.getElementById(`div-${removeID}`).remove();
    lastID--;

    // Update the IDs with ID > removeID
    const containers = Array.from(document.querySelectorAll("div.entries"));
    containers.forEach(
        container => {
            curID = parseInt(container.id.replace("div-", ""));
            if (curID < removeID) {
                return 
            }
            container.id = `div-${curID-1}`;
        }
    );

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
    validateEntries();
    if (lastID < 4) {
        return
    }
    secretSanta();
    window.location.assign('results.html');
}

function validateEntries() {
    /* Deletes all empty and duplicate entries*/
    let id = 1;
    const nameSet = new Set([""]);
    while (id < lastID) {
        if (nameSet.has(document.getElementById(`name-${id}`).value)) {
            removeEntry(id);
        } else{
            nameSet.add(document.getElementById(`name-${id}`).value);
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
    /* Creates a dictionary consisting of the giftees each gifter 
    has been assigned */
    const secretSanta = {};
    for (let [gifter, giftee] of Object.entries(pairings)) {
        secretSanta[nameIDs[gifter]] = nameIDs[giftee];
    }
    return secretSanta
}

function secretSanta() {
    /* Translates ID pairings to name pairings and records results in 
    session storage */
    const results = pairNames(entriesToNameIDs(), pairIDs(lastID-1));
    sessionStorage.setItem('secretSanta', JSON.stringify(results));
}