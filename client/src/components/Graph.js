import React from 'react';
import { scaleLinear, scaleTime, extent } from 'd3';
import { parserMap, formatMap } from '../utils/utils';
import { line, area } from 'd3-shape';

const Xaxis = (props) => {
  const { height, width, domain, margin } = props;

  const xScale = scaleLinear()
    .domain([0, domain.length - 1])
    .range([margin.left, width - margin.right])
    .nice()

  const ticks = xScale.ticks(domain.length - 1)
    .map((value, i) => {
      const mod = Math.round((domain.length) / 10);
      if (i % mod === 0) {
        return {
          value: domain[value],
          xOffset: xScale(value)
        }
      } else {
        return undefined
      }
    }).filter(Boolean)

  return (
    <g>
      <path
        d={`M ${margin.left} ${height - margin.bottom} H ${width - margin.right}`}
        stroke="black"
      />
      {ticks.map(({ value, xOffset }, i) => (
        <g
          key={i}
          transform={`translate(${xOffset}, 0)`}
        >
          <line
            y1={height - margin.bottom}
            y2={height - margin.bottom + 5}
            stroke="currentColor"
          />
          <text
            key={value}
            style={{
              fontSize: "7px",
              textAnchor: "middle",
              transform: `translate(0, ${height - margin.bottom + 15}px)`
            }}>
            {value}
          </text>
        </g>
      ))}
    </g>)
}

const Yaxis = (props) => {
  const { height, domain, margin } = props;
  const yScale = scaleLinear()
    .domain(domain)
    .range([margin.top, height - margin.bottom])
    .nice()

  const ticks = yScale
    .ticks(6)
    .map(value => ({
      value: value / 1000 + 'K',
      yOffset: yScale(value)
    }))

  return (
    <g>
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
              transform: `translate(${margin.left}, ${margin.top}px)`
            }}>
            {value}
          </text>
        </g>
      ))}
    </g>
  )
}

const BarGraph = (props) => {
  const { data, height, width, timeFilter, margins, zoom, setZoom, start, end } = props;
  const margin = { top: margins, right: margins, left: margins, bottom: margins };

  const filteredData = data.filter((item) => (item.trip_date >= start && item.trip_date <= end));
  const viewportWidth = 500;
  const viewportHeight = 400;

  const formatter = formatMap['day'];
  const parser = parserMap['day'];

  const scaledData = filteredData.map((item) =>
    ({ ...item, trip_date: formatter(item.trip_date) }))
    .reduce((acc, item) => {
      const { trip_count, trip_date } = item;
      acc[trip_date] = (acc[trip_date] || 0) + trip_count;
      return acc
    }, {});

  const x = Object.keys(scaledData).map((data) => parser(data));
  const x2 = Object.keys(scaledData).map((data) => (data));
  const y = Object.values(scaledData);

  const graph = x.map((item, i) => ({ x: item, y: y[i] }))
  const xDomain = extent(x);
  const yDomain = [0, Math.max(...y)];
  const xRange = [margin.left, width - margin.right]
  const yRange = [height - margin.bottom, margin.top]
  let xScale = scaleTime().domain(xDomain).range(xRange)
  let yScale = scaleLinear().domain(yDomain).range(yRange).nice();
  let pixelStart = xScale(start);

  let lines = line(graph)
    .defined(d => !isNaN(d.y))
    .x(d => xScale(d.x))
    .y(d => yScale(d.y));

  let areas = area(graph)
    .x(d => xScale(d.x))
    .y1(d => yScale(d.y))
    .y0(yScale(0));

  const XAxisProps = {
    width: width,
    height: height,
    domain: x2,
    range: xRange,
    margin: margin,
    timeFilter: timeFilter,
    translate: '50px',
    zoom: zoom,
    setZoom: setZoom
  }

  const YAxisProps = {
    width: width,
    height: height,
    domain: yDomain,
    range: yRange,
    margin: margin
  }

  return (
    <svg
      width={viewportWidth}
      height={viewportHeight}
      style={{ border: '1px solid black' }}
    >
      <clipPath id='myClip'>
        <rect
          x={margin.left}
          y={margin.top}
          width={viewportWidth - margin.right - margin.left}
          height={viewportHeight - margin.top} />
      </clipPath>
      <g>
        <Yaxis {...YAxisProps} />
      </g>
      <g clipPath="url(#myClip)">
        <g transform={`translate(-${pixelStart}, 0)`}>
          <Xaxis {...XAxisProps} />
          <g>
            <path
              d={`${lines(graph)}`}
              stroke="black"
              strokeWidth="0.3"
              fill="none"
            >
            </path>
            <path
              d={`${areas(graph)}`}
              fill="gray"
            >
            </path>
          </g>
        </g>
      </g>
    </svg>
  );
}

export default BarGraph;

