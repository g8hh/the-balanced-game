function E(x){return new ExpantaNum(x)};
function ex(x){
    let nx = new E(0);
    nx.array = x.array;
    nx.sign = x.sign;
    nx.layer = x.layer;
    return nx;
}

function calc(dt) {
    if (player.time == 0) FUNS.popup.add(`Hello!`, `Welcome to "the Balanced Upgrade!"<br>You are started to pick any numbers and upgrades, then start to gain points!<br>Good luck :)`, `Thanks, lets play!`)
    player.time += dt
    if (player.start) player.points = player.points.add(FUNS.getPointsGain().mul(dt))
    for (let x = 1; x <= ACHS.length; x++) ACHS.unlock(x)
    if (player.auto_bal && player.achs.includes(5)) FUNS.startGain(true)
    document.getElementById('popup').style.visibility = (player.popups.length == 0)?'hidden':'visible'
}

window.addEventListener('resize', e=>{
    updateDisplay()
})

function updateDisplay() {
    updatePopup()
}

function updatePopup() {
    popup = document.getElementById('msg_popup').style;
    var w = window.innerWidth, h = window.innerHeight;
    var psize = [550, 400]
    popup.width = psize[0]
    popup.height = psize[1]
    popup.left = (w-psize[0])/2
    popup.top = (h-psize[1])/2

    var dis = FUNS.popup.display()
    if (!dis) return
    document.getElementById('popup_title').innerHTML = dis.title
    document.getElementById('popup_desc').innerHTML = dis.desc
    document.getElementById('popup_button').innerHTML = dis.button
}

const PLAYER_DATA = {
    popups: [],
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
    updateUpgradeSlot()
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
    if (localStorage.getItem("TBU_Save") == '') wipe()
    localStorage.setItem("TBU_Save",btoa(JSON.stringify(player)))
}

function load(x){
    if(typeof x == "string" && x != '' && x != null){
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
    load(localStorage.getItem("TBU_Save"))
    loadVue()
    updateDisplay()
    setInterval(save,1000)
    document.getElementById('loading').style.display = 'none'
    document.getElementById('app').style.display = 'block'
}