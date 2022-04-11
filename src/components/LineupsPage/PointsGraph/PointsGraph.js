import { LineChart, Line, XAxis, Tooltip, CartesianGrid, YAxis, ResponsiveContainer, Label } from 'recharts'
import './PointsGraph.css'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'

const PointsGraph = ({ graphData }) => {

	const CustomToolTip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			console.log(payload)
			return (
				<div className="custom-tooltip">
					<p>{payload[0].payload.points} PTS</p>
					{payload[0].payload.change &&
						<p>{payload[0].payload.change > 0 && '+'}{payload[0].payload.change} PTS 
								{payload[0].payload.change > 0 ? <FaArrowUp style={{color:'green'}}/> : <FaArrowDown styl={{color:'red'}}/>}</p>
					}
				</div>
			)
		}
		return null
	}

  return (
    <div className="graph-wrapper">
    	<div className="points-graph">
				<h1 className="graph-label">Points (Average Per Lineup):</h1>
				<ResponsiveContainer aspect={3}>
		      <LineChart
		        width={400}
		        height={300}
		        data={graphData}
		        margin={{
		          top: 20,
		          right: 30,
		          left: 30,
		          bottom: 10,
		        }}>
		        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" vertical={false}/>
		        <XAxis dataKey="week" tick={{fill:"#000000"}}/>
		        <YAxis tick={{fill:"#000000"}}>
		        	<Label angle={270} position={'left'} style={{ textAnchor: 'middle' }}>
		        		Fantasy Points Scored
		        	</Label>
		        </YAxis>
		        <Line dataKey="points" stroke="#202033" strokeWidth="2" dot={{fill:"#202033",stroke:"#202033",r:2}} activeDot={{fill:"#202033",stroke:"#202033",r:4}} />
		        <Tooltip content={<CustomToolTip />}/>
		  		</LineChart>
		  	</ResponsiveContainer>
		  </div>
  	</div>
  )
}

export default PointsGraph