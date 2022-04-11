import { LineChart, Line, XAxis, Tooltip, CartesianGrid, YAxis, ResponsiveContainer, Label } from 'recharts'
import './BankrollGraph.css'

const BankrollGraph = ({ graphData }) => {
  return (
		<div className="graph-wrapper">
			<div className="bankroll-graph">
				<h1 className="graph-label">Cumulative Bankroll:</h1>
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
		        	<Label angle={270} position={'left'} style={{ textAnchor: 'middle' }}>
		        		Cumulative Bankroll
		        	</Label>
		        </YAxis>
		        <Line dataKey="bankroll" stroke="#202033" strokeWidth="2" dot={{fill:"#202033",stroke:"#202033", r:2}} activeDot={{fill:"#202033",stroke:"#202033", r:4}} />
		        <Tooltip />
		  		</LineChart>
		  	</ResponsiveContainer>
		  </div>
  	</div>
  )
}

export default BankrollGraph