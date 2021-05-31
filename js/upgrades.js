const UPGRADES = {
    getUpgrade(x) { return (player.pickedUpgs[x] !== undefined)?player.pickedUpgs[x]:1 },
    addUpgrade(x, n) {
        if (player.pickedUpgs[x] === undefined) player.pickedUpgs[x] = 1
        if (player.pickedUpgs[x]+n > 0 && player.pickedUpgs[x]+n <= this.getUSLength()) player.pickedUpgs[x] += n
    },
    getLength() { return Object.keys(this.types).length },
    getUSLength() { return Object.keys(player.upgradeSlot).length },
    getUpgradeSlots() {
        return {
            1: true,
            2: true,
            3: player.balancedUpgs.includes(3),
            4: UPGRADES.superBalanced.unlocked(2,1),
        }
    },
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
            desc(x, eff = this.effect(x)) { return `Multiply points gain by ${format(eff, 1)}x` },
            effect(x, num = FUNS.getNumber(x)) {
                if (player.balancedUpgs.includes(1)) num = num.add(num.pow(0.5))
                let eff = num.pow(1.5)
                if (x-1 > 0 && UPGRADES.superBalanced.unlocked(2,1)) if (player.upgradeSlot[UPGRADES.getUpgrade(x-1)] == 4) eff = eff.pow(UPGRADES.types[4].effect(x-1))
                return eff
            },
        },
        2: {
            type: 'mult',
            desc(x, eff = this.effect(x)) { return `Multiply points gain based on your points. (${format(eff, 1)}x)` },
            effect(x, num = FUNS.getNumber(x)) {
                if (player.balancedUpgs.includes(1)) num = num.pow(0.5)
                let eff = player.points.add(1).log10().add(1).pow(1.25).mul(player.balancedUpgs.includes(1)?num:1).pow(player.balancedUpgs.includes(4)?1.5:1)
                if (x-1 > 0 && UPGRADES.superBalanced.unlocked(2,1)) if (player.upgradeSlot[UPGRADES.getUpgrade(x-1)] == 4) eff = eff.pow(UPGRADES.types[4].effect(x-1))
                return eff
            },
        },
        3: {
            type: 'mult',
            desc(x, eff = this.effect(x)) { return `Boosts points based on balanced points. (${format(eff, 1)}x)` },
            effect(x, num = FUNS.getNumber(x)) {
                if (player.balancedUpgs.includes(1)) num = num.add(num.pow(0.5))
                let eff = E(1.5).add(player.balancedPoints.mul(0.25)).pow(num)
                if (x-1 > 0 && UPGRADES.superBalanced.unlocked(2,1)) if (player.upgradeSlot[UPGRADES.getUpgrade(x-1)] == 4) eff = eff.pow(UPGRADES.types[4].effect(x-1))
                return eff
            },
        },
        4: {
            type: 'custom',
            desc(x, eff = this.effect(x)) { return `Picked upgrade in next number slot effect is raised by ${format(eff)}` },
            effect(x, num = FUNS.getNumber(x)) {
                if (player.balancedUpgs.includes(1)) num = num.add(num.pow(0.5))
                let eff = num.pow(0.5)
                if (x-1 > 0 && UPGRADES.superBalanced.unlocked(2,1)) if (player.upgradeSlot[UPGRADES.getUpgrade(x-1)] == 4) eff = eff.pow(UPGRADES.types[4].effect(x-1))
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
            if (this.canBuy(x)) {
                player.balancedUpgs.push(x)
                if (x == 2) player.numbers = {}
                updateUpgradeSlot()
            }
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
    superBalanced: {
        getUnspent() { return player.SBPoints.sub(player.SBTypes[1]).sub(player.SBTypes[2]) },
        unlocked(x, y) { return player.SBTypes[x].gte(y) },
        addType(x, n) {
            if (this.getUnspent().gte(1) || n < 0) player.SBTypes[x] = player.SBTypes[x].add(n).floor().max(0)
        },
        cols: 1,
        1: {
            title: "Numberize",
            1: {
                desc() { return `Maximum numbers is increased by 5` },
            },
        },
        2: {
            title: "Upgraded",
            1: {
                desc() { return `Adds a new effect for numbers` },
            },
            2: {
                desc() { return `blah blah blah` },
            },
        },
    },
}