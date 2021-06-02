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
    for (let x = 1; x <= ACHS.length; x++) ACHS.unlock(x)
    if (player.auto_bal && player.achs.includes(5)) FUNS.startGain(true)
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
    achs: [],
    auto_bal: false,
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
    let keys = Object.keys(PLAYER_DATA)
    for (let key in keys) {
        if (player[keys[key]] === undefined) player[keys[key]] = PLAYER_DATA[keys[key]]
    }
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
        location.reload()
    }
}

function loadGame() {
    wipe()
    load(localStorage.getItem("testSave"))
    loadVue()
    setInterval(save,1000)
    document.getElementById('loading').style.display = 'none'
    document.getElementById('app').style.display = 'block'
}