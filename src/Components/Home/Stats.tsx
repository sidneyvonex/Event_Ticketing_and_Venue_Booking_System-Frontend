import {
  MdEvent,
  MdConfirmationNumber,
  MdPeople,
  MdTrendingUp,
  MdStars,
} from "react-icons/md";

export const Stats = () => {
  const stats = [
    {
      id: 1,
      value: "500",
      suffix: "+",
      title: "Events Hosted",
      description: "Successfully organized events",
      icon: MdEvent,
      color: "text-primary",
      bgColor: "bg-primary/10",
      delay: "0ms",
    },
    {
      id: 2,
      value: "25K",
      suffix: "+",
      title: "Tickets Sold",
      description: "Happy customers served",
      icon: MdConfirmationNumber,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      delay: "100ms",
    },
    {
      id: 3,
      value: "10K",
      suffix: "+",
      title: "Active Users",
      description: "Growing community",
      icon: MdPeople,
      color: "text-accent",
      bgColor: "bg-accent/10",
      delay: "200ms",
    }
  ];

  return (
    <section className="bg-gradient-to-br from-[#E5E0D8] via-[#F5F1E8] to-[#EDE8DF] py-20 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <MdTrendingUp className="text-4xl text-primary" />
            <MdStars className="text-2xl text-secondary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Platform in
            <span className="text-primary"> Numbers</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Building the future of event management with trusted partnerships
            and exceptional experiences
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.id}
                className="group relative"
                style={{ animationDelay: stat.delay }}
              >
                {/* Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20">
                  {/* Icon */}
                  <div
                    className={`${stat.bgColor} ${stat.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="text-3xl" />
                  </div>

                  {/* Value */}
                  <div className="mb-4">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl md:text-5xl font-bold text-gray-800 group-hover:text-primary transition-colors duration-300">
                        {stat.value}
                      </span>
                      <span className="text-3xl font-bold text-primary ml-1">
                        {stat.suffix}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                    {stat.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-center text-sm leading-relaxed">
                    {stat.description}
                  </p>

                  {/* Hover Effect Glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
