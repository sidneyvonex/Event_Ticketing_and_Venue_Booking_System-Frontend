export const WelcomeCard = ({ user }: { user: { fullName: string } }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-gradient-to-r from-[#090040] to-[#1a0873] text-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {user.fullName}! 👋
          </h2>
          <p className="text-blue-100 text-lg mb-2">
            {currentDate}
          </p>
          <p className="text-blue-200">
            Here's a summary of your bookings and events.
          </p>
        </div>
        <div className="hidden md:block">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-3xl">🎟️</span>
          </div>
        </div>
      </div>
    </div>
  );
};
