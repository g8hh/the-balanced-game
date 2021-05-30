var diff = 0;
var date = Date.now();
var player

const FUNS = {
    getPickedNumber(x) { return (player.pickedNumbers[x] != '' && player.pickedNumbers[x] !== undefined && !E(player.pickedNumbers[x]).isNaN())?E(player.pickedNumbers[x]):E(1) },
    setNumber(x) {
        player.numbers[x] = this.getPickedNumber(x).max(1).min(this.getMaxNumbers())
        if (this.getSpentNumbers().gt(this.getMaxNumbers())) player.numbers[x] = player.numbers[x].sub(this.getSpentNumbers().sub(this.getMaxNumbers()))
    },
    getNumber(x) { return player.numbers[x] !== undefined ? player.numbers[x] : E(1) },
    getPointsGain() {
        let mult = E(1)
        for (let x = 1; x <= this.getSlot(); x++) mult = mult.mul(UPGRADES.types[UPGRADES.getUpgrade(x)].effect(this.getNumber(x)))
        return mult
    },
    startGain() {
        if (player.start && this.canFinish()) {
            player.balancedPoints = player.balancedPoints.add(1)
        }
        player.points = E(0)
        player.start = !player.start
    },
    getMaxNumbers() { return E(10) },
    getSpentNumbers() {
        let num = E(0)
        for (let x = 1; x <= this.getSlot(); x++) num = num.add(this.getNumber(x))
        return num
    },
    getFinishPoints(x=player.balancedPoints) { return E(8).pow(x).mul(15000) },
    canFinish() { return player.points.gte(this.getFinishPoints()) },
    startMsg() { return player.start?(this.canFinish()?"Complete to get 1 balanced points":"Cancel to gain points"):"Start to gain points, but you can't pick numbers & upgrades!" },
    getSlot() { return 3 + (player.balancedUpgs.includes(2)?1:0) },
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