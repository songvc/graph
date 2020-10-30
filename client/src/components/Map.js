import React, { useState, useEffect } from "react"
import { geoPath } from "d3-geo"
import * as topojson from "topojson-client"
import topology from '../topo/states-albers-10m.json'
import { stateMap } from '../utils/utils';

const USMap = (props) => {
  const { width, height, setFilterState, currentFilter, options } = props;
  const [geographies, setGeographies] = useState([])
  const [curr, setCurr] = useState(-1);
  const path = geoPath();
  const stateName = stateMap[currentFilter];

  useEffect(() => {
    setGeographies(topojson.feature(topology, topology.objects.states).features);
  }, [])

  const handleMouseEnter = (e, i) => {
    setCurr(i);
  }
  const handleMouseLeave = (d) => {
    setCurr(-1);
  }
  const handleClick = (d, i) => {
    const { properties } = d;
    const { name } = properties;
    const abbrevState = Object.keys(stateMap).find(key => stateMap[key] === name);
    const abbrevStateIndex = options.indexOf(abbrevState);
    setFilterState(abbrevStateIndex);
  }

  return (
    <svg width={width} height={height} viewBox={`0 0 975 610`}>
      <g className="outline">
        <path
          d={`${path(topojson.mesh(topology, topology.objects.states, (a, b) => a !== b))}`}
          fill="transparent"
          strokeWidth="0.5"
          stroke="black"
        >
        </path>
      </g>
      <g className="border" >
        <path
          d={`${path(topojson.feature(topology, topology.objects.nation))}`}
          fill="transparent"
          strokeWidth="0.5"
          stroke="black">
        </path>
      </g>
      <g className="countries">
        {
          geographies.map((d, i) => {
            const selectedName = d.properties.name;
            return <svg key={i}>
              <path
                onMouseEnter={(e) => handleMouseEnter(e, i)}
                onMouseLeave={() => handleMouseLeave(i)}
                onClick={() => handleClick(d, i)}
                d={path(d)}
                fill={(i === curr || selectedName === stateName) ? `red` : `rgba(38,50,56,${1 / geographies.length * i})`}
                stroke="#FFFFFF"
                strokeWidth={(i === curr) ? 1 : 0.5}
              />
            </svg>
          })
        }
      </g>
      <g className="markers">
        <rect
          x={0}
          y={0}
          fill='transparent'
          height={'50px'}
          width={'100px'}
        >
        </rect>
        <text x={(975 / 2) - 50} y={30} fontSize={"2em"}>{geographies[curr] ? geographies[curr].properties.name : ''}</text>
      </g>
    </svg>
  )
}

export default USMap
