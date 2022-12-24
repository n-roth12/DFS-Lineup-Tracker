
const getTeamProjPoints = (lineup) => {
    var projectedPoints = 0
    for (const [k,  lineupSlot] of Object.entries(lineup)) {
        if (lineupSlot !== null) {
            projectedPoints += parseFloat(lineupSlot["fppg"])
        }
    }
    return parseFloat(projectedPoints).toFixed(2)
}

const getRemainingSalary = (lineup, salaryCap) => {
    var remaining = salaryCap
    for (const [k,  lineupSlot] of Object.entries(lineup)) {
        if (lineupSlot !== null) {
            remaining -= lineupSlot["salary"]
        }
    }
    return remaining
}

const getLineupSalary = (lineup) => {
    var salary = 0
    for (const [k,  lineupSlot] of Object.entries(lineup)) {
        if (lineupSlot !== null) {
            salary += lineupSlot["salary"]
        }
    }
    return salary
}

export { getTeamProjPoints, getRemainingSalary, getLineupSalary }