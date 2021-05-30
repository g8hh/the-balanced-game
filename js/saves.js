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
    points: E(0),
    pickedNumbers: {},
    pickedUpgs: {},
    numbers: {},
    start: false,
    balancedPoints: E(0),
    balancedUpgs: [],
}

function wipe() {
    player = PLAYER_DATA
}

function loadPlayer(load) {
    player = load
    checkIfUndefined()
    convertToExpNum()
    player.pickedNumbers = PLAYER_DATA.pickedNumbers
}

function checkIfUndefined() {
    if (player.time === undefined) player.time = PLAYER_DATA.time
    if (player.points === undefined) player.points = PLAYER_DATA.points
    if (player.pickedUpgs === undefined) player.pickedUpgs = PLAYER_DATA.pickedUpgs
    if (player.numbers === undefined) player.numbers = PLAYER_DATA.numbers
    if (player.start === undefined) player.start = PLAYER_DATA.start
    if (player.balancedPoints === undefined) player.balancedPoints = PLAYER_DATA.balancedPoints
    if (player.balancedUpgs === undefined) player.balancedUpgs = PLAYER_DATA.balancedUpgs
}

function convertToExpNum() {
    player.points = ex(player.points)
    for (let x = 1; x <= FUNS.getSlot(); x++) if (player.numbers[x] !== undefined) player.numbers[x] = ex(player.numbers[x])
    player.balancedPoints = ex(player.balancedPoints)
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
    a.download = "Test Save.txt"
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