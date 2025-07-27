// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useMemo, useState, useRef } from "react";
// import { useGetAllPaymentsQuery } from "../../Features/api/PaymentsApi";
// import { useGetAllEventsQuery } from "../../Features/api/EventApi";
// import { useGetAllBooksQuery } from "../../Features/api/BookingsApi";
// import { useGetAllUserProfilesQuery } from "../../Features/api/userApi";
// import type {
//   PaymentDataTypes,
//   EventsDataTypes,
//   BookingsDataTypes,
// } from "../../types/types";
// import {
//   Page,
//   Text,
//   View,
//   Document,
//   StyleSheet,
//   PDFDownloadLink,
//   Image,
// } from "@react-pdf/renderer";
// import html2canvas from "html2canvas";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// // Currency Formatter
// const formatCurrency = (amount: number) =>
//   new Intl.NumberFormat("en-KE", {
//     style: "currency",
//     currency: "KES",
//   }).format(amount);

// // PDF Document Component
// const SalesReportPDF = ({
//   report,
//   periodLabel,
//   chartImage,
// }: {
//   report: any;
//   periodLabel: string;
//   chartImage: string;
// }) => (
//   <Document>
//     <Page size="A4" style={pdfStyles.page}>
//       <View style={pdfStyles.section}>
//         <Text style={pdfStyles.heading}>Sales Report ({periodLabel})</Text>
//         <Text style={pdfStyles.statHighlight}>
//           Total Sales: {formatCurrency(report.totalSales)}
//         </Text>
//         <Text style={pdfStyles.stat}>
//           Total Bookings: {report.totalBookings}
//         </Text>
//         <Text style={pdfStyles.stat}>Total Events: {report.totalEvents}</Text>
//         <Text style={pdfStyles.stat}>Unique Users: {report.uniqueUsers}</Text>
//       </View>
//       {chartImage && (
//         <View style={pdfStyles.section}>
//           <Text style={pdfStyles.heading}>Sales Chart</Text>
//           <Image src={chartImage} style={{ width: "100%", height: 200 }} />
//         </View>
//       )}
//     </Page>
//   </Document>
// );

// // Light-themed PDF styles
// const pdfStyles = StyleSheet.create({
//   page: {
//     padding: 30,
//     backgroundColor: "#ffffff",
//     fontSize: 12,
//     fontFamily: "Helvetica",
//   },
//   section: {
//     marginBottom: 20,
//     padding: 10,
//     border: "1pt solid #e5e7eb",
//     borderRadius: 4,
//   },
//   heading: {
//     fontSize: 16,
//     marginBottom: 10,
//     fontWeight: "bold",
//     color: "#111827",
//   },
//   statHighlight: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#2563eb",
//     marginBottom: 5,
//   },
//   stat: {
//     fontSize: 12,
//     color: "#374151",
//     marginBottom: 4,
//   },
// });

// const SalesReport: React.FC = () => {
//   const [period, setPeriod] = useState("monthly");
//   const chartRef = useRef<HTMLDivElement>(null);
//   const [chartImage, setChartImage] = useState<string>("");

//   const { data: payments = [] } = useGetAllPaymentsQuery({});
//   const { data: events = [] } = useGetAllEventsQuery({});
//   const { data: bookings = [] } = useGetAllBooksQuery({});
//   const { data: users = [] } = useGetAllUserProfilesQuery({});

//   const salesData = useMemo(() => {
//     const grouped = (payments as PaymentDataTypes[]).reduce((acc, payment) => {
//       const date = new Date(payment.createdAt || payment.paymentDate);
//       if (isNaN(date.getTime())) return acc;
//       const key =
//         period === "monthly"
//           ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
//               2,
//               "0"
//             )}`
//           : period === "daily"
//           ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
//               2,
//               "0"
//             )}-${String(date.getDate()).padStart(2, "0")}`
//           : `${date.getFullYear()}`;
//       acc[key] = (acc[key] || 0) + Number(payment.amount || 0);
//       return acc;
//     }, {} as Record<string, number>);
//     return Object.entries(grouped).map(([key, total]) => ({
//       period: key,
//       total,
//     }));
//   }, [payments, period]);

//   const report = useMemo(() => {
//     const totalSales = (payments as PaymentDataTypes[]).reduce(
//       (sum, p) => sum + Number(p.amount || 0),
//       0
//     );
//     return {
//       totalSales,
//       totalBookings: (bookings as BookingsDataTypes[]).length,
//       totalEvents: (events as EventsDataTypes[]).length,
//       uniqueUsers: new Set(
//         (bookings as BookingsDataTypes[]).map((b) => b.userId)
//       ).size,
//     };
//   }, [payments, bookings, events]);

//   const handleGeneratePDF = async () => {
//     if (chartRef.current) {
//       const canvas = await html2canvas(chartRef.current);
//       const imgData = canvas.toDataURL("image/png");
//       setChartImage(imgData);
//     }
//   };

//   const periodLabel =
//     period === "monthly" ? "Monthly" : period === "daily" ? "Daily" : "Yearly";

//   return (
//     <div className="p-6">
//       <div className="mb-4 flex items-center gap-4">
//         <select
//           value={period}
//           onChange={(e) => setPeriod(e.target.value)}
//           className="border px-3 py-2 rounded-lg shadow"
//         >
//           <option value="daily">Daily</option>
//           <option value="monthly">Monthly</option>
//           <option value="yearly">Yearly</option>
//         </select>

//         <button
//           onClick={handleGeneratePDF}
//           className="px-4 py-2 bg-gray-700 text-white rounded-lg"
//         >
//           Generate Chart
//         </button>

//         <PDFDownloadLink
//           document={
//             <SalesReportPDF
//               report={report}
//               periodLabel={periodLabel}
//               chartImage={chartImage}
//             />
//           }
//           fileName={`sales-report-${period}.pdf`}
//         >
//           {({ loading }) => (
//             <button
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg"
//               disabled={!chartImage}
//             >
//               {loading ? "Generating PDF..." : "Download PDF"}
//             </button>
//           )}
//         </PDFDownloadLink>
//       </div>

//       <div ref={chartRef} style={{ width: "100%", height: 300 }}>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={salesData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="period" />
//             <YAxis />
//             <Tooltip />
//             <Line type="monotone" dataKey="total" stroke="#2563eb" />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default SalesReport;

const SalesReport = () => {
  return <div>SalesReport</div>;
};

export default SalesReport;
