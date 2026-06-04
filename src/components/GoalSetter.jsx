import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getGoals, addGoal, updateGoal } from '../api/firestore';

export default function GoalSetter({ onGoalsUpdated }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    targetSteps: '',
    targetSleep: '',
    targetHydration: ''
  });
  const [existingGoalId, setExistingGoalId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchGoal = async () => {
      if (!user) return;
      try {
        const goals = await getGoals(user.uid);
        if (goals.length > 0) {
          setExistingGoalId(goals[0].id);
          setFormData({
            targetSteps: goals[0].targetSteps || '',
            targetSleep: goals[0].targetSleep || '',
            targetHydration: goals[0].targetHydration || ''
          });
        }
      } catch (err) {
        console.error("Error fetching goals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGoal();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const goalData = {
      targetSteps: Number(formData.targetSteps),
      targetSleep: Number(formData.targetSleep),
      targetHydration: Number(formData.targetHydration)
    };

    try {
      if (existingGoalId) {
        await updateGoal(existingGoalId, goalData);
        setMessage('Goals updated successfully!');
      } else {
        const res = await addGoal(user.uid, goalData);
        setExistingGoalId(res.id);
        setMessage('Goals saved successfully!');
      }
      if (onGoalsUpdated) onGoalsUpdated();
    } catch (error) {
      console.error(error);
      setMessage('Error saving goals.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4 text-center text-gray-500 dark:text-slate-400">Loading...</div>;

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 mb-6 transition-colors">
      <h2 className="text-xl font-bold text-gray-800 dark:text-slate-200 mb-4">Set Your Targets</h2>
      {message && (
        <div className={`p-3 mb-4 rounded ${message.includes('Error') ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Target Steps</label>
          <input type="number" name="targetSteps" value={formData.targetSteps} onChange={handleChange} placeholder="e.g. 10000" required className="w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded focus:ring-2 focus:ring-blue-500 transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Target Sleep (Hours)</label>
          <input type="number" step="0.5" name="targetSleep" value={formData.targetSleep} onChange={handleChange} placeholder="e.g. 8" required className="w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded focus:ring-2 focus:ring-blue-500 transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Target Hydration (Glasses)</label>
          <input type="number" name="targetHydration" value={formData.targetHydration} onChange={handleChange} placeholder="e.g. 8" required className="w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded focus:ring-2 focus:ring-blue-500 transition-colors" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50">
          {existingGoalId ? 'Update Goals' : 'Save Goals'}
        </button>
      </form>
    </div>
  );
}
