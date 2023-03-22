import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, Tooltip, CartesianGrid, YAxis, ResponsiveContainer, Label } from 'recharts'
import './PointsGraph.css'

const PointsGraph = ({ graphData }) => {

  const [data, setData] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    var result = []
    var count = 0
    console.log(new Date(graphData[0]["startTime"]) - new Date(graphData[10]["startTime"]))
    graphData.sort((a, b) => new Date(a["startTime"]) - new Date(b["startTime"])).map((lineup) => {
      count += 1
      result.push({ "date": new Date(lineup["startTime"]).toLocaleDateString(), "proj" : parseInt(lineup["projectedPoints"]) })
    })
    setData(result)
  }



  // const CustomToolTip = ({ active, payload, label }) => {
  //   if (active && payload && payload.length) {
  //     const week = payload[0].payload.week.split('/')[1]
  //     const year = payload[0].payload.week.split('/')[0]
  //     return (
  //       <div className="custom-tooltip">
  //         <h3>Week {week}, {year}</h3>
  //         <span>
  //           <p>{parseFloat(payload[0].payload.points).toFixed(2)} PTS</p>
  //           {Math.abs(payload[0].payload.points_change) > 0 &&
  //             <p>{payload[0].payload.points_change > 0 ?
  //               <FaArrowUp style={{ color: 'green' }} />
  //               :
  //               <FaArrowDown style={{ color: 'red' }} />
  //             }
  //               {parseFloat(Math.abs(payload[0].payload.points_change)).toFixed(2)} PTS</p>
  //           }
  //         </span>
  //       </div>
  //     )
  //   }
  //   return null
  // }

  return (
    <div className="graph-wrapper">
      <div className="points-graph">
        <ResponsiveContainer width={1100} aspect={3}>
          <LineChart
            width={400}
            height={500}
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 10,
            }}>
            {/* <CartesianGrid strokeDasharray="3 3" stroke="#ccc" vertical={false} /> */}
            <XAxis width={"150%"} dataKey="date" tickLine={false} tick={{ fill: "#000000", fontSize: 11 }} minTickGap={30} />
            <YAxis tick={{ fill: "#000000", fontSize: 11 }} orientation={"right"}/>
            <div><p>hello</p></div>
            <Line
              dataKey="proj"
              stroke="#202033"
              strokeWidth="1.5"
              dot={{ fill: "#ffffff", stroke: "#202033", r: 1 }}
              activeDot={{ fill: "#202033", stroke: "#202033", r: 4 }}
            />
            {/* <Tooltip content={<CustomToolTip />} /> */}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default PointsGraph