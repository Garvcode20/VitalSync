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
      .attr('color', '#a098b0')
      .selectAll("text").style("font-family", "Space Grotesk");

    // Y axis (Hours)
    const y = d3.scaleLinear()
      .domain([0, Math.max(d3.max(parsedData, d => d.sleepHours) + 2, 12)])
      .range([height, 0]);

    svg.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .attr('color', '#a098b0')
      .selectAll("text").style("font-family", "Space Grotesk");

    const tooltip = d3.select(wrapperRef.current)
      .append('div')
      .style('opacity', 0)
      .attr('class', 'd3-tooltip absolute bg-surface-container-high border border-tertiary/30 text-on-surface p-2 rounded shadow-[0_0_10px_rgba(255,224,74,0.3)] text-xs font-label pointer-events-none z-10');

    // Goal line
    svg.append('line')
      .attr('x1', 0).attr('y1', y(8)).attr('x2', width).attr('y2', y(8))
      .style('stroke-dasharray', '3, 3').style('stroke', '#ffe04a').style('opacity', 0.5);

    // Lollipop Sticks (Lines)
    svg.selectAll('myLines')
      .data(parsedData)
      .enter()
      .append('line')
      .attr('x1', d => x(d.parsedDate))
      .attr('x2', d => x(d.parsedDate))
      .attr('y1', height)
      .attr('y2', height)
      .attr('stroke', d => d.sleepHours < 7 ? '#ff2d78' : 'rgba(255,224,74,0.5)')
      .attr('stroke-width', 3)
      .transition()
      .duration(800)
      .attr('y2', d => y(d.sleepHours));

    // Dots
    svg.selectAll('myCircles')
      .data(parsedData)
      .enter()
      .append('circle')
      .attr('fill', d => d.sleepHours < 7 ? '#ff2d78' : '#ffe04a')
      .attr('stroke', '#0f0f1a')
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
    <div className="glass-card p-6 rounded-2xl border-glow relative transition-colors group" ref={wrapperRef}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-headline font-bold text-on-surface flex items-center gap-2">
          <span className="w-2 h-2 bg-tertiary rounded-full shadow-[0_0_5px_#ffe04a]"></span>
          Sleep Trend
        </h3>
      </div>
      <svg ref={svgRef}></svg>
    </div>
  );
}
