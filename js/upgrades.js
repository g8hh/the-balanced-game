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
    getNumbers(x, u = 0) {
        let num = x
        if (player.balancedUpgs.includes(1)) {
            if (u == 2) num = num.pow(0.5)
            else num = num.add(num.pow(0.5))
        }
        if (UPGRADES.superBalanced.unlocked(1,2)) num = num.mul(1.15)
        if (UPGRADES.superBalanced.unlocked(1,5)) num = num.mul(UPGRADES.superBalanced[1][5].effect())
        return num
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
            effect(x, num = UPGRADES.getNumbers(FUNS.getNumber(x))) {
                let eff = num.pow(1.5)
                if (x-1 > 0 && UPGRADES.superBalanced.unlocked(2,1)) if (player.upgradeSlot[UPGRADES.getUpgrade(x-1)] == 4) eff = eff.pow(UPGRADES.types[4].effect(x-1))
                return eff
            },
        },
        2: {
            type: 'mult',
            desc(x, eff = this.effect(x)) { return `Multiply points gain based on your points. (${format(eff, 1)}x)` },
            effect(x, num = UPGRADES.getNumbers(FUNS.getNumber(x), 2)) {
                let eff = player.points.add(1).log10().add(1).pow(1.25).mul(player.balancedUpgs.includes(1)?num:1).pow(player.balancedUpgs.includes(4)?1.5:1)
                if (x-1 > 0 && UPGRADES.superBalanced.unlocked(2,1)) if (player.upgradeSlot[UPGRADES.getUpgrade(x-1)] == 4) eff = eff.pow(UPGRADES.types[4].effect(x-1))
                if (UPGRADES.superBalanced.unlocked(2,4)) eff = eff.pow(2)
                return eff
            },
        },
        3: {
            type: 'mult',
            desc(x, eff = this.effect(x)) { return `Boosts points based on balanced points. (${format(eff, 1)}x)` },
            effect(x, num = UPGRADES.getNumbers(FUNS.getNumber(x))) {
                let base = E(1.5).add(player.balancedPoints.mul(0.25))
                if (UPGRADES.superBalanced.unlocked(2,3)) base = base.mul(UPGRADES.superBalanced[2][3].effect())
                let eff = base.pow(num)
                if (x-1 > 0 && UPGRADES.superBalanced.unlocked(2,1)) if (player.upgradeSlot[UPGRADES.getUpgrade(x-1)] == 4) eff = eff.pow(UPGRADES.types[4].effect(x-1))
                return eff
            },
        },
        4: {
            type: 'custom',
            desc(x, eff = this.effect(x)) { return `Picked upgrade in next number slot effect is raised by ${format(eff)} (cannot affect by this other)` },
            effect(x, num = UPGRADES.getNumbers(FUNS.getNumber(x))) {
                let eff = num.pow(0.5)
                if (UPGRADES.superBalanced.unlocked(2,5)) eff = eff.mul(1.15)
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
        cols: 6,
        1: {
            title: "Boost",
            desc() { return "Makes all numbers better" },
            cost() { return E(1) },
        },
        2: {
            title: "More numbers",
            desc() { return "You can pick another number" },
            cost() { return E(1) },
        },
        3: {
            title: "More options",
            desc() { return "Adds a new effect for numbers" },
            cost() { return E(2) },
        },
        4: {
            title: "Strong Upgrade",
            desc() { return "Makes Number Upgrade #2 be stronger" },
            cost() { return E(2) },
        },
        5: {
            unl() { return UPGRADES.superBalanced.unlocked(2,2) },
            title: "Less Requirement",
            desc(eff=this.effect()) { return `Divides balanced points requirement based on your super balanced points (/${format(eff,0)})` },
            cost() { return E(6) },
            effect() {
                let eff = player.SBPoints.add(1).pow(player.SBPoints.add(1))
                if (UPGRADES.superBalanced.unlocked(2,7)) eff = eff.pow(2)
                return eff
            },
        },
        6: {
            unl() { return UPGRADES.superBalanced.unlocked(2,6) },
            title: "Weak Requirement",
            desc(eff=this.effect()) { return `Root balanced points requirement based on your balanced points (${format(eff)}√)` },
            cost() { return E(36) },
            effect() { return player.balancedPoints.div(1333).add(1) },
        },
    },
    superBalanced: {
        getUnspent() { return player.SBPoints.sub(player.SBTypes[1]).sub(player.SBTypes[2]) },
        unlocked(x, y) { return ex(player.SBTypes[x]).gte(y) },
        addType(x, n) {
            if (this.getUnspent().gte(1) || n < 0) player.SBTypes[x] = player.SBTypes[x].add(n).floor().max(0)
        },
        cols: 7,
        1: {
            title: "Numberize",
            1: {
                desc() { return `Maximum numbers is increased by 5` },
            },
            2: {
                desc() { return `Numbers are 15% stronger` },
            },
            3: {
                desc() { return `Adds +1 number slot` },
            },
            4: {
                desc() { return `Maximum numbers is increased by 5` },
            },
            5: {
                desc(eff=this.effect()) { return `Makes numbers are ${format(eff.sub(1).mul(100), 3)}% stronger (based on your balanced points)` },
                effect(x=player.balancedPoints) {
                    let eff = x.div(850).add(1)
                    return eff
                },
            },
            6: {
                desc() { return `Adds +1 number slot & +1 max numbers` },
            },
            7: {
                desc() { return `Maximum numbers is increased by 5` },
            },
        },
        2: {
            title: "Upgraded",
            1: {
                desc() { return `Adds a new effect for numbers` },
            },
            2: {
                desc() { return `Unlocks new balanced upgrade` },
            },
            3: {
                desc(eff=this.effect()) { return `Makes upgrade 3 ${format(eff.sub(1).mul(100), 3)}% stronger (based on your super balanced points)` },
                effect(x=player.SBPoints) {
                    let eff = x.add(1).pow(1/8)
                    return eff
                },
            },
            4: {
                desc() { return `Upgrade 2 effect is squared` },
            },
            5: {
                desc() { return `Upgrade 4 are 15% stronger` },
            },
            6: {
                desc() { return `Unlocks new balanced upgrade` },
            },
            7: {
                desc() { return `Balanced upgrade "Less Requirement" are squared` },
            },
        },
    },
}