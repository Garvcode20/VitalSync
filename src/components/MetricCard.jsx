export default function MetricCard({ title, value, icon, trend }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        {trend && <p className="text-xs text-gray-400 mt-1">{trend}</p>}
      </div>
      <div className="p-3 bg-gray-50 rounded-full text-green-600 text-xl">
        {icon}
      </div>
    </div>
  );
}
