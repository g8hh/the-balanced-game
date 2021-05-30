const UPGRADES = {
    getUpgrade(x) { return (player.pickedUpgs[x] !== undefined)?player.pickedUpgs[x]:1 },
    addUpgrade(x, n) {
        if (player.pickedUpgs[x] === undefined) player.pickedUpgs[x] = 1
        if (player.pickedUpgs[x]+n > 0 && player.pickedUpgs[x]+n <= this.getUpgradeSlot()) player.pickedUpgs[x] += n
    },
    getLength() { return Object.keys(this.types).length },
    getUpgradeSlot() { return 2 + (player.balancedUpgs.includes(3)?1:0) },
    types: {
        /*
        1: {
            type: 'mult',
            desc() { return `Placeholder` },
            effect(x=E(1)) {
                let eff = x
                return eff
            },
        },
        */
        1: {
            type: 'mult',
            desc(x, eff = this.effect(FUNS.getNumber(x))) { return `Multiply points gain by ${format(eff, 1)}x` },
            effect(x = E(1)) {
                let num = x
                if (player.balancedUpgs.includes(1)) num = num.add(num.pow(0.5))
                let eff = num.pow(1.5)
                return eff
            },
        },
        2: {
            type: 'mult',
            desc(x, eff = this.effect(FUNS.getNumber(x))) { return `Multiply points gain based on your points. (${format(eff, 1)}x)` },
            effect(x=E(1)) {
                let num = E(1)
                if (player.balancedUpgs.includes(1)) num = x.pow(0.5)
                let eff = player.points.add(1).log10().add(1).pow(1.25).mul(num).pow(player.balancedUpgs.includes(4)?1.5:1)
                return eff
            },
        },
        3: {
            type: 'mult',
            desc(x, eff = this.effect(FUNS.getNumber(x))) { return `Boosts points based on balanced points. (${format(eff, 1)}x)` },
            effect(x=E(1)) {
                let num = x
                if (player.balancedUpgs.includes(1)) num = num.add(num.pow(0.5))
                let eff = E(1.5).add(player.balancedPoints.mul(0.25)).pow(num)
                return eff
            },
        },
    },
    balanced: {
        getUnspentBP() {
            let spent = E(0)
            for (let x = 1; x <= this.cols; x++) if (player.balancedUpgs.includes(x)) spent = spent.add(this[x].cost())
            return player.balancedPoints.sub(spent)
        },
        canBuy(x) { return this.getUnspentBP().gte(this[x].cost()) && !player.balancedUpgs.includes(x) },
        buy(x) {
            if (this.canBuy(x)) player.balancedUpgs.push(x)
        },
        cols: 4,
        1: {
            title: "Boost",
            desc: "Makes all numbers better",
            cost() { return E(1) },
        },
        2: {
            title: "More numbers",
            desc: "You can pick another number",
            cost() { return E(1) },
        },
        3: {
            title: "More options",
            desc: "Adds a new effect for numbers",
            cost() { return E(2) },
        },
        4: {
            title: "Strong Upgrade",
            desc: "Makes Number Upgrade #2 be stronger",
            cost() { return E(2) },
        },
    },
}