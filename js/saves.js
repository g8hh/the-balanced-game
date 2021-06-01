function E(x){return new ExpantaNum(x)};
function ex(x){
    let nx = new E(0);
    nx.array = x.array;
    nx.sign = x.sign;
    nx.layer = x.layer;
    return nx;
}

function calc(dt) {
    player.time += dt
    if (player.start) player.points = player.points.add(FUNS.getPointsGain().mul(dt))
}

const PLAYER_DATA = {
    time: 0,
    tab: 1,
    points: E(0),
    pickedNumbers: {},
    pickedUpgs: {},
    numbers: {},
    start: false,
    balancedPoints: E(0),
    balancedUpgs: [],
    SBPoints: E(0),
    balancedStart: false,
    upgradeSlot: {},
    SBTypes: {1: E(0), 2: E(0)},
}

function wipe() {
    player = PLAYER_DATA
}

function loadPlayer(load) {
    player = load
    checkIfUndefined()
    convertToExpNum()
    player.pickedNumbers = PLAYER_DATA.pickedNumbers
    player.upgradeSlot = PLAYER_DATA.upgradeSlot
    player.tab = PLAYER_DATA.tab
    updateUpgradeSlot()
}

function updateUpgradeSlot() {
    player.upgradeSlot = {}
    let n = 1
    for (let x = 1; x <= UPGRADES.getLength(); x++) if (UPGRADES.getUpgradeSlots()[x] !== undefined ? UPGRADES.getUpgradeSlots()[x] : false) {
        player.upgradeSlot[n] = x
        n++
    }
}

function checkIfUndefined() {
    if (player.time === undefined) player.time = PLAYER_DATA.time
    if (player.points === undefined) player.points = PLAYER_DATA.points
    if (player.pickedUpgs === undefined) player.pickedUpgs = PLAYER_DATA.pickedUpgs
    if (player.numbers === undefined) player.numbers = PLAYER_DATA.numbers
    if (player.start === undefined) player.start = PLAYER_DATA.start
    if (player.balancedPoints === undefined) player.balancedPoints = PLAYER_DATA.balancedPoints
    if (player.balancedUpgs === undefined) player.balancedUpgs = PLAYER_DATA.balancedUpgs
    if (player.SBPoints === undefined) player.SBPoints = PLAYER_DATA.SBPoints
    if (player.balancedStart === undefined) player.balancedStart = PLAYER_DATA.balancedStart
    if (player.SBTypes === undefined) player.SBTypes = PLAYER_DATA.SBTypes
}

function convertToExpNum() {
    player.points = ex(player.points)
    for (let x = 1; x <= FUNS.getSlot(); x++) if (player.numbers[x] !== undefined) player.numbers[x] = ex(player.numbers[x])
    player.balancedPoints = ex(player.balancedPoints)
    player.SBPoints = ex(player.SBPoints)
    for (let x = 1; x <= 2; x++) player.SBTypes[x] = ex(player.SBTypes[x])
}

function save(){
    if (localStorage.getItem("testSave") == '') wipe()
    localStorage.setItem("testSave",btoa(JSON.stringify(player)))
}

function load(x){
    if(typeof x == "string" & x != ''){
        loadPlayer(JSON.parse(atob(x)))
    } else {
        wipe()
    }
}

function exporty() {
    save();
    let file = new Blob([btoa(JSON.stringify(player))], {type: "text/plain"})
    window.URL = window.URL || window.webkitURL;
    let a = document.createElement("a")
    a.href = window.URL.createObjectURL(file)
    a.download = "TBU Save.txt"
    a.click()
}

function importy() {
    let loadgame = prompt("Paste in your save WARNING: WILL OVERWRITE YOUR CURRENT SAVE")
    if (loadgame != null) {
        load(loadgame)
    }
}

function loadGame() {
    wipe()
    load(localStorage.getItem("testSave"))
    loadVue()
    setInterval(save,1000)
}