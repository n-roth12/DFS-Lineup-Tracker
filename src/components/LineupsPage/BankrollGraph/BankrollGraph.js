import { LineChart, Line, XAxis, Tooltip, CartesianGrid, YAxis, ResponsiveContainer, Label } from 'recharts'
import './BankrollGraph.css'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'

const BankrollGraph = ({ graphData }) => {

	const CustomToolTip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className="custom-tooltip">
					<h3>{payload[0].payload.week}: </h3>
					<span>
						<p>{payload[0].payload.bankroll < 0 && '-'}${parseFloat(Math.abs(payload[0].payload.bankroll)).toFixed(2)}</p>
						{payload[0].payload.bankroll_change &&
							<p>{payload[0].payload.bankroll_change > 0 ? <FaArrowUp style={{color:'green'}}/> : <FaArrowDown style={{color:'red'}}/>}
									${parseFloat(Math.abs(payload[0].payload.bankroll_change)).toFixed(2)}</p>
						}
					</span>
				</div>
			)
		}
		return null
	}

  return (
		<div className="graph-wrapper">
			<div className="bankroll-graph">
				<h1 className="graph-label">Cumulative Return:</h1>
				<ResponsiveContainer aspect={3}>
		      <LineChart
		        width={500}
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
		        		Cumulative Bankroll
		        	</Label>*/}
		        </YAxis>
		        <Line dataKey="bankroll" stroke="#202033" strokeWidth="2" dot={{fill:"#202033",stroke:"#202033", r:2}} activeDot={{fill:"#202033",stroke:"#202033", r:4}} />
		        <Tooltip content={<CustomToolTip />}/>
		  		</LineChart>
		  	</ResponsiveContainer>
		  </div>
  	</div>
  )
}

export default BankrollGraph