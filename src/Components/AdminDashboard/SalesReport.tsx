/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState, useRef } from "react";
import { useGetAllPaymentsQuery } from "../../Features/api/PaymentsApi";
import { useGetAllEventsQuery } from "../../Features/api/EventApi";
import { useGetAllBooksQuery } from "../../Features/api/BookingsApi";
import type {
  PaymentDataTypes,
  EventsDataTypes,
  BookingsDataTypes,
} from "../../types/types";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Image,
} from "@react-pdf/renderer";
import html2canvas from "html2canvas";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Currency Formatter
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

// PDF Document Component
const SalesReportPDF = ({
  report,
  periodLabel,
  chartImage,
}: {
  report: any;
  periodLabel: string;
  chartImage: string;
}) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.heading}>Sales Report ({periodLabel})</Text>
        <Text style={pdfStyles.statHighlight}>
          Total Sales: {formatCurrency(report.totalSales)}
        </Text>
        <Text style={pdfStyles.stat}>
          Total Bookings: {report.totalBookings}
        </Text>
        <Text style={pdfStyles.stat}>Total Events: {report.totalEvents}</Text>
        <Text style={pdfStyles.stat}>Unique Users: {report.uniqueUsers}</Text>
      </View>
      {chartImage && (
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.heading}>Sales Chart</Text>
          <Image src={chartImage} style={{ width: "100%", height: 200 }} />
        </View>
      )}
    </Page>
  </Document>
);

// Light-themed PDF styles
const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#ffffff",
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: 20,
    padding: 10,
    border: "1pt solid #e5e7eb",
    borderRadius: 4,
  },
  heading: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#111827",
  },
  statHighlight: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 5,
  },
  stat: {
    fontSize: 12,
    color: "#374151",
    marginBottom: 4,
  },
});

