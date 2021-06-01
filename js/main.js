var diff = 0;
var date = Date.now();
var player

function msg(text, show = true, secret = "???") { return show ? text : secret }

const TABS = {
    choose(x, can = true) { if (can) player.tab = x },
    unl() {
        return {
            1: true,
            2: player.balancedPoints.gte(1),
            3: player.SBPoints.gte(1),
            4: true,
        }
    },
    length: 4,
    title: {
        1: "Upgrades",
        2: "Balanced",
        3: "Super Balanced",
        4: "Achievements",
    },
}

const FUNS = {
    getPickedNumber(x) { return (player.pickedNumbers[x] != '' && player.pickedNumbers[x] !== undefined && !E(player.pickedNumbers[x]).isNaN())?E(player.pickedNumbers[x]):E(1) },
    setNumber(x) {
        player.numbers[x] = this.getPickedNumber(x).max(1).min(this.getMaxNumbers())
        if (this.getSpentNumbers().gt(this.getMaxNumbers())) player.numbers[x] = player.numbers[x].sub(this.getSpentNumbers().sub(this.getMaxNumbers()))
    },
    getNumber(x) { return player.numbers[x] !== undefined ? player.numbers[x] : E(1) },
    getPointsGain() {
        let mult = E(1)
        for (let x = 1; x <= this.getSlot(); x++) {
            let n = player.upgradeSlot[UPGRADES.getUpgrade(x)]
            if (UPGRADES.types[n].type == 'mult') mult = mult.mul(UPGRADES.types[n].effect(x))
        }
        return mult
    },
    startGain() {
        if (!player.balancedStart) return
        if (player.start && this.canFinish()) {
            player.balancedPoints = player.balancedPoints.add(1)
        }
        player.points = E(0)
        updateUpgradeSlot()
        player.start = !player.start
    },
    getMaxNumbers() { return E(10).add(UPGRADES.superBalanced.unlocked(1,1)?5:0).add(UPGRADES.superBalanced.unlocked(1,4)?5:0) },
    getSpentNumbers() {
        let num = E(0)
        for (let x = 1; x <= this.getSlot(); x++) num = num.add(this.getNumber(x))
        return num
    },
    getPercent(num, max, log10 = false) {
        let per = log10 ? num.max(1).log10().div(max.max(1).log10()).max(0).min(1) : num.max(0).div(max.max(1)).max(0).min(1)
        return format(per.mul(100))+'%'
    },
    getFinishPoints(x=player.balancedPoints) { return E(8).pow(x).mul(15000).mul(E(3).pow(x.gte(6)?x.sub(5).pow(1.05):0)).div(player.balancedUpgs.includes(5)?UPGRADES.balanced[5].effect():1).max(1) },
    canFinish() { return player.points.gte(this.getFinishPoints()) },
    startMsg() { return player.start?(this.canFinish()?"Complete to get 1 balanced point":"Cancel to gain points"):"Start to gain points, but you can't pick numbers & upgrades!" },
    getSlot() { return 3 + (player.balancedUpgs.includes(2)?1:0) + (UPGRADES.superBalanced.unlocked(1,3)?1:0) },
    superBalanced: {
        msg() { return (player.balancedStart || player.SBPoints.lte(0))?(this.canFinish()?"Complete to get 1 super balanced point":"Cancel to make balanced points"):"Start to make balanced points" },
        canFinish() { return player.balancedPoints.gte(this.req()) },
        req(x=player.SBPoints.add(4)) { return E(x).pow(2).add(x).div(2).sub(x.sub(3)).floor() },
        start() {
            let finish = false
            if ((player.SBPoints.lte(0) ? true : player.balancedStart) && this.canFinish()) finish = true
            if (player.balancedStart && !finish) if (!confirm("Are you really cancel to gain balanced points?")) return
            player.tab = player.balancedStart ? 3 : 1

            player.points = E(0)
            player.balancedPoints = E(0)
            player.balancedUpgs = []
            player.numbers = {}
            player.pickedUpgs = {}
            player.pickedNumbers = {}
            player.start = false
            if (player.SBPoints.gte(1)) player.balancedStart = !player.balancedStart

            if (finish) player.SBPoints = player.SBPoints.add(1)
            updateUpgradeSlot()
        },
    },
}

function loop() {
    diff = Date.now()-date;
    calc(diff/1000);
    date = Date.now();
}

function format(ex, acc=3) {
    ex = E(ex)
    if (ex.isInfinite()) return 'Infinity'
    let e = ex.log10().floor()
    if (e.lt(9)) {
        if (e.lt(3)) {
            return ex.toFixed(acc)
        }
        return ex.floor().toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    } else {
        if (ex.gte("eeee9")) {
            let slog = ex.slog()
            return (slog.gte(1e9)?'':E(10).pow(slog.sub(slog.floor())).toFixed(3)) + "F" + format(slog.floor(), 0)
        }
        let m = ex.div(E(10).pow(e))
        return (e.log10().gte(9)?'':m.toFixed(3))+'e'+format(e,0)
    }
}

setInterval(loop, 50)