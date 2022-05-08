import './TeamInfo.css'
import { useState, useEffect } from 'react'
import { BarChart, Bar, LabelList, XAxis, Tooltip, CartesianGrid, YAxis, ResponsiveContainer, Label } from 'recharts'

const TeamInfo = ({ lineupWeek, lineupYear }) => {

	const [teamInfo, setTeamInfo] = useState([])

	useEffect(() => {
		getTeamData()
	}, [])

	const getTeamData = async () => {
		const res = await fetch('/teaminfo?week=9&year=2020',{
			method: 'GET',
			headers: {
				'x-access-token': sessionStorage.dfsTrackerToken
			}
		})
		setTeamInfo(processTeamInfo(await res.json()))
	}

	const processTeamInfo = (info) => {
		info.forEach((item) => {
			item["points"] = parseFloat((item["points"]).toFixed(2))
		})
		info.sort((a, b) => {
			return b["points"] - a["points"]
		})
		return info
	}

	const renderCustomizedLabel = (props) => {
		const { x, y, width, height, value } = props
		const fireOffset = value < 5
		const offset = fireOffset ? -50 : 5

		return (
			<text x={x + width - offset} y={y + height - 12} fill={fireOffset ? "black" : "white"} textAnchor="end">{value} Pts</text>
		)
	}

  return (
		<div className="team-bar-chart">
			<h1>Team Scoring</h1>
			<div className="team-bar-chart-inner">
	  		<BarChart data={teamInfo} width={500} height={1200} layout="vertical">
	  			<XAxis type="number" hide />
	  			<YAxis type="category" dataKey="team" />
	  			<Bar dataKey="points" fill="#8884d8">
	  				<LabelList dataKey="points" content={renderCustomizedLabel} style={{ fill: "white" }}/>
	  			</Bar>
	  		</BarChart>
	  	</div>
  	</div>
  )
}

export default TeamInfo