# Proof of concept

from random import randint

def assignID(names: list[str]):
    """Creates a dictionary where each name is assigned an integer"""
    name_id = {}
    for j in range(len(names)):
        name_id[j+1] = names[j]
    return name_id

def pairIDs(length: int):
    """Pairs IDs such that no ID is paired with itself and no two pairs
    of IDs are exclusively paired to each other"""
    # For these conditions to always hold, the IDs must be assigned such that
    # there exists exactly one closed loop
    pairings = {j:j for j in range(1, length+1)}
    giftee = randint(2, length)
    pairings[1] = giftee
    drawn = {1, giftee}
    while len(drawn) < length:
        gifter = giftee
        while giftee in drawn:
            giftee = randint(2, length)
        pairings[gifter] = giftee
        drawn.add(giftee)
    pairings[giftee] = 1
    return pairings