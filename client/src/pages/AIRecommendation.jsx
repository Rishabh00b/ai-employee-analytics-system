import { useState, useEffect } from 'react';
import { BrainCircuit, TrendingUp, BookOpen, Trophy } from 'lucide-react';
import api from '../services/api';

const AIRecommendation = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [recommendationType, setRecommendationType] = useState('promotion');
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data } = await api.get('/employees');
        setEmployees(data);
      } catch (err) {
        console.error('Failed to fetch employees', err);
      }
    };
    fetchEmployees();
  }, []);

  const handleGenerate = async () => {
    if (recommendationType !== 'ranking' && !selectedEmployeeId) {
      setError('Please select an employee.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setAiResult(null);

    try {
      const { data } = await api.post('/ai/recommend', {
        employeeId: recommendationType === 'ranking' ? null : selectedEmployeeId,
        type: recommendationType
      });
      setAiResult(data);
    } catch (err) {
      setError('Failed to generate AI recommendation.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <BrainCircuit className="text-blue-500" />
          AI Recommendations
        </h1>
        <p className="text-slate-400 mt-1">Leverage AI for promotions, training, and rankings</p>
      </div>

      <div className="glass-card p-6 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-300 mb-2">Analysis Type</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-600 bg-slate-800/50 cursor-pointer hover:bg-slate-700/50 transition-colors">
                <input
                  type="radio"
                  name="type"
                  value="promotion"
                  checked={recommendationType === 'promotion'}
                  onChange={(e) => setRecommendationType(e.target.value)}
                  className="text-blue-500 focus:ring-blue-500 bg-slate-900 border-slate-600"
                />
                <TrendingUp size={18} className="text-emerald-400" />
                <span className="text-slate-200 text-sm font-medium">Promotion Suitability</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-600 bg-slate-800/50 cursor-pointer hover:bg-slate-700/50 transition-colors">
                <input
                  type="radio"
                  name="type"
                  value="training"
                  checked={recommendationType === 'training'}
                  onChange={(e) => setRecommendationType(e.target.value)}
                  className="text-blue-500 focus:ring-blue-500 bg-slate-900 border-slate-600"
                />
                <BookOpen size={18} className="text-amber-400" />
                <span className="text-slate-200 text-sm font-medium">Training Suggestions</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-600 bg-slate-800/50 cursor-pointer hover:bg-slate-700/50 transition-colors">
                <input
                  type="radio"
                  name="type"
                  value="ranking"
                  checked={recommendationType === 'ranking'}
                  onChange={(e) => setRecommendationType(e.target.value)}
                  className="text-blue-500 focus:ring-blue-500 bg-slate-900 border-slate-600"
                />
                <Trophy size={18} className="text-yellow-400" />
                <span className="text-slate-200 text-sm font-medium">Top Employees Ranking</span>
              </label>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            {recommendationType !== 'ranking' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Select Employee</label>
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="block w-full px-3 py-3 border border-slate-600 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Choose an Employee --</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} ({emp.department})
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="pt-4">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex justify-center items-center gap-2 font-medium transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <BrainCircuit size={20} />
                    Generate AI Insight
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {error && <div className="text-red-400 mb-4">{error}</div>}

        {/* AI Output Section */}
        {aiResult && (
          <div className="mt-8 pt-6 border-t border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">AI Analysis Result</h3>
            
            {aiResult.error && (
              <div className="bg-red-900/20 text-red-400 p-4 rounded-lg">
                <p>{aiResult.error}</p>
                <p className="text-xs mt-2 opacity-70">Raw Response: {aiResult.rawResponse}</p>
              </div>
            )}

            {!aiResult.error && recommendationType === 'promotion' && (
              <div className={`p-6 rounded-lg border ${aiResult.recommendPromotion ? 'bg-emerald-900/20 border-emerald-800/50' : 'bg-slate-800 border-slate-700'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-full ${aiResult.recommendPromotion ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                    <TrendingUp size={24} />
                  </div>
                  <h4 className={`text-lg font-bold ${aiResult.recommendPromotion ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {aiResult.recommendPromotion ? 'Recommended for Promotion' : 'Not Recommended at this time'}
                  </h4>
                </div>
                <p className="text-slate-300 leading-relaxed">{aiResult.reasoning}</p>
              </div>
            )}

            {!aiResult.error && recommendationType === 'training' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiResult.suggestedTrainings?.map((training, idx) => (
                  <div key={idx} className="bg-slate-800/80 p-4 rounded-lg border border-amber-900/30">
                    <h4 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                      <BookOpen size={16} />
                      {training.name}
                    </h4>
                    <p className="text-sm text-slate-300">{training.reason}</p>
                  </div>
                ))}
              </div>
            )}

            {!aiResult.error && recommendationType === 'ranking' && (
              <div className="space-y-4">
                {aiResult.topRankings?.map((rank, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-slate-800/80 rounded-lg border border-slate-700">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500 font-bold text-xl">
                      #{idx + 1}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{rank.name}</h4>
                      <p className="text-sm text-slate-400 mb-2">{rank.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendation;
