function rollDie(sides) {
    return getRandInt(1, sides);
}

function getRandInt(min, max) {
    return Math.floor(min + (Math.random() * max));
}