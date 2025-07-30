import { useState, useMemo } from "react";
import { toast, Toaster } from "sonner";
import {
  CreditCard,
  Eye,
  Search,
  ChevronDown,
  User,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  RefreshCw,
  X,
  Ticket,
  Check,
  Ban,
  RotateCcw,
} from "lucide-react";
import {
  useGetAllPaymentsQuery,
  useUpdatePaymentStatusMutation,
} from "../../Features/api/PaymentsApi";
import type { PaymentDataTypes } from "../../types/types";
import Swal from "sweetalert2";

export const AllPayments = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentDataTypes | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // API hooks
  const {
    data: paymentsResponse = [],
    isLoading: paymentsLoading,
    error: paymentsError,
    refetch: refetchPayments,
  } = useGetAllPaymentsQuery({});

  // Handle different possible response structures
  const payments = useMemo(() => {
    return Array.isArray(paymentsResponse)
      ? paymentsResponse
      : paymentsResponse?.data || paymentsResponse?.payments || [];
  }, [paymentsResponse]);

  const [updatePaymentStatus, { isLoading: isUpdatingStatus }] =
    useUpdatePaymentStatusMutation();

  // Filter and search payments
  const filteredPayments = useMemo(() => {
    let filtered = [...payments];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((payment: PaymentDataTypes) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          payment.paymentId.toString().includes(searchLower) ||
          payment.booking?.user?.firstName
            ?.toLowerCase()
            .includes(searchLower) ||
          payment.booking?.user?.lastName
            ?.toLowerCase()
            .includes(searchLower) ||
          payment.booking?.user?.email?.toLowerCase().includes(searchLower) ||
          payment.booking?.event?.eventTitle
            ?.toLowerCase()
            .includes(searchLower) ||
          payment.paymentMethod?.toLowerCase().includes(searchLower) ||
          payment.amount?.toString().includes(searchLower) ||
          payment.booking?.totalAmount?.toString().includes(searchLower)
        );
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (payment: PaymentDataTypes) =>
          payment.paymentStatus.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Method filter
    if (methodFilter !== "all") {
      filtered = filtered.filter(
        (payment: PaymentDataTypes) =>
          payment.paymentMethod?.toLowerCase() === methodFilter.toLowerCase()
      );
    }

    // Sort
    filtered.sort((a: PaymentDataTypes, b: PaymentDataTypes) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.paymentDate || b.createdAt || "").getTime() -
            new Date(a.paymentDate || a.createdAt || "").getTime()
          );
        case "oldest":
          return (
            new Date(a.paymentDate || a.createdAt || "").getTime() -
            new Date(b.paymentDate || b.createdAt || "").getTime()
          );
        case "amount-high":
          return (
            Number(b.booking?.totalAmount || b.amount || 0) -
            Number(a.booking?.totalAmount || a.amount || 0)
          );
        case "amount-low":
          return (
            Number(a.booking?.totalAmount || a.amount || 0) -
            Number(b.booking?.totalAmount || b.amount || 0)
          );
        case "status":
          return a.paymentStatus.localeCompare(b.paymentStatus);
        default:
          return 0;
      }
    });

    return filtered;
  }, [payments, searchTerm, statusFilter, methodFilter, sortBy]);

  // Pagination
  const totalItems = filteredPayments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Statistics
  const stats = useMemo(() => {
    // Calculate total amount for completed payments using booking.totalAmount
    const totalAmount = payments.reduce(
      (sum: number, payment: PaymentDataTypes) => {
        const isCompleted = payment.paymentStatus.toLowerCase() === "completed";
        // Use booking.totalAmount instead of payment.amount for the actual booking total
        const bookingAmount = Number(
          payment.booking?.totalAmount || payment.amount || 0
        );

        return isCompleted ? sum + bookingAmount : sum;
      },
      0
    );

    // Count by status (case insensitive)
    const completedCount = payments.filter(
      (p: PaymentDataTypes) => p.paymentStatus.toLowerCase() === "completed"
    ).length;
    const pendingCount = payments.filter(
      (p: PaymentDataTypes) => p.paymentStatus.toLowerCase() === "pending"
    ).length;
    const failedCount = payments.filter(
      (p: PaymentDataTypes) => p.paymentStatus.toLowerCase() === "failed"
    ).length;
    const refundedCount = payments.filter(
      (p: PaymentDataTypes) => p.paymentStatus.toLowerCase() === "refunded"
    ).length;

    return {
      totalAmount,
      completedCount,
      pendingCount,
      failedCount,
      refundedCount,
    };
  }, [payments]);

  // Modal handlers
  const openModal = (payment: PaymentDataTypes) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPayment(null);
    setIsModalOpen(false);
  };

  // Utility functions
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="text-green-500" size={16} />;
      case "pending":
        return <Clock className="text-yellow-500" size={16} />;
      case "failed":
        return <XCircle className="text-red-500" size={16} />;
      case "refunded":
        return <RefreshCw className="text-blue-500" size={16} />;
      default:
        return <AlertCircle className="text-gray-500" size={16} />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "refunded":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(Number(amount));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Export functionality
  const handleExportPayments = () => {
    const csvContent = [
      [
        "Payment ID",
        "User",
        "Event",
        "Amount",
        "Method",
        "Status",
        "Date",
      ].join(","),
      ...filteredPayments.map((payment: PaymentDataTypes) =>
        [
          payment.paymentId,
          `${payment.booking?.user?.firstName || "N/A"} ${
            payment.booking?.user?.lastName || ""
          }`,
          payment.booking?.event?.eventTitle || "N/A",
          Number(
            payment.booking?.totalAmount || payment.amount || 0
          ).toLocaleString(),
          payment.paymentMethod,
          payment.paymentStatus,
          formatDate(payment.paymentDate || payment.createdAt || ""),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Payments exported successfully!");
  };

  // Admin Actions
  const handleUpdatePaymentStatus = async (
    paymentId: number,
    newStatus: string,
    currentStatus: string
  ) => {
    const result = await Swal.fire({
      title: "Update Payment Status?",
      text: `Change payment status from "${currentStatus}" to "${newStatus}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await updatePaymentStatus({
          paymentId,
          paymentStatus: newStatus,
        }).unwrap();

        await Swal.fire({
          title: "Success!",
          text: "Payment status updated successfully!",
          icon: "success",
          confirmButtonColor: "#2563eb",
        });

        toast.success("Payment status updated successfully!");
        refetchPayments();
      } catch (error: unknown) {
        const errorMessage =
          error && typeof error === "object" && "data" in error
            ? (error.data as { error?: string })?.error ||
              "Failed to update payment status."
            : "Failed to update payment status.";

        await Swal.fire({
          title: "Error!",
          text: errorMessage,
          icon: "error",
          confirmButtonColor: "#2563eb",
        });
      }
    }
  };

  const handleMarkAsCompleted = (payment: PaymentDataTypes) => {
    if (payment.paymentStatus === "Completed") {
      toast.info("Payment is already completed!");
      return;
    }
    handleUpdatePaymentStatus(
      payment.paymentId,
      "Completed",
      payment.paymentStatus
    );
  };

  const handleMarkAsFailed = (payment: PaymentDataTypes) => {
    if (payment.paymentStatus === "Failed") {
      toast.info("Payment is already marked as failed!");
      return;
    }
    handleUpdatePaymentStatus(
      payment.paymentId,
      "Failed",
      payment.paymentStatus
    );
  };

  const handleRefundPayment = (payment: PaymentDataTypes) => {
    if (payment.paymentStatus === "Refunded") {
      toast.info("Payment is already refunded!");
      return;
    }
    if (payment.paymentStatus !== "Completed") {
      toast.error("Only completed payments can be refunded!");
      return;
    }
    handleUpdatePaymentStatus(
      payment.paymentId,
      "Refunded",
      payment.paymentStatus
    );
  };

  if (paymentsLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading payments...</span>
        </div>
      </div>
    );
  }

  if (paymentsError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <X size={20} />
            <span className="font-medium">Error loading payments</span>
          </div>
          <p className="text-red-600 text-sm mt-1">
            Failed to fetch payments. Please try again.
          </p>
          <div className="mt-2 text-xs text-red-500">
            <p>Error details: {JSON.stringify(paymentsError)}</p>
          </div>
          <button
            onClick={() => refetchPayments()}
            className="mt-3 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="text-blue-600" size={32} />
            Payments Management
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor and manage all payment transactions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPayments}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={16} />
            Export CSV
          </button>
          <button
            onClick={() => refetchPayments()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                {paymentsLoading
                  ? "Loading..."
                  : formatCurrency(stats.totalAmount)}
              </p>
            </div>
            <DollarSign className="text-green-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {paymentsLoading ? "..." : stats.completedCount}
              </p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {paymentsLoading ? "..." : stats.pendingCount}
              </p>
            </div>
            <Clock className="text-yellow-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Failed/Refunded</p>
              <p className="text-2xl font-bold text-red-600">
                {paymentsLoading
                  ? "..."
                  : stats.failedCount + stats.refundedCount}
              </p>
            </div>
            <XCircle className="text-red-500" size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by payment ID, user name, email, or event..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <ChevronDown
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>

          {/* Method Filter */}
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
            >
              <option value="all">All Methods</option>
              <option value="mpesa">M-Pesa</option>
              <option value="card">Card</option>
              <option value="bank">Bank Transfer</option>
              <option value="cash">Cash</option>
            </select>
            <ChevronDown
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-high">Amount (High to Low)</option>
              <option value="amount-low">Amount (Low to High)</option>
              <option value="status">Status</option>
            </select>
            <ChevronDown
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredPayments.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No payments found
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all" || methodFilter !== "all"
                ? "Try adjusting your search criteria."
                : "No payments have been made yet."}
            </p>
            {/* Debug info */}
            <div className="mt-4 text-sm text-gray-500">
              <p>Total payments: {payments.length}</p>
              <p>Filtered payments: {filteredPayments.length}</p>
              <p>Loading: {paymentsLoading ? "Yes" : "No"}</p>
              <p>Error: {paymentsError ? "Yes" : "No"}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Payment ID
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      User
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Event
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Method
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedPayments.map((payment: PaymentDataTypes) => (
                    <tr
                      key={payment.paymentId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">
                          #{payment.paymentId}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {payment.booking?.user?.firstName || "N/A"}{" "}
                              {payment.booking?.user?.lastName || ""}
                            </div>
                            <div className="text-sm text-gray-500">
                              {payment.booking?.user?.email || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Ticket size={16} className="text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {payment.booking?.event?.eventTitle || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {payment.booking?.quantity || 0} tickets
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(
                            Number(
                              payment.booking?.totalAmount ||
                                payment.amount ||
                                0
                            )
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {payment.booking?.quantity || 0} tickets
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-900 capitalize">
                          {payment.paymentMethod}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusClass(
                            payment.paymentStatus
                          )}`}
                        >
                          {getStatusIcon(payment.paymentStatus)}
                          {payment.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-900">
                          {formatDate(
                            payment.paymentDate || payment.createdAt || ""
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap items-center gap-1">
                          {/* View Button */}
                          <button
                            onClick={() => openModal(payment)}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye size={12} />
                            View
                          </button>

                          {/* Status-based Actions */}
                          {payment.paymentStatus === "Pending" && (
                            <>
                              <button
                                onClick={() => handleMarkAsCompleted(payment)}
                                className="flex items-center gap-1 px-2 py-1 text-xs text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Mark as Completed"
                                disabled={isUpdatingStatus}
                              >
                                <Check size={12} />
                                Complete
                              </button>
                              <button
                                onClick={() => handleMarkAsFailed(payment)}
                                className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Mark as Failed"
                                disabled={isUpdatingStatus}
                              >
                                <Ban size={12} />
                                Fail
                              </button>
                            </>
                          )}

                          {payment.paymentStatus === "Completed" && (
                            <button
                              onClick={() => handleRefundPayment(payment)}
                              className="flex items-center gap-1 px-2 py-1 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Refund Payment"
                              disabled={isUpdatingStatus}
                            >
                              <RotateCcw size={12} />
                              Refund
                            </button>
                          )}

                          {payment.paymentStatus === "Failed" && (
                            <button
                              onClick={() => handleMarkAsCompleted(payment)}
                              className="flex items-center gap-1 px-2 py-1 text-xs text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Mark as Completed"
                              disabled={isUpdatingStatus}
                            >
                              <Check size={12} />
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden">
              <div className="divide-y divide-gray-200">
                {paginatedPayments.map((payment: PaymentDataTypes) => (
                  <div
                    key={payment.paymentId}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Payment Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} className="text-blue-500" />
                        <span className="font-medium text-gray-900">
                          #{payment.paymentId}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusClass(
                          payment.paymentStatus
                        )}`}
                      >
                        {getStatusIcon(payment.paymentStatus)}
                        {payment.paymentStatus}
                      </span>
                    </div>

                    {/* Payment Details */}
                    <div className="space-y-2 mb-3">
                      {/* User Info */}
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-gray-400" />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">
                            {payment.booking?.user?.firstName || "N/A"}{" "}
                            {payment.booking?.user?.lastName || ""}
                          </div>
                          <div className="text-xs text-gray-500">
                            {payment.booking?.user?.email || "N/A"}
                          </div>
                        </div>
                      </div>

                      {/* Event Info */}
                      <div className="flex items-center gap-2">
                        <Ticket size={14} className="text-gray-400" />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">
                            {payment.booking?.event?.eventTitle || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {payment.booking?.quantity || 0} tickets
                          </div>
                        </div>
                      </div>

                      {/* Amount & Method */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign size={14} className="text-green-500" />
                          <div className="font-semibold text-gray-900">
                            {formatCurrency(
                              Number(
                                payment.booking?.totalAmount ||
                                  payment.amount ||
                                  0
                              )
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 capitalize">
                          {payment.paymentMethod}
                        </div>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gray-400" />
                        <div className="text-sm text-gray-600">
                          {formatDate(
                            payment.paymentDate || payment.createdAt || ""
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => openModal(payment)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex-1 justify-center border border-blue-200"
                      >
                        <Eye size={12} />
                        View
                      </button>

                      {payment.paymentStatus === "Pending" && (
                        <>
                          <button
                            onClick={() => handleMarkAsCompleted(payment)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors flex-1 justify-center border border-green-200"
                            disabled={isUpdatingStatus}
                          >
                            <Check size={12} />
                            Complete
                          </button>
                          <button
                            onClick={() => handleMarkAsFailed(payment)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex-1 justify-center border border-red-200"
                            disabled={isUpdatingStatus}
                          >
                            <Ban size={12} />
                            Fail
                          </button>
                        </>
                      )}

                      {payment.paymentStatus === "Completed" && (
                        <button
                          onClick={() => handleRefundPayment(payment)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors flex-1 justify-center border border-orange-200"
                          disabled={isUpdatingStatus}
                        >
                          <RotateCcw size={12} />
                          Refund
                        </button>
                      )}

                      {payment.paymentStatus === "Failed" && (
                        <button
                          onClick={() => handleMarkAsCompleted(payment)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors flex-1 justify-center border border-green-200"
                          disabled={isUpdatingStatus}
                        >
                          <Check size={12} />
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(startIndex + itemsPerPage, totalItems)} of{" "}
                    {totalItems} results
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 text-sm border rounded ${
                          currentPage === i + 1
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Payment Details Modal */}
      {isModalOpen && selectedPayment && (
        <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Payment Details - #{selectedPayment.paymentId}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <CreditCard size={20} />
                    Payment Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment ID:</span>
                      <span className="font-medium">
                        #{selectedPayment.paymentId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking ID:</span>
                      <span className="font-medium">
                        #{selectedPayment.bookingId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(Number(selectedPayment.amount || 0))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method:</span>
                      <span className="font-medium capitalize">
                        {selectedPayment.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusClass(
                          selectedPayment.paymentStatus
                        )}`}
                      >
                        {getStatusIcon(selectedPayment.paymentStatus)}
                        {selectedPayment.paymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Date:</span>
                      <span className="font-medium">
                        {formatDate(
                          selectedPayment.paymentDate ||
                            selectedPayment.createdAt ||
                            ""
                        )}
                      </span>
                    </div>
                    {selectedPayment.transactionId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-medium font-mono text-sm">
                          {selectedPayment.transactionId}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* User Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <User size={20} />
                    Customer Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">
                        {selectedPayment.booking?.user?.firstName || "N/A"}{" "}
                        {selectedPayment.booking?.user?.lastName || ""}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">
                        {selectedPayment.booking?.user?.email || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">
                        {selectedPayment.booking?.user?.contactPhone || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">User ID:</span>
                      <span className="font-medium">
                        #{selectedPayment.booking?.user?.userId || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Event & Booking Information */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Ticket size={20} />
                    Event & Booking Details
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Event:</span>
                          <span className="font-medium">
                            {selectedPayment.booking?.event?.eventTitle ||
                              "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium">
                            {selectedPayment.booking?.event?.category || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Event Date:</span>
                          <span className="font-medium">
                            {selectedPayment.booking?.event?.eventDate
                              ? formatDate(
                                  selectedPayment.booking.event.eventDate
                                )
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Event Time:</span>
                          <span className="font-medium">
                            {selectedPayment.booking?.event?.eventTime || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tickets Booked:</span>
                          <span className="font-medium">
                            {selectedPayment.booking?.quantity || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ticket Price:</span>
                          <span className="font-medium">
                            {selectedPayment.booking?.event?.ticketPrice
                              ? formatCurrency(
                                  Number(
                                    selectedPayment.booking.event.ticketPrice
                                  )
                                )
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-bold text-green-600">
                            {selectedPayment.booking?.totalAmount
                              ? formatCurrency(
                                  Number(selectedPayment.booking.totalAmount)
                                )
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Booking Status:</span>
                          <span className="font-medium">
                            {selectedPayment.booking?.bookingStatus || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Venue Information */}
                    {selectedPayment.booking?.event?.venue && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-3">
                          Venue Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Venue:</span>
                            <span className="font-medium">
                              {selectedPayment.booking.event.venue.venueName ||
                                "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Capacity:</span>
                            <span className="font-medium">
                              {selectedPayment.booking.event.venue
                                .venueCapacity || "N/A"}
                            </span>
                          </div>
                        </div>
                        {selectedPayment.booking.event.venue.venueAddress && (
                          <div className="mt-3 flex items-start gap-2 text-gray-600">
                            <User size={16} className="mt-0.5" />
                            <span className="text-sm">
                              {selectedPayment.booking.event.venue.venueAddress}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200">
              <div className="flex items-center gap-2">
                {/* Admin Quick Actions */}
                {selectedPayment.paymentStatus === "Pending" && (
                  <>
                    <button
                      onClick={() => handleMarkAsCompleted(selectedPayment)}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                      disabled={isUpdatingStatus}
                    >
                      {isUpdatingStatus ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Check size={16} />
                      )}
                      Mark Completed
                    </button>
                    <button
                      onClick={() => handleMarkAsFailed(selectedPayment)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
                      disabled={isUpdatingStatus}
                    >
                      <Ban size={16} />
                      Mark Failed
                    </button>
                  </>
                )}

                {selectedPayment.paymentStatus === "Completed" && (
                  <button
                    onClick={() => handleRefundPayment(selectedPayment)}
                    className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 text-sm"
                    disabled={isUpdatingStatus}
                  >
                    {isUpdatingStatus ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <RotateCcw size={16} />
                    )}
                    Process Refund
                  </button>
                )}

                {selectedPayment.paymentStatus === "Failed" && (
                  <button
                    onClick={() => handleMarkAsCompleted(selectedPayment)}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                    disabled={isUpdatingStatus}
                  >
                    {isUpdatingStatus ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Check size={16} />
                    )}
                    Mark Completed
                  </button>
                )}
              </div>

              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        expand={true}
        toastOptions={{
          duration: 4000,
          style: {
            fontSize: "14px",
            fontWeight: "500",
            padding: "12px 16px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
        }}
      />
    </div>
  );
};
