const ACHS = {
    checkUnlock(x) { return this[x].can() && !player.achs.includes(x) },
    unlock(x) {
        if (this.checkUnlock(x)) {
            player.achs.push(x)
            $.notify(this[x].title, "success")
            if (x == 1) FUNS.popup.add(`Good job!`, `Congrats, you've got first balanced point in <b>${formatTime(player.time)}</b> s!<br>Oh i forgot to say, new tab are unlocked!`, `Yeah!`)
            if (x == 3) FUNS.popup.add(`OMG, Perfect!`, `Congrats again, you've got first SUPER balanced point in <b>${formatTime(player.time)}</b> s!<br>Oh again, i forgot to say, new another tab are unlocked!<br>You can choose one of types: Numberize & Upgraded...`, `Good!`)
            if (x == 8) FUNS.popup.add("Congratulations!", `You completed the game "The Balanced Upgrade" in <b>${formatTime(player.time)}</b> sbr>You can continue playing the game!`, "Let's go!")
        }
    },
    length: 8,
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
    7: {
        title: "Illuminati Confirmed!",
        desc: "Get 15 super balanced points.",
        can() { return player.SBPoints.gte(15) },
    },
    8: {
        title: "Got Infinity!",
        desc: `Reach over ${format(E(2).pow(1024))} points to complete game!`,
        can() { return player.points.gte(E(2).pow(1024)) },
    },
}