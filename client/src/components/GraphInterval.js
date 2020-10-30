import React, { useState } from 'react';
import { scaleLinear, scaleTime, extent } from 'd3';
import { line, area, curveCatmullRom } from 'd3-shape';
import { parserMap, formatMap } from '../utils/utils';

const Xaxis = (props) => {
  const { height, width, domain, range, margin } = props;

  const xScale = scaleTime()
    .domain(extent(domain))
    .range(range)
    .nice()

  const ticks = xScale.ticks(domain.length - 1)
    .map((value, i) => {
      if (i % 31 === 0) {
        return {
          value: formatMap['month'](value),
          xOffset: xScale(value)
        }
      } else {
        return undefined
      }
    })
    .filter(Boolean)

  return (
    <svg>
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
                fontSize: "8px",
                textAnchor: "middle",
                transform: `translate(0, ${height - margin.bottom + 15}px)`
              }}>
              {value}
            </text>
          </g>
        ))}
      </g>
    </svg>)
}

const Brush = (props) => {
  const { width, height, domain, range, margin, setStart, setEnd } = props;

  const xScale = scaleTime().domain(domain).range(range);
  const [selection, setSelection] = useState({ x: null, y: margin.top, w: null, h: height - margin.top - margin.bottom });
  const [move, setMove] = useState(null);

  const handleonPointerMove = (e) => {

    if (move) {
      const { sx } = move;

      let bounds = e.target.getBoundingClientRect();
      let cx = e.clientX - bounds.left;
      // let cy = e.clientY - bounds.top;

      let x0 = Math.max(Math.min(sx, cx), margin.left)
      let x1 = Math.min(Math.max(sx, cx), width - margin.right);
      // support 2d selection
      // let y0 = Math.max(Math.min(sy, cy), margin.top)
      // let y1 = Math.min(Math.max(sy, cy), height - margin.bottom);

      const [x, y, w, h] = [x0, margin.top, x1 - x0, height - margin.bottom - margin.top];

      setSelection({ x: x, y: y, w: w, h: h });
      setStart(xScale.invert(x));
      setEnd(xScale.invert(x + w));

    }
  }

  const handleonPointerMove2 = (e) => {
    if (move) {

      let bounds = e.target.parentNode.getBoundingClientRect();
      let cx = e.clientX - bounds.left;
      // let cy = e.clientY - bounds.top;

      let x0 = (cx < margin.left) ? margin.left : (cx > width - margin.right - selection.w) ? width - margin.right - selection.w : cx;
      const [x, y, w, h] = [x0, selection.y, selection.w, selection.h];

      setSelection({ x: x, y: y, w: w, h: h });
      setStart(xScale.invert(x));
      setEnd(xScale.invert(x + w));
    }
  }

  const handlePointerDown = (e) => {
    e.target.setPointerCapture(e.pointerId)
    let bounds = e.target.getBoundingClientRect();
    let x = e.clientX - bounds.left;
    let y = e.clientY - bounds.top;
    setMove({ sx: x, sy: y });
  }

  const handlePointerUp = (e) => {
    setMove(null)
  }


  return (
    <svg>

      <rect
        className='overlay'
        x={margin.left}
        y={margin.right}
        height={height - margin.top - margin.bottom}
        width={width - margin.left - margin.right}
        fill="gray"
        fillOpacity="0.2"
        pointerEvents="all"
        cursor="crosshair"
        onPointerMove={handleonPointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      />
      <rect
        className='selection'
        x={selection && selection.x}
        y={selection && selection.y}
        width={selection && selection.w}
        height={selection && selection.h}

        id={3}
        fill="red"
        fillOpacity="0.2"
        cursor="move"
        pointerEvents="all"
        onPointerMove={handleonPointerMove2}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      />
    </svg>)
}


const GraphInterval = (props) => {
  const { data, width, height, timeFilter, margins, start, end, setStart, setEnd, setZoom } = props;
  const margin = { top: margins, right: margins, left: margins, bottom: margins };

  const formatter = formatMap['day'];
  const parser = parserMap['day'];

  const scaledData = data.map((item) =>
    ({ ...item, trip_date: formatter(item.trip_date) }))
    .reduce((acc, item) => {
      const { trip_count, trip_date } = item;
      acc[trip_date] = (acc[trip_date] || 0) + trip_count;
      return acc
    }, {});

  const x = Object.keys(scaledData).map((data) => parser(data));
  const y = Object.values(scaledData);

  const graph = x.map((item, i) => ({ x: item, y: y[i] }))
  const xDomain = extent(x);
  const yDomain = [0, Math.max(...y)];
  const xRange = [margin.left, width - margin.right]
  const yRange = [height - margin.bottom, margin.top]

  let xScale = scaleTime().domain(xDomain).range(xRange)
  let yScale = scaleLinear().domain(yDomain).range(yRange)

  let lines = line(graph)
    .curve(curveCatmullRom)
    .x(d => xScale(d.x))
    .y(d => yScale(d.y))

  let areas = area(graph)
    .x(d => xScale(d.x))
    .y1(d => yScale(d.y))
    .y0(yScale(0));

  const handleWheel = (e) => {
    if (e.deltaY < 0) {
      setZoom((prev) => prev <= 8 ? 8 : prev + 1)
    }
    else if (e.deltaY > 0) {
      setZoom((prev) => prev <= 0 ? 0 : prev - 1)
    }
  }

  const XAxisProps = {
    width: width,
    height: height,
    domain: x,
    range: xRange,
    margin: margin,
    timeFilter: timeFilter
  }

  const BrushProps = {
    width: width,
    height: height,
    margin: margin,
    domain: xDomain,
    range: xRange,
    start: start,
    end: end,
    setStart: setStart,
    setEnd: setEnd
  }
  return (
    <svg
      width={width}
      height={height}
      style={{ border: '1px solid black' }}
      onWheel={(e) => handleWheel(e)}
    >
      <path
        d={`${lines(graph)}`}
        fill="none"
      >
      </path>
      <path
        d={`${areas(graph)}`}
        fill="gray">
      </path>
      <Xaxis {...XAxisProps} />
      <Brush {...BrushProps} />
    </svg>
  );
}

export default GraphInterval;

