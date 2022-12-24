import { getTeamProjPoints, getRemainingSalary, getLineupSalary } from "./Utilities"

const fetchDraftGroupByDraftGroupId = async (draftGroupId) => {
    const res = await fetch(`/upcoming/draftGroup?draftGroup=${draftGroupId}`, {
        method: 'GET',
        headers: {
            'x-access-token': sessionStorage.dfsTrackerToken
        }
    })
    const data = await res.json()
    return data
}

const fetchUserLineupsByDraftGroupId = async (draftGroupId) => {
    const res = await fetch(`/users/lineups/draftGroup?draftGroup=${draftGroupId}`, {
        method: 'GET',
        headers: {
            'x-access-token': sessionStorage.dfsTrackerToken
        }
    })
    const data = await res.json()
    return data
}

const fetchDraftablesByDraftGroupId = async (draftGroupId) => {
    const res = await fetch(`/upcoming/players?draftGroup=${draftGroupId}`, {
        method: 'GET',
        headers: {
            'x-access-token': sessionStorage.dfsTrackerToken
        }
    })
    const data = await res.json()
    var mySet = new Set()
    var draftables = []
    data.forEach((player) => {
        if (!mySet.has(player["playeSiteId"])) {
            draftables.push(player)
            mySet.add(player["playerSiteId"])
        }
    })
    return draftables
}

const postLineupUpdate = async (lineup, draftGroup) => {
    console.log(sessionStorage.dfsTrackerToken)
    const teamSalary = getLineupSalary(lineup["lineup"])
    const res = await fetch(`/lineups/updateLineup`, {
        method: 'POST',
        headers: {
            'x-access-token': sessionStorage.dfsTrackerToken
        },
        body: JSON.stringify({
            "lineup": lineup,
            "draftGroupId": draftGroup["draftGroupId"],
            "lineupId": lineup["lineupId"],
            "salary": getLineupSalary(lineup["lineup"]),
            "projectedPoints": getTeamProjPoints(lineup["lineup"]),
            "projectedOwn": 120,
            "startTime": draftGroup["startTime"],
            "endTime": draftGroup["endTime"],
            "startTimeSuffix": draftGroup["startTimeSuffix"],
            "site": draftGroup["site"],
            "salaryCap": draftGroup["salaryCap"]
        })
    })
    .then(() => {
        console.log("test")
        if (teamSalary > draftGroup["salaryCap"]) {
            return "Lineup Saved with Warning: Lineup over the salary cap!"
        } else {
            return "Lineup Saved"
        }    
    })
    .catch((error) => {
        console.log("test2")
        return "Error while saving lineup!"
    })
}

const createEmptyLineup = async (draftGroup) => {
    const res = await fetch(`/lineups/createEmptyLineup`, {
        method: 'POST',
        headers: {
            'x-access-token': sessionStorage.dfsTrackerToken
        },
        body: JSON.stringify({
            "draftGroupId": draftGroup["draftGroupId"],
            "startTime": draftGroup["startTime"],
            "endTime": draftGroup["endTime"],
            "site": draftGroup["site"],
            "startTimeSuffix": draftGroup["startTimeSuffix"],
            "salaryCap": draftGroup["salaryCap"]
        })
    })
    const data = await res.json()
    return data["lineupId"]
}

const exportLineups = async (lineupsToExport) => {
    const res = await fetch(`/lineups/export`, {
        method: 'POST',
        headers: {
            'x-access-token': sessionStorage.dfsTrackerToken
        },
        body: JSON.stringify(lineupsToExport)
    })
    const data = await res.blob()
    return data
}

const getUpcomingSlates = async () => {
    const res = await fetch('/upcoming/slates_new', {
        method: 'GET',
        headers: {
            'x-access-token': sessionStorage.dfsTrackerToken
        }
    })
    const data = await res.json()
    const upcoming = data.filter((slate) => {
        return Date.parse(slate["startTime"].split("T")[0]) > Date.parse(new Date())
    })
    return upcoming
}

const getUserLineupsAll = async () => {
	const res = await fetch(`/users/lineups`, {
		method: 'GET',
		headers: {
		    'x-access-token': sessionStorage.dfsTrackerToken
		}
	})
    const userLineups = await res.json()
    return userLineups
}

export { fetchDraftGroupByDraftGroupId, 
    fetchUserLineupsByDraftGroupId, 
    fetchDraftablesByDraftGroupId, 
    postLineupUpdate,
    createEmptyLineup,
    exportLineups,
    getUserLineupsAll   
}