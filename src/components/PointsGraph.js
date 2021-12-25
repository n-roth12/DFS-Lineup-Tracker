import { LineChart, Line, XAxis, Tooltip, CartesianGrid, YAxis } from 'recharts'

const PointsGraph = ({ graphData }) => {
  return (
    <div>
			<h1>Bankroll Progress</h1>
			<div className="linechart-wrapper">
	      <LineChart
	        width={500}
	        height={300}
	        data={graphData}
	        margin={{
	          top: 20,
	          right: 30,
	          left: 0,
	          bottom: 10,
	        }}>
	        <CartesianGrid  horizontal="true" vertical="" stroke="#202033"/>
	        <XAxis dataKey="week" tick={{fill:"#000000"}}/>
	        <YAxis tick={{fill:"#000000"}} />
	        <Line type="monotone" dataKey="points" stroke="#202033" strokeWidth="2" dot={{fill:"#202033",stroke:"#202033",strokeWidth: 2,r:2}} activeDot={{fill:"#2e4355",stroke:"#8884d8",strokeWidth: 5,r:10}} />
	  		</LineChart>
  		</div>
  	</div>
  )
}

export default PointsGraph