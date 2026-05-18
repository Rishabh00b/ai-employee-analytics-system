import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Briefcase, Award, Star, Edit } from 'lucide-react';
import api from '../services/api';

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const { data } = await api.get(`/employees/${id}`);
        setEmployee(data);
      } catch (error) {
        console.error('Error fetching employee details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  const generateFeedback = async () => {
    try {
      setLoadingAi(true);
      const { data } = await api.post('/ai/recommend', {
        employeeId: id,
        type: 'feedback'
      });
      setAiFeedback(data);
    } catch (error) {
      console.error('Error generating AI feedback', error);
    } finally {
      setLoadingAi(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading Employee Details...</div>;
  if (!employee) return <div className="text-center py-10 text-red-400">Employee not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/employees" className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-white">Employee Profile</h1>
        </div>
        <Link
          to={`/employees/edit/${employee._id}`}
          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Edit size={18} />
          Edit
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Basic Info Card */}
        <div className="glass-card p-6 rounded-xl md:col-span-1 flex flex-col items-center text-center">
          <div className="h-24 w-24 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-4xl font-bold mb-4">
            {employee.name.charAt(0)}
          </div>
          <h2 className="text-xl font-bold text-white">{employee.name}</h2>
          <p className="text-slate-400">{employee.email}</p>
          <span className="mt-3 px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm font-medium">
            {employee.department}
          </span>
        </div>

        {/* Details Card */}
        <div className="glass-card p-6 rounded-xl md:col-span-2 space-y-6">
          <h3 className="text-lg font-medium text-white border-b border-slate-700 pb-2">Professional Details</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Briefcase className="text-blue-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-slate-400">Experience</p>
                <p className="font-medium text-white">{employee.experience} Years</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Star className="text-yellow-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-slate-400">Performance Score</p>
                <p className="font-medium text-white">{employee.performanceScore}/100</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2 text-slate-400 text-sm">
              <Award size={18} />
              <span>Skills</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {employee.skills.map((skill, idx) => (
                <span key={idx} className="bg-blue-900/30 text-blue-300 border border-blue-800/50 px-3 py-1 rounded-md text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Feedback Section */}
      <div className="glass-card p-6 rounded-xl border border-blue-900/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Award size={100} className="text-blue-500" />
        </div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-white flex items-center gap-2">
            AI Performance Feedback
          </h3>
          <button
            onClick={generateFeedback}
            disabled={loadingAi}
            className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {loadingAi ? 'Generating...' : 'Generate AI Feedback'}
          </button>
        </div>

        {aiFeedback ? (
          <div className="space-y-4 relative z-10">
            {aiFeedback.error ? (
              <p className="text-red-400">{aiFeedback.error}</p>
            ) : (
              <>
                <div className="bg-emerald-900/20 border border-emerald-800/30 p-4 rounded-lg">
                  <h4 className="text-emerald-400 font-medium mb-2">Strengths</h4>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    {aiFeedback.strengths?.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div className="bg-amber-900/20 border border-amber-800/30 p-4 rounded-lg">
                  <h4 className="text-amber-400 font-medium mb-2">Areas for Improvement</h4>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    {aiFeedback.improvements?.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <h4 className="text-blue-400 font-medium mb-2">Summary</h4>
                  <p className="text-slate-300">{aiFeedback.summary}</p>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            Click "Generate AI Feedback" to get an automated analysis of {employee.name}'s performance and skills.
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetails;
