import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { format, parseISO } from 'date-fns';

export default function SleepChart({ data }) {
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

    const parsedData = data.map(d => ({ ...d, parsedDate: parseISO(d.date) })).sort((a,b) => a.parsedDate - b.parsedDate);

    // X axis (dates)
    const x = d3.scaleTime()
      .domain(d3.extent(parsedData, d => d.parsedDate))
      .range([0, width]);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat('%b %d')))
      .attr('color', '#9ca3af');

    // Y axis (Hours)
    const y = d3.scaleLinear()
      .domain([0, Math.max(d3.max(parsedData, d => d.sleepHours) + 2, 12)])
      .range([height, 0]);

    svg.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .attr('color', '#9ca3af');

    const tooltip = d3.select(wrapperRef.current)
      .append('div')
      .style('opacity', 0)
      .attr('class', 'd3-tooltip absolute bg-gray-800 text-white p-2 rounded text-xs pointer-events-none z-10');

    // Goal line
    svg.append('line')
      .attr('x1', 0).attr('y1', y(8)).attr('x2', width).attr('y2', y(8))
      .style('stroke-dasharray', '3, 3').style('stroke', '#818cf8');

    // Lollipop Sticks (Lines)
    svg.selectAll('myLines')
      .data(parsedData)
      .enter()
      .append('line')
      .attr('x1', d => x(d.parsedDate))
      .attr('x2', d => x(d.parsedDate))
      .attr('y1', height)
      .attr('y2', height)
      .attr('stroke', d => d.sleepHours < 7 ? '#fca5a5' : '#a5b4fc')
      .attr('stroke-width', 3)
      .transition()
      .duration(800)
      .attr('y2', d => y(d.sleepHours));

    // Dots
    svg.selectAll('myCircles')
      .data(parsedData)
      .enter()
      .append('circle')
      .attr('fill', d => d.sleepHours < 7 ? '#ef4444' : '#6366f1')
      .attr('stroke', '#fff')
      .attr('cx', d => x(d.parsedDate))
      .attr('cy', height)
      .attr('r', 6)
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget).transition().duration(200).attr('r', 9);
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip.html(`Date: ${format(d.parsedDate, 'MMM dd')}<br/>Sleep: ${d.sleepHours} hrs`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget).transition().duration(200).attr('r', 6);
        tooltip.transition().duration(500).style('opacity', 0);
      })
      .transition()
      .duration(800)
      .attr('cy', d => y(d.sleepHours));

    return () => {
      d3.select(wrapperRef.current).selectAll('.d3-tooltip').remove();
    };
  }, [data]);

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 relative transition-colors" ref={wrapperRef}>
      <h3 className="text-lg font-bold text-gray-800 dark:text-slate-200 mb-2">Sleep Trend</h3>
      <svg ref={svgRef} className="text-slate-500 dark:text-slate-400"></svg>
    </div>
  );
}
