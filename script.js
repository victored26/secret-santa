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