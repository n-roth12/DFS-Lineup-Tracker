import { LineChart, Line, XAxis, Tooltip, CartesianGrid, YAxis, ResponsiveContainer, Label } from 'recharts'
import './PointsGraph.css'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'

const PointsGraph = ({ graphData, year, setGraphView }) => {

	const CustomToolTip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			const week = payload[0].payload.week.split('/')[1]
			const year = payload[0].payload.week.split('/')[0]
			return (
				<div className="custom-tooltip">
					<h3>Week {week}, {year}</h3>
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
				<div className="graph-btn-wrapper">
					<button 
						className={`graph-btn`} 
						onClick={() => setGraphView('bankroll')}>Bankroll
					</button>
					<button 
						className={`graph-btn-active`} 
						onClick={() => setGraphView('points')}>Points
					</button>
				</div>
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
		        <XAxis dataKey="week" tick={{fill:"#000000"}} minTickGap={30} />
		        <YAxis tick={{fill:"#000000"}}>
		        	<Label angle={270} position={'left'} style={{ textAnchor: 'middle' }}>
		        		Average Lineup Points
		        	</Label>
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