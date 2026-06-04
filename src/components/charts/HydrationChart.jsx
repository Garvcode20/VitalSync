import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { format, parseISO } from 'date-fns';

export default function HydrationChart({ data }) {
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

    // We will make a Donut Chart showing how many days hit the goal (8+ glasses) vs missed
    const goal = 8;
    const hit = data.filter(d => d.hydrationGlasses >= goal).length;
    const miss = data.length - hit;
    
    const pieData = [
      { label: 'Hit Goal', value: hit, color: '#3b82f6' },
      { label: 'Missed Goal', value: miss, color: '#93c5fd' }
    ].filter(d => d.value > 0); // Remove empty slices

    const radius = Math.min(width, height) / 2;

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const pie = d3.pie()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(radius * 0.5) // This makes it a donut
      .outerRadius(radius * 0.8);

    const hoverArc = d3.arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.9);

    const tooltip = d3.select(wrapperRef.current)
      .append('div')
      .style('opacity', 0)
      .attr('class', 'd3-tooltip absolute bg-gray-800 text-white p-2 rounded text-xs pointer-events-none z-10');

    const arcs = g.selectAll('.arc')
      .data(pie(pieData))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => d.data.color)
      .attr('stroke', '#fff')
      .style('stroke-width', '2px')
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget).transition().duration(200).attr('d', hoverArc);
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip.html(`${d.data.label}<br/>${d.data.value} days (${Math.round((d.data.value / data.length) * 100)}%)`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget).transition().duration(200).attr('d', arc);
        tooltip.transition().duration(500).style('opacity', 0);
      });

    // Add labels if there's room
    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text(d => d.data.value > 0 ? d.data.value : '');

    // Add center text
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .attr('font-size', '12px')
      .attr('fill', '#6b7280')
      .text('Goal');
      
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .attr('font-size', '20px')
      .attr('font-weight', 'bold')
      .attr('fill', '#1f2937')
      .attr('class', 'dark:fill-white')
      .text(`${hit}/${data.length} days`);

    return () => {
      d3.select(wrapperRef.current).selectAll('.d3-tooltip').remove();
    };
  }, [data]);

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 relative transition-colors" ref={wrapperRef}>
      <h3 className="text-lg font-bold text-gray-800 dark:text-slate-200 mb-2">Hydration Goals Hit</h3>
      <svg ref={svgRef} className="text-slate-500 dark:text-slate-400"></svg>
    </div>
  );
}
