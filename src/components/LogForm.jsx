import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getHealthLogByDate, addHealthLog, updateHealthLog } from '../api/firestore';
import { addNotification } from '../api/firestore';

export default function LogForm({ onLogSaved }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    steps: '',
    heartRate: '',
    sleepHours: '',
    hydrationGlasses: '',
    weight: '',
    notes: ''
  });
  const [existingLogId, setExistingLogId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user && formData.date) {
      checkExistingLog(formData.date);
    }
  }, [user, formData.date]);

  const checkExistingLog = async (dateStr) => {
    setMessage('');
    const existing = await getHealthLogByDate(user.uid, dateStr);
    if (existing) {
      setExistingLogId(existing.id);
      setFormData({
        date: existing.date,
        steps: existing.steps || '',
        heartRate: existing.heartRate || '',
        sleepHours: existing.sleepHours || '',
        hydrationGlasses: existing.hydrationGlasses || '',
        weight: existing.weight || '',
        notes: existing.notes || ''
      });
      setMessage('Editing existing log for this date.');
    } else {
      setExistingLogId(null);
      setFormData(prev => ({ ...prev, steps: '', heartRate: '', sleepHours: '', hydrationGlasses: '', weight: '', notes: '' }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const logData = {
      date: formData.date,
      steps: Number(formData.steps),
      heartRate: Number(formData.heartRate),
      sleepHours: Number(formData.sleepHours),
      hydrationGlasses: Number(formData.hydrationGlasses),
      weight: Number(formData.weight),
      notes: formData.notes
    };

    try {
      if (existingLogId) {
        await updateHealthLog(existingLogId, logData);
        setMessage('Log updated successfully! ✓');
      } else {
        await addHealthLog(user.uid, logData);
        setMessage('Log saved successfully! ✓');
        
        if (logData.steps > 0 && logData.steps < 3000) {
          await addNotification(user.uid, "Low activity detected today. Try to take a quick walk!", "alert");
        }

        // Re-check to set to edit mode
        checkExistingLog(formData.date);
      }
      if (onLogSaved) onLogSaved();
    } catch (error) {
      console.error(error);
      setMessage('Error saving log.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 mb-8 transition-colors">
      <h2 className="text-xl font-bold text-gray-800 dark:text-slate-200 mb-4">{existingLogId ? 'Update Health Log' : 'New Health Log'}</h2>
      {message && (
        <div className={`p-3 mb-4 rounded ${message.includes('Error') ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded focus:ring-2 focus:ring-green-500 transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Steps</label>
          <input type="number" name="steps" value={formData.steps} onChange={handleChange} placeholder="e.g. 7500" className="w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded focus:ring-2 focus:ring-green-500 transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Heart Rate (bpm)</label>
          <input type="number" name="heartRate" value={formData.heartRate} onChange={handleChange} placeholder="e.g. 72" className="w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded focus:ring-2 focus:ring-green-500 transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Sleep (Hours)</label>
          <input type="number" step="0.5" name="sleepHours" value={formData.sleepHours} onChange={handleChange} placeholder="e.g. 7.5" className="w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded focus:ring-2 focus:ring-green-500 transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Hydration (Glasses)</label>
          <input type="number" name="hydrationGlasses" value={formData.hydrationGlasses} onChange={handleChange} placeholder="e.g. 6" className="w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded focus:ring-2 focus:ring-green-500 transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Weight (kg)</label>
          <input type="number" step="0.1" name="weight" value={formData.weight} onChange={handleChange} placeholder="e.g. 68.5" className="w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded focus:ring-2 focus:ring-green-500 transition-colors" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Notes</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="How did you feel today?" className="w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded focus:ring-2 focus:ring-green-500 transition-colors" rows="2"></textarea>
        </div>
        <div className="md:col-span-2 mt-2">
          <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50">
            {loading ? 'Saving...' : (existingLogId ? 'Update Log' : 'Save Log')}
          </button>
        </div>
      </form>
    </div>
  );
}
