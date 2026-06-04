import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { format, parseISO } from 'date-fns';

export default function StepsChart({ data }) {
  const svgRef = useRef();
  const wrapperRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;
    
    // Setup D3 margins
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = wrapperRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Clear previous renders
    d3.select(svgRef.current).selectAll('*').remove();
    d3.select(wrapperRef.current).selectAll('.d3-tooltip').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X axis (steps)
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.steps) || 10000])
      .range([0, width]);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5))
      .attr('color', '#9ca3af');

    // Y axis (dates)
    const y = d3.scaleBand()
      .range([height, 0]) // Reverse to show latest at bottom or top depending on data sort
      .domain(data.map(d => d.date))
      .padding(.1);

    svg.append('g')
      .call(d3.axisLeft(y).tickFormat(d => format(parseISO(d), 'MMM dd')))
      .attr('color', '#9ca3af');

    // Tooltip
    const tooltip = d3.select(wrapperRef.current)
      .append('div')
      .style('opacity', 0)
      .attr('class', 'd3-tooltip absolute bg-gray-800 text-white p-2 rounded text-xs pointer-events-none z-10');

    // Bars
    svg.selectAll('myRect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', x(0))
      .attr('y', d => y(d.date))
      .attr('width', 0)
      .attr('height', y.bandwidth())
      .attr('fill', d => d.steps >= 8000 ? '#10b981' : d.steps >= 5000 ? '#fbbf24' : '#ef4444')
      .on('mouseover', (event, d) => {
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip.html(`Date: ${format(parseISO(d.date), 'MMM dd')}<br/>Steps: ${d.steps}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', () => {
        tooltip.transition().duration(500).style('opacity', 0);
      })
      .transition()
      .duration(800)
      .attr('width', d => x(d.steps));

    // Goal line
    svg.append('line')
      .attr('x1', x(8000))
      .attr('y1', 0)
      .attr('x2', x(8000))
      .attr('y2', height)
      .style('stroke-dasharray', '3, 3')
      .style('stroke', '#6b7280')
      .style('stroke-width', 2);

    return () => {
      d3.select(wrapperRef.current).selectAll('.d3-tooltip').remove();
    };
  }, [data]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative" ref={wrapperRef}>
      <h3 className="text-lg font-bold text-gray-800 mb-2">Steps Trend</h3>
      <svg ref={svgRef}></svg>
    </div>
  );
}
