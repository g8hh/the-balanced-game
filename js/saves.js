function E(x){return new ExpantaNum(x)};

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
}

function wipe() {
    player = PLAYER_DATA
}

function loadPlayer(load) {
    //player = load
    checkIfUndefined()
    convertToExpNum()
}

function checkIfUndefined() {

}

function convertToExpNum() {

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