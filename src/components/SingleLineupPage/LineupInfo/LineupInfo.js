import './LineupInfo.css'
import { useState, useEffect } from 'react'
import { BarChart, Bar, LabelList, XAxis, Tooltip, CartesianGrid, YAxis, ResponsiveContainer, Label } from 'recharts'

const LineupInfo = ({ lineupInfo }) => {


	const processInfo = (info) => {
		var result = []
		var totalPoints = 0
		for (const position in info) {
			result.push({ "position": position, "points":  parseFloat(info[position].toFixed(2))})
			totalPoints += info[position]
		}
		result.forEach((item) => {
			item["percentage"] = parseFloat(((item["points"] / totalPoints) * 100).toFixed(2))
		})
		return result
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
    <div className="lineup-information">
    	<div className="lineup-information-inner">
    		<BarChart data={processInfo(lineupInfo)} width={500} height={250} layout="vertical">
    			<XAxis type="number" hide />
    			<YAxis type="category" dataKey="position" />
    			<Bar dataKey="points" fill="#8884d8" >
    				<LabelList dataKey="points" content={renderCustomizedLabel} style={{ fill: "white" }}/>
    			</Bar>
    		</BarChart>
    	</div>
    </div>
  )
}

export default LineupInfo