const SalesReport: React.FC = () => {
  const [period, setPeriod] = useState<"monthly" | "daily" | "yearly">("monthly");
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartImage, setChartImage] = useState<string>("");

  const { data: payments = [] } = useGetAllPaymentsQuery({});
  const { data: events = [] } = useGetAllEventsQuery({});
  const { data: bookings = [] } = useGetAllBooksQuery({});

  // Group sales data for chart
  const salesData = useMemo(() => {
    const grouped = (payments as PaymentDataTypes[]).reduce((acc, payment) => {
      const date = new Date(payment.createdAt || payment.paymentDate);
      if (isNaN(date.getTime())) return acc;
      let key = "";
      if (period === "monthly") {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      } else if (period === "daily") {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      } else {
        key = `${date.getFullYear()}`;
      }
      acc[key] = (acc[key] || 0) + Number(payment.amount || 0);
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, total]) => ({
        period: key,
        total,
      }));
  }, [payments, period]);

  // Report summary
  const report = useMemo(() => {
    const totalSales = (payments as PaymentDataTypes[]).reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );
    return {
      totalSales,
      totalBookings: (bookings as BookingsDataTypes[]).length,
      totalEvents: (events as EventsDataTypes[]).length,
      uniqueUsers: new Set(
        (bookings as BookingsDataTypes[]).map((b) => b.userId)
      ).size,
    };
  }, [payments, bookings, events]);

  // Top Events by Revenue and Tickets Sold
  const topEvents = useMemo(() => {
    const eventStats: Record<
      number,
      {
        event: EventsDataTypes;
        totalRevenue: number;
        ticketsSold: number;
      }
    > = {};

    (bookings as BookingsDataTypes[]).forEach((booking) => {
      const eventId = booking.eventId;
      if (!eventStats[eventId]) {
        const eventObj =
          (events as EventsDataTypes[]).find((e) => e.eventId === eventId) ||
          ({} as EventsDataTypes);
        eventStats[eventId] = {
          event: eventObj,
          totalRevenue: 0,
          ticketsSold: 0,
        };
      }
      eventStats[eventId].ticketsSold += booking.quantity;
      eventStats[eventId].totalRevenue +=
        Number(booking.quantity) *
        Number(eventStats[eventId].event.ticketPrice || 0);
    });

    return Object.values(eventStats)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);
  }, [bookings, events]);

  // Top Users by Tickets Bought
  const topUsers = useMemo(() => {
    const userStats: Record<
      number,
      {
        userId: number;
        name: string;
        email: string;
        ticketsBought: number;
        totalSpent: number;
      }
    > = {};

    (bookings as BookingsDataTypes[]).forEach((booking) => {
      const userId = booking.userId;
      if (!userStats[userId]) {
        userStats[userId] = {
          userId,
          name:
            booking.user?.firstName && booking.user?.lastName
              ? `${booking.user.firstName} ${booking.user.lastName}`
              : booking.user?.firstName ||
                booking.user?.lastName ||
                `User ${userId}`,
          email: booking.user?.email || "",
          ticketsBought: 0,
          totalSpent: 0,
        };
      }
      userStats[userId].ticketsBought += booking.quantity;
      userStats[userId].totalSpent +=
        Number(booking.quantity) * Number(booking.event?.ticketPrice || 0);
    });

    return Object.values(userStats)
      .sort((a, b) => b.ticketsBought - a.ticketsBought)
      .slice(0, 5);
  }, [bookings]);

  // Generate chart image for PDF (includes chart and tables)
  const handleGeneratePDF = async () => {
    if (chartRef.current) {
      // Wait for chart to render
      await new Promise((resolve) => setTimeout(resolve, 300));
      // Only capture the chart area for the PDF image
      // Use a safe background color (hex or rgb, not oklch or color functions)
      const chartDiv = chartRef.current.querySelector("div");
      const target = chartDiv || chartRef.current;
      // html2canvas can error if any CSS uses oklch() or similar unsupported color functions.
      // To avoid this, ensure your Tailwind config/theme does not use oklch() colors, or override with a safe color here:
      const canvas = await html2canvas(target as HTMLElement, { backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      setChartImage(imgData);
    }
  };

  const periodLabel =
    period === "monthly" ? "Monthly" : period === "daily" ? "Daily" : "Yearly";

  return (
    <div className="p-6">
      {/* Chart Section with Title and Description */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1 text-base-content">
          Sales Trend Chart ({periodLabel})
        </h2>
        <p className="text-base-content/70 mb-3">
          This chart shows the total sales revenue over time based on the selected period. Use it to analyze sales performance and trends for your events.
        </p>
        <div className="flex flex-wrap gap-4 mb-4">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as "monthly" | "daily" | "yearly")}
            className="border px-3 py-2 rounded-lg shadow"
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button
            onClick={handleGeneratePDF}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg"
            type="button"
          >
            Generate Chart Image
          </button>
          <PDFDownloadLink
            document={
              <SalesReportPDF
                report={report}
                periodLabel={periodLabel}
                chartImage={chartImage}
              />
            }
            fileName={`sales-report-${period}.pdf`}
          >
            {({ loading }) => (
              <button
                id="pdf-download-btn"
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                disabled={!chartImage}
              >
                {loading ? "Preparing PDF..." : "Download PDF"}
              </button>
            )}
          </PDFDownloadLink>
        </div>
        <div
          ref={chartRef}
          style={{ width: "100%", height: 300, background: "#fff" }}
          className="rounded-lg border border-gray-200 p-2"
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis
                tickFormatter={(v) =>
                  v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v
                }
              />
              <Tooltip
                formatter={(value: any) => formatCurrency(Number(value))}
                labelFormatter={(label) => `Period: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-base-100 rounded-lg p-4 border border-base-200 shadow">
          <div className="text-xs text-base-content/60">Total Sales</div>
          <div className="text-2xl font-bold text-primary">
            {formatCurrency(report.totalSales)}
          </div>
        </div>
        <div className="bg-base-100 rounded-lg p-4 border border-base-200 shadow">
          <div className="text-xs text-base-content/60">Total Bookings</div>
          <div className="text-2xl font-bold">{report.totalBookings}</div>
        </div>
        <div className="bg-base-100 rounded-lg p-4 border border-base-200 shadow">
          <div className="text-xs text-base-content/60">Total Events</div>
          <div className="text-2xl font-bold">{report.totalEvents}</div>
        </div>
        <div className="bg-base-100 rounded-lg p-4 border border-base-200 shadow">
          <div className="text-xs text-base-content/60">Unique Users</div>
          <div className="text-2xl font-bold">{report.uniqueUsers}</div>
        </div>
      </div>

      {/* Top Events Table */}
      <div className="mt-10">
        <h3 className="text-xl font-bold mb-3 text-base-content">
          Top Events by Revenue
        </h3>
        <div className="overflow-x-auto rounded-lg border border-base-200 bg-base-100 shadow mb-6">
          <div className="w-full">
            <table className="min-w-full divide-y divide-base-200 text-sm">
              <thead className="bg-base-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-base-content uppercase tracking-wider rounded-tl-lg">
                    Event
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-base-content uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-base-content uppercase tracking-wider">
                    Venue
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-base-content uppercase tracking-wider">
                    Tickets Sold
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-base-content uppercase tracking-wider rounded-tr-lg">
                    Total Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-base-100 divide-y divide-base-200">
                {topEvents.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-6 text-base-content/60"
                    >
                      No event data available.
                    </td>
                  </tr>
                ) : (
                  topEvents.map((stat, idx) => (
                    <tr
                      key={stat.event.eventId}
                      className={idx % 2 === 0 ? "bg-base-100" : "bg-base-200/50"}
                    >
                      <td className="px-4 py-3 font-semibold whitespace-nowrap">
                        {stat.event.eventTitle || "N/A"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {stat.event.eventDate
                          ? new Date(stat.event.eventDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {stat.event.venue?.venueName || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-center font-bold">
                        {stat.ticketsSold}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-primary">
                        {formatCurrency(stat.totalRevenue)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Top Users Table */}
      <div className="mt-10">
        <h3 className="text-xl font-bold mb-3 text-base-content">
          Top Users by Tickets Bought
        </h3>
        <div className="overflow-x-auto rounded-lg border border-base-200 bg-base-100 shadow">
          <div className="w-full">
            <table className="min-w-full divide-y divide-base-200 text-sm">
              <thead className="bg-base-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-base-content uppercase tracking-wider rounded-tl-lg">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-base-content uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-base-content uppercase tracking-wider">
                    Tickets Bought
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-base-content uppercase tracking-wider rounded-tr-lg">
                    Total Spent
                  </th>
                </tr>
              </thead>
              <tbody className="bg-base-100 divide-y divide-base-200">
                {topUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-6 text-base-content/60"
                    >
                      No user data available.
                    </td>
                  </tr>
                ) : (
                  topUsers.map((user, idx) => (
                    <tr
                      key={user.userId}
                      className={idx % 2 === 0 ? "bg-base-100" : "bg-base-200/50"}
                    >
                      <td className="px-4 py-3 font-semibold whitespace-nowrap">
                        {user.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 text-center font-bold">
                        {user.ticketsBought}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-primary">
                        {formatCurrency(user.totalSpent)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Responsive Table Styles for Mobile */}
      <style>
        {`
          @media (max-width: 640px) {
            .overflow-x-auto {
              overflow-x: unset !important;
            }
            table.min-w-full, table.min-w-full thead, table.min-w-full tbody, table.min-w-full th, table.min-w-full td, table.min-w-full tr {
              display: block !important;
              width: 100% !important;
            }
            table.min-w-full thead {
              display: none !important;
            }
            table.min-w-full tr {
              margin-bottom: 1.5rem;
              border-radius: 0.75rem;
              background: #f9fafb;
              box-shadow: 0 1px 4px rgba(0,0,0,0.04);
              border: 1px solid #e5e7eb;
              padding: 1rem;
            }
            table.min-w-full td {
              padding: 0.5rem 1rem !important;
              text-align: left !important;
              border: none !important;
              display: flex !important;
              justify-content: space-between;
              align-items: center;
              font-size: 0.95rem;
            }
            table.min-w-full td:before {
              content: attr(data-label);
              font-weight: 600;
              color: #6b7280;
              flex: 1 0 40%;
              margin-right: 1rem;
            }
          }
        `}
      </style>
    </div>
  );
};

export default SalesReport;
