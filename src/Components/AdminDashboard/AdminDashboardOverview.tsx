import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  MdEvent,
  MdConfirmationNumber,
  MdAttachMoney,
  MdLocationOn,
  MdTrendingUp,
  MdTrendingDown,
  MdPeople,
  MdDateRange,
  MdAnalytics,
  MdStars,
} from "react-icons/md";
import { useGetAllBooksQuery } from "../../Features/api/BookingsApi";
import { eventApi } from "../../Features/api/EventApi";

interface BookingType {
  bookingId: number;
  eventId: number;
  userId: number;
  quantity: number;
  totalAmount: string;
  bookingStatus: string;
  createdAt: string;
  bookingDate?: string;
}

interface EventType {
  eventId: number;
  eventTitle: string;
  category: string;
  venueId: number;
  ticketPrice: string;
  ticketsSold: number;
}

interface DashboardStats {
  totalRevenue: number;
  totalBookings: number;
  totalEvents: number;
  totalVenues: number;
  monthlyGrowth: number;
  revenueGrowth: number;
}

interface RevenueData {
  month: string;
  revenue: number;
  bookings: number;
}

interface TopEvent {
  name: string;
  tickets: number;
  revenue: number;
  category: string;
}

interface BookingStatus {
  name: string;
  value: number;
  color: string;
}

// Color schemes for charts (outside component to prevent re-renders)
const COLORS = ["#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];
const CHART_COLORS = {
  primary: "#8B5CF6",
  secondary: "#06B6D4",
  accent: "#10B981",
  warning: "#F59E0B",
};

export const AdminDashboardOverview = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalBookings: 0,
    totalEvents: 0,
    totalVenues: 0,
    monthlyGrowth: 0,
    revenueGrowth: 0,
  });

  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [topEvents, setTopEvents] = useState<TopEvent[]>([]);
  const [bookingStatusData, setBookingStatusData] = useState<BookingStatus[]>(
    []
  );

  // API hooks
  const { data: bookings = [], isLoading: bookingsLoading } =
    useGetAllBooksQuery({});
  const { data: events = [], isLoading: eventsLoading } =
    eventApi.useGetAllEventsQuery({});

  // Calculate stats directly without useCallback to avoid dependency issues
  useEffect(() => {
    if (!bookings.length && !events.length) return;

    // Calculate stats
    const totalRevenue = bookings.reduce(
      (sum: number, booking: BookingType) =>
        sum + parseFloat(booking.totalAmount || "0"),
      0
    );

    const totalBookings = bookings.length;
    const totalEvents = events.length;

    // Get unique venues from events
    const uniqueVenues = new Set(
      events.map((event: EventType) => event.venueId)
    );
    const totalVenues = uniqueVenues.size;

    // Calculate growth (mock data for now)
    const monthlyGrowth = 12.5;
    const revenueGrowth = 18.3;

    setStats({
      totalRevenue,
      totalBookings,
      totalEvents,
      totalVenues,
      monthlyGrowth,
      revenueGrowth,
    });

    // Generate revenue data
    const monthlyData: {
      [key: string]: { revenue: number; bookings: number };
    } = {};

    bookings.forEach((booking: BookingType) => {
      const date = new Date(booking.createdAt || booking.bookingDate || "");
      const monthKey = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { revenue: 0, bookings: 0 };
      }

      monthlyData[monthKey].revenue += parseFloat(booking.totalAmount || "0");
      monthlyData[monthKey].bookings += 1;
    });

    const chartData = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      bookings: data.bookings,
    }));

    setRevenueData(chartData.slice(-6));

    // Generate top events
    const eventPerformance: { [key: string]: TopEvent } = {};

    bookings.forEach((booking: BookingType) => {
      const eventId = booking.eventId.toString();
      if (!eventPerformance[eventId]) {
        const event = events.find(
          (e: EventType) => e.eventId === booking.eventId
        );
        eventPerformance[eventId] = {
          name: event?.eventTitle || "Unknown Event",
          tickets: 0,
          revenue: 0,
          category: event?.category || "Other",
        };
      }

      eventPerformance[eventId].tickets += booking.quantity || 1;
      eventPerformance[eventId].revenue += parseFloat(
        booking.totalAmount || "0"
      );
    });

    const topEventsList = Object.values(eventPerformance)
      .sort((a: TopEvent, b: TopEvent) => b.revenue - a.revenue)
      .slice(0, 5);

    setTopEvents(topEventsList);

    // Generate booking status data
    const statusCounts: { [key: string]: number } = {};

    bookings.forEach((booking: BookingType) => {
      const status = booking.bookingStatus || "Pending";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    const statusData = Object.entries(statusCounts).map(
      ([status, count], index) => ({
        name: status,
        value: count,
        color: COLORS[index % COLORS.length],
      })
    );

    setBookingStatusData(statusData);
  }, [bookings, events]);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    growth,
    color,
  }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    growth?: number;
    color: string;
  }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {growth !== undefined && (
            <div className="flex items-center mt-2">
              {growth > 0 ? (
                <MdTrendingUp className="text-green-500 text-sm mr-1" />
              ) : (
                <MdTrendingDown className="text-red-500 text-sm mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  growth > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {Math.abs(growth)}%
              </span>
              <span className="text-gray-500 text-sm ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="text-white text-2xl" />
        </div>
      </div>
    </div>
  );

  if (bookingsLoading || eventsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-80 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard Overview
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`Ksh ${stats.totalRevenue.toLocaleString()}`}
          icon={MdAttachMoney}
          growth={stats.revenueGrowth}
          color="bg-green-500"
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings.toLocaleString()}
          icon={MdConfirmationNumber}
          growth={stats.monthlyGrowth}
          color="bg-blue-500"
        />
        <StatCard
          title="Events"
          value={stats.totalEvents.toLocaleString()}
          icon={MdEvent}
          color="bg-purple-500"
        />
        <StatCard
          title="Venues"
          value={stats.totalVenues.toLocaleString()}
          icon={MdLocationOn}
          color="bg-orange-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Revenue Trend
            </h3>
            <MdAnalytics className="text-gray-400 text-xl" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={CHART_COLORS.primary}
                fill={CHART_COLORS.primary}
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Status Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Booking Status
            </h3>
            <MdDateRange className="text-gray-400 text-xl" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bookingStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({
                  name,
                  percent,
                }: {
                  name?: string;
                  percent?: number;
                }) =>
                  `${name || ""} ${percent ? (percent * 100).toFixed(0) : "0"}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {bookingStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Bookings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Monthly Bookings
            </h3>
            <MdPeople className="text-gray-400 text-xl" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar
                dataKey="bookings"
                fill={CHART_COLORS.secondary}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Performing Events */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Top Performing Events
            </h3>
            <MdStars className="text-gray-400 text-xl" />
          </div>
          <div className="space-y-4">
            {topEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 truncate">
                    {event.name}
                  </p>
                  <p className="text-sm text-gray-600">{event.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    Ksh {event.revenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {event.tickets} tickets
                  </p>
                </div>
              </div>
            ))}
            {topEvents.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <MdEvent className="mx-auto text-4xl mb-2 opacity-50" />
                <p>No event data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
