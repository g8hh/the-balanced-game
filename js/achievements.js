const ACHS = {
    checkUnlock(x) { return this[x].can() && !player.achs.includes(x) },
    unlock(x) {
        if (this.checkUnlock(x)) {
            player.achs.push(x)
            $.notify(this[x].title, "success")
        }
    },
    length: 6,
    1: {
        title: "First Balanced!",
        desc: "Get first balanced point.",
        can() { return player.balancedPoints.gte(1) },
    },
    2: {
        title: "Too fast?",
        desc: "Get 5 balanced points.",
        can() { return player.balancedPoints.gte(5) },
    },
    3: {
        title: "I am SUPER balancer",
        desc: "Get super balanced point.",
        can() { return player.SBPoints.gte(1) },
    },
    4: {
        title: "Super Double",
        desc: "Get 2 super balanced points.",
        can() { return player.SBPoints.gte(2) },
    },
    5: {
        title: "Really bug?!",
        desc: "Get 4 super balanced points. Reward: Unlock Auto-Balance.",
        can() { return player.SBPoints.gte(4) },
    },
    6: {
        title: "TEN TAN TIN",
        desc: "Get 10 super balanced points. Reward: Balanced points resets nothing, if you can finish to get balanced points.",
        can() { return player.SBPoints.gte(10) },
    },
}