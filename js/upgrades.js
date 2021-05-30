const UPGRADES = {
    getUpgrade(x) { return (player.pickedUpgs[x] !== undefined)?player.pickedUpgs[x]:1 },
    addUpgrade(x, n) {
        if (player.pickedUpgs[x] === undefined) player.pickedUpgs[x] = 1
        if (player.pickedUpgs[x]+n > 0 && player.pickedUpgs[x]+n <= this.getLength()) player.pickedUpgs[x] += n
    },
    getLength() { return Object.keys(this.types).length },
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
            effect(x=E(1)) {
                let eff = x.pow(1.5)
                return eff
            },
        },
        2: {
            type: 'mult',
            desc(x, eff = this.effect(FUNS.getNumber(x))) { return `Multiply points gain based on your points (${format(eff, 1)}x)` },
            effect(x=E(1)) {
                let eff = player.points.add(1).log10().add(1).pow(1.25)
                return eff
            },
        },
    },
}