import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../Features/app/store";
import { paymentsApi } from "../../Features/api/PaymentsApi";
import type { PaymentDataTypes } from "../../types/types";
import { PuffLoader } from "react-spinners";
import { CircleCheckBig, Clock, DollarSign, RotateCcw } from "lucide-react";

// PDF generation function
const generatePaymentPDF = (payment: PaymentDataTypes) => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const pdfContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Payment Receipt - #${payment.paymentId || ""}</title>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          margin: 20px; 
          color: #1f2937;
          line-height: 1.4;
          font-size: 14px;
        }
        .header { 
          text-align: center; 
          border-bottom: 2px solid #6366f1; 
          padding-bottom: 15px; 
          margin-bottom: 20px;
        }
        .company-name { 
          font-size: 22px; 
          font-weight: bold; 
          color: #6366f1; 
          margin-bottom: 3px;
        }
        .receipt-title { 
          font-size: 14px; 
          color: #6b7280; 
        }
        .receipt-info { 
          background: #f8fafc; 
          padding: 15px; 
          border-radius: 6px; 
          margin-bottom: 18px;
          border: 1px solid #e2e8f0;
        }
        .info-row { 
          display: flex; 
          justify-content: space-between; 
          margin-bottom: 8px; 
          padding: 5px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .info-row:last-child { 
          border-bottom: none; 
        }
        .label { 
          font-weight: 600; 
          color: #374151;
          font-size: 13px;
        }
        .value { 
          color: #1f2937;
          font-size: 13px;
        }
        .amount { 
          font-size: 18px; 
          font-weight: bold; 
          color: #059669; 
          text-align: center; 
          padding: 12px; 
          background: #ecfdf5; 
          border-radius: 6px; 
          margin: 15px 0;
          border: 1px solid #a7f3d0;
        }
        .status { 
          display: inline-block; 
          padding: 4px 8px; 
          border-radius: 12px; 
          font-weight: 600; 
          text-transform: uppercase; 
          font-size: 10px;
        }
        .status.completed { 
          background: #dcfce7; 
          color: #166534; 
        }
        .status.pending { 
          background: #fef3c7; 
          color: #92400e; 
        }
        .status.failed { 
          background: #fee2e2; 
          color: #991b1b; 
        }
        .status.refunded { 
          background: #dbeafe; 
          color: #1e40af; 
        }
        .event-section h3 {
          margin: 0 0 10px 0; 
          color: #6366f1;
          font-size: 16px;
          font-weight: 600;
        }
        .footer { 
          margin-top: 25px; 
          text-align: center; 
          font-size: 11px; 
          color: #6b7280; 
          border-top: 1px solid #e5e7eb; 
          padding-top: 15px;
        }
        .footer p {
          margin: 3px 0;
        }
        @media print {
          body { margin: 15px; font-size: 12px; }
          .amount { font-size: 16px; }
          .company-name { font-size: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">TicKenya</div>
        <div class="receipt-title">Payment Receipt</div>
      </div>

      <div class="receipt-info">
        <div class="info-row">
          <span class="label">Receipt #:</span>
          <span class="value">${
            payment.paymentId
              ? payment.paymentId.toString().padStart(6, "0")
              : "N/A"
          }</span>
        </div>
        <div class="info-row">
          <span class="label">Transaction ID:</span>
          <span class="value">${payment.transactionId || "N/A"}</span>
        </div>
        <div class="info-row">
          <span class="label">Payment Date:</span>
          <span class="value">${
            payment.paymentDate
              ? new Date(payment.paymentDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A"
          }</span>
        </div>
        <div class="info-row">
          <span class="label">Payment Method:</span>
          <span class="value">${payment.paymentMethod || "N/A"}</span>
        </div>
        <div class="info-row">
          <span class="label">Status:</span>
          <span class="value">
            <span class="status ${
              payment.paymentStatus ? payment.paymentStatus.toLowerCase() : ""
            }">${payment.paymentStatus || "N/A"}</span>
          </span>
        </div>
      </div>

      <div class="amount">
        Total: KSh ${
          !isNaN(Number(payment.amount))
            ? Number(payment.amount).toLocaleString()
            : "N/A"
        }
      </div>

      <div class="receipt-info event-section">
        <h3>Event Details</h3>
        <div class="info-row">
          <span class="label">Event:</span>
          <span class="value">${
            payment?.booking?.event?.eventTitle || "N/A"
          }</span>
        </div>
        <div class="info-row">
          <span class="label">Venue:</span>
          <span class="value">${
            payment?.booking?.event?.venue?.venueName || "N/A"
          }</span>
        </div>
        <div class="info-row">
          <span class="label">Event Date:</span>
          <span class="value">${
            payment?.booking?.event?.eventDate
              ? new Date(payment.booking.event.eventDate).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )
              : "N/A"
          }</span>
        </div>
        <div class="info-row">
          <span class="label">Tickets:</span>
          <span class="value">${
            payment?.booking?.quantity || "N/A"
          } ticket(s)</span>
        </div>
        <div class="info-row">
          <span class="label">Booking ID:</span>
          <span class="value">#${payment?.bookingId || "N/A"}</span>
        </div>
      </div>

      <div class="footer">
        <p><strong>Thank you for choosing TicKenya!</strong></p>
        <p>This is your electronic receipt. Please keep for your records.</p>
        <p>Generated: ${new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}</p>
      </div>

      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(pdfContent);
  printWindow.document.close();
};

export const UserPaymentsPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const userId = user?.userId;

  const {
    data: paymentsData = [],
    isLoading,
    error,
  } = paymentsApi.useGetAllPaymentsForUserIdQuery(userId, {
    skip: !userId,
  });

  const [filterStatus, setFilterStatus] = useState("All");

  // Filter payments based on status
  const filteredPayments =
    filterStatus === "All"
      ? paymentsData
      : paymentsData.filter(
          (payment: PaymentDataTypes) => payment.paymentStatus === filterStatus
        );

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return "badge badge-success";
      case "Pending":
        return "badge badge-warning";
      case "Failed":
        return "badge badge-error";
      case "Refunded":
        return "badge badge-info";
      default:
        return "badge badge-ghost";
    }
  };

  // Calculate totals using real data - fix for total amount
  const totalAmount = (filteredPayments as PaymentDataTypes[]).reduce(
    (sum: number, payment: PaymentDataTypes) => sum + Number(payment.amount),
    0
  );

  const completedPayments = (filteredPayments as PaymentDataTypes[]).filter(
    (p: PaymentDataTypes) => p.paymentStatus === "Completed"
  );
  const pendingPayments = (filteredPayments as PaymentDataTypes[]).filter(
    (p: PaymentDataTypes) => p.paymentStatus === "Pending"
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-base-content">
            Transaction History
          </h2>
          <p className="text-base-content/70 mt-1">
            View all your payment transactions.
          </p>
        </div>

        {/* Filter Dropdown */}
        <select
          className="select select-bordered w-40"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
        </select>
      </div>

      {/* Summary Cards - Compact & Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="bg-base-100 shadow rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-base-content/70">Total Spent</div>
              <div className="text-xl font-bold text-primary">
                KSh {totalAmount.toLocaleString()}
              </div>
              <div className="text-xs text-base-content/60">
                All transactions
              </div>
            </div>
            <DollarSign className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="bg-base-100 shadow rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-base-content/70">Completed</div>
              <div className="text-xl font-bold text-success">
                {completedPayments.length}
              </div>
              <div className="text-xs text-base-content/60">
                Successful payments
              </div>
            </div>
            <CircleCheckBig className="w-6 h-6 text-success" />
          </div>
        </div>

        <div className="bg-base-100 shadow rounded-lg p-4 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-base-content/70">Pending</div>
              <div className="text-xl font-bold text-warning">
                {pendingPayments.length}
              </div>
              <div className="text-xs text-base-content/60">
                Awaiting confirmation
              </div>
            </div>
            <Clock className="w-6 h-6 text-warning" />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-48 bg-base-100 rounded-2xl border border-base-300">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <PuffLoader size={60} color="#0f172a" />
            </div>
            <p className="text-sm">Loading your payments...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-48 bg-base-100 rounded-2xl border border-base-300">
          <div className="text-center">
            <div className="text-4xl mb-2">⚠️</div>
            <p className="text-red-500 text-xl font-semibold">
              Something went wrong
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Failed to load payment history
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-base-300 bg-base-100 shadow-lg">
          <table className="table w-full">
            {/* Table Head */}
            <thead className="bg-base-200 text-base-content border-b border-base-300">
              <tr>
                <th>Payment ID</th>
                <th>Event Details</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-base-200">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <div className="text-base-content/70">
                      <div className="text-4xl mb-2">💳</div>
                      <p className="font-semibold">No transactions found</p>
                      <p className="text-sm">
                        {filterStatus === "All"
                          ? "You haven't made any payments yet."
                          : `No ${filterStatus.toLowerCase()} transactions found.`}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment: PaymentDataTypes) => (
                  <tr key={payment.paymentId} className="hover:bg-base-50">
                    <td>
                      <div className="font-mono text-sm">
                        #{payment.paymentId.toString().padStart(4, "0")}
                      </div>
                    </td>

                    <td>
                      <div className="space-y-1">
                        <div className="font-semibold text-xs">
                          {payment.booking?.event?.eventTitle || "N/A"}
                        </div>
                        <div className="text-xs text-base-content/70">
                          {payment.booking?.event?.venue?.venueName || "N/A"} •{" "}
                          {payment.booking?.quantity || "N/A"} ticket(s)
                        </div>
                        <div className="text-xs text-base-content/70">
                          Event:{" "}
                          {payment.booking?.event?.eventDate
                            ? new Date(
                                payment.booking.event.eventDate
                              ).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="font-semibold text-sm">
                        KSh{" "}
                        {!isNaN(Number(payment.amount))
                          ? Number(payment.amount).toLocaleString()
                          : "N/A"}
                      </div>
                    </td>

                    <td>
                      <div className="text-sm">{payment.paymentMethod}</div>
                    </td>

                    <td>
                      <div className="font-mono text-xs bg-base-200 px-2 py-1 rounded">
                        {payment.transactionId}
                      </div>
                    </td>

                    <td>
                      <div className="text-sm">
                        {formatDate(payment.paymentDate)}
                      </div>
                    </td>

                    <td>
                      <span className={getStatusBadge(payment.paymentStatus)}>
                        {payment.paymentStatus}
                      </span>
                    </td>

                    <td>
                      <div className="flex flex-col gap-1">
                        <button
                          className="btn btn-xs btn-outline"
                          onClick={() => generatePaymentPDF(payment)}
                          title="View/Download Receipt"
                        >
                          View
                        </button>
                        {payment.paymentStatus === "Failed" && (
                          <button className="btn btn-xs btn-primary flex items-center gap-1">
                            <RotateCcw className="w-3 h-3" />
                            Retry
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Info */}
      <div className="text-center text-sm text-base-content/60">
        <p>
          Showing {filteredPayments.length} of {paymentsData.length}{" "}
          transactions
        </p>
      </div>
    </div>
  );
};
