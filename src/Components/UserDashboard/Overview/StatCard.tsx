export const StatCard = ({
  title,
  value,
  icon,
  color = "blue",
}: {
  title: string;
  value: string;
  icon?: string;
  color?: "blue" | "green" | "purple" | "orange";
}) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    green: "bg-green-50 border-green-200 text-green-600", 
    purple: "bg-purple-50 border-purple-200 text-purple-600",
    orange: "bg-orange-50 border-orange-200 text-orange-600",
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            <span className="text-xl">{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
};
