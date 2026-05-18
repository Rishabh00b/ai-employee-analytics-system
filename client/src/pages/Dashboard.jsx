import { useState, useEffect } from 'react';
import { Users, TrendingUp, Award, BrainCircuit } from 'lucide-react';
import api from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await api.get('/employees');
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const totalEmployees = employees.length;
  const avgPerformance = totalEmployees 
    ? Math.round(employees.reduce((acc, emp) => acc + emp.performanceScore, 0) / totalEmployees) 
    : 0;

  // Process data for Department Chart
  const deptData = employees.reduce((acc, emp) => {
    const existing = acc.find(item => item.name === emp.department);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: emp.department, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Top Performers
  const topPerformers = [...employees]
    .sort((a, b) => b.performanceScore - a.performanceScore)
    .slice(0, 5);

  if (loading) return <div className="text-center py-10">Loading Dashboard...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-slate-400 mt-1">Welcome to the HR AI Analytics System</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-xl border border-slate-700/50">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Employees</p>
              <h3 className="text-3xl font-bold text-white mt-1">{totalEmployees}</h3>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl border border-slate-700/50">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Avg Performance</p>
              <h3 className="text-3xl font-bold text-white mt-1">{avgPerformance}/100</h3>
            </div>
            <div className="p-3 bg-emerald-500/20 rounded-lg text-emerald-400">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl border border-slate-700/50">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Departments</p>
              <h3 className="text-3xl font-bold text-white mt-1">{deptData.length}</h3>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
              <Award size={24} />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl border border-slate-700/50 bg-gradient-to-br from-blue-900/40 to-purple-900/40 cursor-pointer hover:border-blue-500/50 transition-colors">
          <Link to="/ai-recommendation" className="block h-full">
            <div className="flex justify-between items-start h-full">
              <div className="flex flex-col justify-between h-full">
                <p className="text-blue-300 text-sm font-medium">Generate</p>
                <h3 className="text-xl font-bold text-white mt-1">AI Insights</h3>
              </div>
              <div className="p-3 bg-blue-500/30 rounded-lg text-blue-300 animate-pulse">
                <BrainCircuit size={24} />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performers */}
        <div className="glass-card rounded-xl p-6 lg:col-span-1">
          <h3 className="text-lg font-medium text-white mb-4">Top Performers</h3>
          <div className="space-y-4">
            {topPerformers.map((emp, index) => (
              <div key={emp._id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-500' : 
                    index === 1 ? 'bg-slate-300/20 text-slate-300' :
                    index === 2 ? 'bg-amber-700/20 text-amber-500' :
                    'bg-slate-700 text-slate-300'
                  }`}>
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">{emp.name}</p>
                    <p className="text-xs text-slate-400">{emp.department}</p>
                  </div>
                </div>
                <div className="font-bold text-emerald-400">{emp.performanceScore}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Dept Chart */}
        <div className="glass-card rounded-xl p-6 lg:col-span-2">
          <h3 className="text-lg font-medium text-white mb-4">Department Distribution</h3>
          <div className="h-[300px]">
            {deptData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                    itemStyle={{ color: '#3b82f6' }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                    {deptData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">No data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
