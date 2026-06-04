import React, { useState, useEffect, useMemo, useRef } from 'react';
import { getAllUsers, getAllHealthLogs, updateUserProfile } from '../api/firestore';
import * as d3 from 'd3';
import { format, parseISO, subDays } from 'date-fns';
import MetricCard from '../components/MetricCard';
import { FiUsers, FiFileText, FiTarget, FiUserPlus, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedUser, setExpandedUser] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [u, l] = await Promise.all([getAllUsers(), getAllHealthLogs()]);
      setUsers(u);
      setLogs(l);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePromote = async (userId) => {
    if(window.confirm('Are you sure you want to promote this user to Admin?')) {
      await updateUserProfile(userId, { role: 'admin' });
      fetchData();
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // System Health Chart
  const svgRef = useRef();
  const wrapperRef = useRef();

  useEffect(() => {
    if (logs.length === 0 || !wrapperRef.current) return;
    
    // Group logs by date
    const counts = {};
    logs.forEach(l => {
      counts[l.date] = (counts[l.date] || 0) + 1;
    });

    // Create array of last 30 days
    const data = [];
    for(let i=29; i>=0; i--) {
      const d = format(subDays(new Date(), i), 'yyyy-MM-dd');
      data.push({ date: d, count: counts[d] || 0, parsedDate: parseISO(d) });
    }

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = wrapperRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.parsedDate))
      .range([0, width]);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat('%b %d')))
      .attr('color', '#9ca3af');

    const y = d3.scaleLinear()
      .domain([0, Math.max(d3.max(data, d => d.count) + 5, 10)])
      .range([height, 0]);

    svg.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .attr('color', '#9ca3af');

    const line = d3.line()
      .x(d => x(d.parsedDate))
      .y(d => y(d.count))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#8b5cf6')
      .attr('stroke-width', 3)
      .attr('d', line);
      
    // Dots
    svg.selectAll('myCircles')
      .data(data)
      .enter()
      .append('circle')
      .attr('fill', '#8b5cf6')
      .attr('cx', d => x(d.parsedDate))
      .attr('cy', d => y(d.count))
      .attr('r', 4);

  }, [logs]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Admin Dashboard...</div>;

  const newUsersCount = users.filter(u => u.createdAt && (new Date() - parseISO(u.createdAt)) / (1000 * 60 * 60 * 24) <= 7).length;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Total Users" value={users.length} icon={<FiUsers />} />
        <MetricCard title="Total Logs" value={logs.length} icon={<FiFileText />} />
        <MetricCard title="New Users (7d)" value={newUsersCount} icon={<FiUserPlus />} />
        <MetricCard title="System Health" value="Active" icon={<FiTarget />} />
      </div>

      {/* System Health Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8" ref={wrapperRef}>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Platform Usage (Logs per Day)</h2>
        <svg ref={svgRef}></svg>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4 sm:mb-0">User Management</h2>
          <input 
            type="text" 
            placeholder="Search users..." 
            className="p-2 border rounded focus:ring-2 focus:ring-purple-500 w-full sm:w-64"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm">
                <th className="p-4 border-b">User</th>
                <th className="p-4 border-b">Role</th>
                <th className="p-4 border-b">Joined</th>
                <th className="p-4 border-b text-center">Logs</th>
                <th className="p-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => {
                const userLogs = logs.filter(l => l.userId === u.id);
                const isExpanded = expandedUser === u.id;
                return (
                  <React.Fragment key={u.id}>
                    <tr className="hover:bg-gray-50 border-b">
                      <td className="p-4">
                        <div className="font-medium text-gray-800">{u.displayName || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{u.email}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                          {u.role || 'user'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{u.createdAt ? format(parseISO(u.createdAt), 'MMM dd, yyyy') : 'N/A'}</td>
                      <td className="p-4 text-center font-bold">{userLogs.length}</td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center space-x-4 items-center">
                          <button onClick={() => setExpandedUser(isExpanded ? null : u.id)} className="text-blue-500 hover:text-blue-700 flex items-center text-sm font-medium">
                            {isExpanded ? <FiChevronUp className="mr-1" /> : <FiChevronDown className="mr-1" />} Logs
                          </button>
                          {u.role !== 'admin' && (
                            <button onClick={() => handlePromote(u.id)} className="text-purple-500 hover:text-purple-700 font-medium text-sm">
                              Promote
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-gray-50 border-b">
                        <td colSpan="5" className="p-4">
                          <div className="bg-white rounded border p-4 shadow-inner">
                            <h4 className="font-bold mb-2 text-gray-700">Recent Logs</h4>
                            {userLogs.length === 0 ? <p className="text-sm text-gray-500">No logs found for this user.</p> : (
                              <ul className="text-sm space-y-2">
                                {userLogs.slice(0, 5).map(l => (
                                  <li key={l.id} className="flex flex-wrap gap-4 text-gray-600">
                                    <span className="font-medium text-gray-800 w-24">{l.date}</span>
                                    <span className="w-24">{l.steps || 0} steps</span>
                                    <span className="w-24">{l.sleepHours || 0} hrs sleep</span>
                                    <span>{l.heartRate || 0} bpm</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
