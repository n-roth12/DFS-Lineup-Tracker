import { LineChart, Line, XAxis, Tooltip, CartesianGrid, YAxis, ResponsiveContainer, Label } from 'recharts'
import './PointsGraph.css'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'

const PointsGraph = ({ graphData, year }) => {

	const CustomToolTip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className="custom-tooltip">
					<span>
						<p>{parseFloat(payload[0].payload.points).toFixed(2)} PTS</p>
						{Math.abs(payload[0].payload.points_change) > 0 &&
							<p>{payload[0].payload.points_change > 0 ? 
								<FaArrowUp style={{color:'green'}}/> 
							: 
								<FaArrowDown style={{color:'red'}}/>
							}
							{parseFloat(Math.abs(payload[0].payload.points_change)).toFixed(2)} PTS</p>
						}
					</span>
				</div>
			)
		}
		return null
	}

  return (
    <div className="graph-wrapper">
    	<div className="points-graph">
				<h1 className="graph-label">{year} Points (Average Per Lineup):</h1>
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
{/*		        	<Label angle={270} position={'left'} style={{ textAnchor: 'middle' }}>
		        		Fantasy Points Scored
		        	</Label>*/}
		        </YAxis>
		        <Line 
		        	dataKey="points" 
		        	stroke="#202033" 
		        	strokeWidth="2" 
		        	dot={{fill:"#202033",stroke:"#202033",r:2}} 
		        	activeDot={{fill:"#202033",stroke:"#202033",r:4}} 
		        />
		        <Tooltip content={<CustomToolTip />}/>
		  		</LineChart>
		  	</ResponsiveContainer>
		  </div>
  	</div>
  )
}

export default PointsGraph