import { Link } from "react-router";
import { CalendarWidget } from "../UserDashboard/Overview/CalendarWidget";

export const WelcomeSection = () => {
  const stats = [
    {
      title: "Total Events",
      value: "500+",
      icon: "🎭",
      color: "blue",
    },
    {
      title: "Happy Customers",
      value: "10K+",
      icon: "😊",
      color: "green",
    },
    {
      title: "Venues Available",
      value: "150+",
      icon: "🏢",
      color: "purple",
    },
    {
      title: "Cities Covered",
      value: "25+",
      icon: "🌍",
      color: "orange",
    },
  ];

  const quickActions = [
    {
      title: "Browse Events",
      description: "Discover amazing events",
      icon: "🎫",
      link: "/events",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Book Venue",
      description: "Reserve your perfect venue",
      icon: "🏛️",
      link: "/venues",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Join Community",
      description: "Connect with event lovers",
      icon: "👥",
      link: "/register",
      color: "from-purple-500 to-purple-600",
    },
  ];

  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    green: "bg-green-50 border-green-200 text-green-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
    orange: "bg-orange-50 border-orange-200 text-orange-600",
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-[#090040] to-[#1a0873] text-white p-8 rounded-2xl shadow-xl mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome to EventHub! 🎉
              </h1>
              <p className="text-xl text-blue-100 mb-6">
                Your gateway to amazing events and unforgettable experiences.
                Discover, book, and enjoy the best events in your city.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/events"
                  className="bg-white text-[#090040] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
                >
                  Explore Events
                </Link>
                <Link
                  to="/register"
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#090040] transition-colors text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-6xl">🎪</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">
                    {stat.title}
                  </h3>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    colorClasses[stat.color as keyof typeof colorClasses]
                  }`}
                >
                  <span className="text-xl">{stat.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Calendar */}
          <div className="lg:col-span-1">
            <CalendarWidget />
          </div>

          {/* Right Column - Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className={`bg-gradient-to-r ${action.color} text-white p-6 rounded-xl hover:shadow-lg transition-all duration-200 block text-center`}
                  >
                    <div className="text-4xl mb-3">{action.icon}</div>
                    <h4 className="font-bold text-lg mb-2">{action.title}</h4>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
