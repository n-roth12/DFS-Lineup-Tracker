import './TeamInfo.css'
import { useState, useEffect } from 'react'
import { BarChart, Bar, LabelList, XAxis, Tooltip, CartesianGrid, YAxis, ResponsiveContainer, Label } from 'recharts'
import { Roller } from 'react-awesome-spinners'

const TeamInfo = ({ week, year }) => {

	const [teamInfo, setTeamInfo] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		getTeamData()
	}, [])

	const getTeamData = async () => {
		const res = await fetch(`/teaminfo?week=${week}&year=${year}`,{
			method: 'GET',
			headers: {
				'x-access-token': sessionStorage.dfsTrackerToken
			}
		})
		setTeamInfo(processTeamInfo(await res.json()))
		setLoading(false)
	}

	const processTeamInfo = (info) => {
		info.forEach((item) => {
			item["points"] = parseFloat((item["points"]).toFixed(2))
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
			{!loading ?
				<div className="team-bar-chart-inner">
		  		<BarChart data={teamInfo} width={500} height={1200} layout="vertical">
		  			<XAxis type="number" hide />
		  			<YAxis type="category" dataKey="team" />
		  			<Bar dataKey="points" fill="#8884d8">
		  				<LabelList dataKey="points" content={renderCustomizedLabel} style={{ fill: "white" }}/>
		  			</Bar>
		  		</BarChart>
		  	</div>
		  :
		  	<div className="teaminfo-loading">
	        <div className="teaminfo-ring">
	          <Roller />
	        </div>
        </div>
		  }
  	</div>
  )
}

export default TeamInfo