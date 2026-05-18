import { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
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
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

const Analytics = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/employees');
        setEmployees(data);
      } catch (err) {
        console.error('Failed to fetch analytics data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Process data for Department Average Performance
  const deptAvgPerf = employees.reduce((acc, emp) => {
    const existing = acc.find(item => item.name === emp.department);
    if (existing) {
      existing.totalScore += emp.performanceScore;
      existing.count += 1;
      existing.avgScore = Math.round(existing.totalScore / existing.count);
    } else {
      acc.push({ name: emp.department, totalScore: emp.performanceScore, count: 1, avgScore: emp.performanceScore });
    }
    return acc;
  }, []);

  // Process data for Experience vs Performance
  const expVsPerf = [...employees].sort((a, b) => a.experience - b.experience).map(emp => ({
    name: emp.name,
    experience: emp.experience,
    performance: emp.performanceScore
  }));

  // Process data for Score Distribution
  const scoreDist = [
    { name: '90-100', value: employees.filter(e => e.performanceScore >= 90).length },
    { name: '80-89', value: employees.filter(e => e.performanceScore >= 80 && e.performanceScore < 90).length },
    { name: '70-79', value: employees.filter(e => e.performanceScore >= 70 && e.performanceScore < 80).length },
    { name: 'Below 70', value: employees.filter(e => e.performanceScore < 70).length }
  ].filter(item => item.value > 0);

  if (loading) return <div className="text-center py-10">Loading Analytics...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <BarChart3 className="text-blue-500" />
          Analytics Dashboard
        </h1>
        <p className="text-slate-400 mt-1">Deep dive into organizational performance metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Average Performance */}
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-lg font-medium text-white mb-6">Department Avg. Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptAvgPerf} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#94a3b8" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                />
                <Bar dataKey="avgScore" fill="#10b981" radius={[0, 4, 4, 0]}>
                  {deptAvgPerf.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Score Distribution */}
        <div className="glass-card p-6 rounded-xl flex flex-col">
          <h3 className="text-lg font-medium text-white mb-6">Score Distribution</h3>
          <div className="h-80 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreDist}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {scoreDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Experience vs Performance Trend */}
        <div className="glass-card p-6 rounded-xl lg:col-span-2">
          <h3 className="text-lg font-medium text-white mb-6">Experience vs Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={expVsPerf} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="experience" 
                  stroke="#94a3b8" 
                  label={{ value: 'Years of Experience', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} 
                />
                <YAxis 
                  stroke="#94a3b8" 
                  domain={[0, 100]} 
                  label={{ value: 'Performance Score', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  labelFormatter={(val) => `Experience: ${val} Yrs`}
                />
                <Legend verticalAlign="top" height={36}/>
                <Line type="monotone" dataKey="performance" stroke="#3b82f6" activeDot={{ r: 8 }} name="Performance" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
