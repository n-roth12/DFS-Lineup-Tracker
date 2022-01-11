import { LineChart, Line, XAxis, Tooltip, CartesianGrid, YAxis, ResponsiveContainer, Label } from 'recharts'

const PointsGraph = ({ graphData }) => {
  return (
    <div className="graph-wrapper col-12 col-md-6">
    	<div className="graph">
				<h1>Points</h1>
				<ResponsiveContainer aspect={1.5}>
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
		        <CartesianGrid strokeDasharray="5 5" stroke="#ccc"/>
		        <XAxis dataKey="week" tick={{fill:"#000000"}}/>
		        <YAxis tick={{fill:"#000000"}}>
		        	<Label angle={270} position={'left'} style={{ textAnchor: 'middle' }}>
		        		Fantasy Points Scored
		        	</Label>
		        </YAxis>
		        <Line dataKey="points" stroke="#202033" strokeWidth="2" dot={{fill:"#202033",stroke:"#202033",r:2}} activeDot={{fill:"#202033",stroke:"#202033",r:4}} />
		        <Tooltip/>
		  		</LineChart>
		  	</ResponsiveContainer>
		  </div>
  	</div>
  )
}

export default PointsGraph