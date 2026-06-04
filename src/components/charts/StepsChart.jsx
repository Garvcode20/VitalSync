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

    // Parse dates and sort
    const parsedData = data.map(d => ({ ...d, parsedDate: parseISO(d.date) })).sort((a,b) => a.parsedDate - b.parsedDate);

    // X axis (dates)
    const x = d3.scaleBand()
      .range([0, width])
      .domain(parsedData.map(d => d.date))
      .padding(.2);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d => format(parseISO(d), 'MMM dd')))
      .attr('color', '#9ca3af');

    // Y axis (steps)
    const y = d3.scaleLinear()
      .domain([0, d3.max(parsedData, d => d.steps) * 1.2 || 10000])
      .range([height, 0]);

    svg.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .attr('color', '#9ca3af');

    // Tooltip
    const tooltip = d3.select(wrapperRef.current)
      .append('div')
      .style('opacity', 0)
      .attr('class', 'd3-tooltip absolute bg-gray-800 text-white p-2 rounded text-xs pointer-events-none z-10');

    // Goal line
    svg.append('line')
      .attr('x1', 0).attr('y1', y(8000)).attr('x2', width).attr('y2', y(8000))
      .style('stroke-dasharray', '3, 3').style('stroke', '#10b981');

    // Bars
    svg.selectAll('myRect')
      .data(parsedData)
      .enter()
      .append('rect')
      .attr('x', d => x(d.date))
      .attr('y', height)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('rx', 4) // Rounded tops
      .attr('fill', d => d.steps >= 8000 ? '#10b981' : d.steps >= 5000 ? '#fbbf24' : '#ef4444')
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget).attr('opacity', 0.8);
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip.html(`Date: ${format(d.parsedDate, 'MMM dd')}<br/>Steps: ${d.steps}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget).attr('opacity', 1);
        tooltip.transition().duration(500).style('opacity', 0);
      })
      .transition()
      .duration(800)
      .attr('y', d => y(d.steps))
      .attr('height', d => height - y(d.steps));

    return () => {
      d3.select(wrapperRef.current).selectAll('.d3-tooltip').remove();
    };
  }, [data]);

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 relative transition-colors" ref={wrapperRef}>
      <h3 className="text-lg font-bold text-gray-800 dark:text-slate-200 mb-2">Steps Trend</h3>
      <svg ref={svgRef} className="text-slate-500 dark:text-slate-400"></svg>
    </div>
  );
}
