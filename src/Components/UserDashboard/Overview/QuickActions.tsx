import { Link } from "react-router";

export const QuickActions = () => {
  const actions = [
    {
      title: "Browse Events",
      description: "Discover upcoming events",
      icon: "🎭",
      link: "/events",
      color: "blue",
    },
    {
      title: "My Bookings",
      description: "View your reservations",
      icon: "🎟️",
      link: "/dashboard/bookings",
      color: "green",
    },
    {
      title: "Profile Settings",
      description: "Update your information",
      icon: "⚙️",
      link: "/dashboard/profile",
      color: "purple",
    },
    {
      title: "Get Support",
      description: "Need help? Contact us",
      icon: "🆘",
      link: "/dashboard/support",
      color: "orange",
    },
  ];

  const colorClasses = {
    blue: "bg-blue-500 hover:bg-blue-600",
    green: "bg-green-500 hover:bg-green-600",
    purple: "bg-purple-500 hover:bg-purple-600",
    orange: "bg-orange-500 hover:bg-orange-600",
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className={`${
              colorClasses[action.color as keyof typeof colorClasses]
            } text-white p-4 rounded-lg hover:shadow-md transition-all duration-200 block`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{action.icon}</span>
              <div>
                <h4 className="font-semibold">{action.title}</h4>
                <p className="text-sm opacity-90">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
