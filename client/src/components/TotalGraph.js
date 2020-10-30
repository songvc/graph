import React from 'react';
import { scaleBand, scaleLinear } from 'd3';

const Xaxis = (props) => {
  const { height, width, domain, range, margin } = props;
  const xScale = scaleLinear()
    .domain([0, domain.length - 1])
    .range(range)

  const ticks = xScale
    .ticks(domain.length - 1)
    .map(value => ({
      value: domain[value],
      xOffset: xScale(value)
    }))

  return (
    <svg>
      <path
        d={`M ${margin.left} ${height - margin.bottom} H ${width - margin.right}`}
        stroke="black"
      />
      {ticks.map(({ value, xOffset }, i) => (
        <g
          key={value}
          transform={`translate(${xOffset}, 0)`}
        >
        </g>
      ))}
    </svg>)
}
const Yaxis = (props) => {
  const { height, domain, range, margin } = props;
  const yScale = scaleLinear()
    .domain(domain)
    .range([range[1], range[0]])
    .nice()

  const ticks = yScale
    .ticks(8)
    .map(value => ({
      value: (value / 1000000) + 'M',
      yOffset: yScale(value)
    }))

  return (
    <svg>
      <path
        d={`M ${margin.left} ${margin.top} V ${height - margin.top}`}
        stroke="black"
      />
      {ticks.map(({ value, yOffset }) => (
        <g
          key={value}
          transform={`translate(0, ${height - yOffset})`}
        >
          <line
            x1={margin.left}
            x2={margin.left - 5}
            stroke="black"
          />
          <text
            key={value}
            style={{
              fontSize: "10px",
              textAnchor: "left",
              transform: `translate(0px, px)`
            }}>
            {value}
          </text>
        </g>
      ))}
    </svg>
  )
}


const TotalGraph = (props) => {
  const { data, width, height, currentFilter, margins } = props;
  const margin = { top: margins, right: margins, left: margins, bottom: margins };

  const keys = Object.keys(data);
  const values = Object.values(data).map((obj) => obj['total']);
  const barData = keys.map((item, i) => {
    return { name: item, value: values[i] }
  });

  const xRange = [margin.left, width - margin.right]
  const yRange = [height - margin.bottom, margin.top]

  const xScale = scaleBand().range(xRange).domain(keys).padding(0.3);
  const yScale = scaleLinear().range(yRange).domain([0, Math.max(...values)]);

  const XAxisProps = {
    width: width,
    height: height,
    domain: keys,
    range: xRange,
    margin: margin
  }

  const YAxisProps = {
    width: width,
    height: height,
    domain: [0, Math.max(...values)],
    range: yRange,
    margin: margin
  }

  return (
    <svg
      width={width}
      height={height}
      style={{ border: '1px solid black' }}
    >
      <Xaxis {...XAxisProps} />
      <Yaxis {...YAxisProps} />
      {barData && barData.map((d, i) => {
        const { name, value } = d;
        let yValue = yScale(value);
        let xValue = xScale(name);

        let barHeight = yRange[0] - yValue;

        return <g>
          <text
            x={xValue}
            y={yValue}
            style={{
              fontSize: "8px",
              textAnchor: "bottom",
              transform: `translate(0px, 0px)`
            }}>{name}</text>
          <rect
            key={i}
            width={xScale.bandwidth()}
            height={barHeight}
            x={xValue}
            y={yValue}
            stroke="gray"
            fill={(d.name === currentFilter ? 'red' : 'gray')}>
          </rect>
        </g>
      })}
    </svg>
  );
}

export default TotalGraph;

