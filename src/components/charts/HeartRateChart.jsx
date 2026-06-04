import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { format, parseISO } from 'date-fns';

export default function HeartRateChart({ data }) {
  const svgRef = useRef();
  const wrapperRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;
    
    // Setup D3
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = wrapperRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();
    d3.select(wrapperRef.current).selectAll('.d3-tooltip').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Parse dates
    const parsedData = data.map(d => ({ ...d, parsedDate: parseISO(d.date) })).sort((a,b) => a.parsedDate - b.parsedDate);

    // X axis (dates)
    const x = d3.scaleTime()
      .domain(d3.extent(parsedData, d => d.parsedDate))
      .range([0, width]);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat('%b %d')))
      .attr('color', '#9ca3af');

    // Y axis (BPM)
    const y = d3.scaleLinear()
      .domain([0, Math.max(d3.max(parsedData, d => d.heartRate) + 20, 140)])
      .range([height, 0]);

    svg.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .attr('color', '#9ca3af');

    // Tooltip
    const tooltip = d3.select(wrapperRef.current)
      .append('div')
      .style('opacity', 0)
      .attr('class', 'd3-tooltip absolute bg-gray-800 text-white p-2 rounded text-xs pointer-events-none z-10');

    // Add normal range area
    svg.append('rect')
      .attr('x', 0)
      .attr('y', y(100))
      .attr('width', width)
      .attr('height', y(60) - y(100))
      .attr('fill', '#d1fae5')
      .attr('opacity', 0.5);

    // Add lines for normal range
    svg.append('line')
      .attr('x1', 0).attr('y1', y(100)).attr('x2', width).attr('y2', y(100))
      .style('stroke-dasharray', '3, 3').style('stroke', '#34d399');
      
    svg.append('line')
      .attr('x1', 0).attr('y1', y(60)).attr('x2', width).attr('y2', y(60))
      .style('stroke-dasharray', '3, 3').style('stroke', '#34d399');

    // Line generator
    const line = d3.line()
      .x(d => x(d.parsedDate))
      .y(d => y(d.heartRate))
      .curve(d3.curveMonotoneX);

    // Add path
    const path = svg.append('path')
      .datum(parsedData)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Path animation
    const totalLength = path.node().getTotalLength();
    path.attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1500)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

    // Dots
    svg.selectAll('myCircles')
      .data(parsedData)
      .enter()
      .append('circle')
      .attr('fill', d => d.heartRate > 100 ? '#ef4444' : d.heartRate < 60 ? '#3b82f6' : '#10b981')
      .attr('stroke', '#fff')
      .attr('cx', d => x(d.parsedDate))
      .attr('cy', d => y(d.heartRate))
      .attr('r', 0)
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget).transition().duration(200).attr('r', 8);
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip.html(`Date: ${format(d.parsedDate, 'MMM dd')}<br/>BPM: ${d.heartRate}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget).transition().duration(200).attr('r', 5);
        tooltip.transition().duration(500).style('opacity', 0);
      })
      .transition()
      .delay(1000)
      .duration(500)
      .attr('r', 5);

    return () => {
      d3.select(wrapperRef.current).selectAll('.d3-tooltip').remove();
    };
  }, [data]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative" ref={wrapperRef}>
      <h3 className="text-lg font-bold text-gray-800 mb-2">Heart Rate Trend</h3>
      <svg ref={svgRef}></svg>
    </div>
  );
}
