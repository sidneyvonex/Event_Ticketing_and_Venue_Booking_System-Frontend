import { useState, useMemo, useCallback } from "react";
import { toast, Toaster } from "sonner";
import { useSelector } from "react-redux";
import {
  MessageSquare,
  Eye,
  Search,
  ChevronDown,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  Download,
  RefreshCw,
  X,
  Mail,
  MessageCircle,
  Send,
  UserCheck,
  BellRing,
  ArrowRight,
  Zap,
} from "lucide-react";
import {
  useGetAllSupportTicketsQuery,
  useUpdateSupportTicketMutation,
  useAddSupportTicketResponseMutation,
  useGetSupportTicketWithResponsesQuery,
} from "../../Features/api/SupportTicketApi";
import type {
  SupportTicketDataTypes,
  SupportTicketResponseTypes,
} from "../../types/types";
import type { RootState } from "../../Features/app/store";
import Swal from "sweetalert2";

export const AllSupportTickets = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedTicket, setSelectedTicket] =
    useState<SupportTicketDataTypes | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Chat/Response state
  const [responseMessage, setResponseMessage] = useState("");
  const [isRespondingMode, setIsRespondingMode] = useState(false);

  // API hooks
  const {
    data: ticketsResponse = [],
    isLoading: ticketsLoading,
    error: ticketsError,
    refetch: refetchTickets,
  } = useGetAllSupportTicketsQuery({});

  // Handle different possible response structures
  const tickets = useMemo(() => {
    if (!ticketsResponse) return [];

    // If it's an array, return it directly
    if (Array.isArray(ticketsResponse)) {
      return ticketsResponse;
    }

    // If it's an object with data property
    if (ticketsResponse && typeof ticketsResponse === 'object' && 'data' in ticketsResponse) {
      return Array.isArray(ticketsResponse.data) ? ticketsResponse.data : [];
    }

    // If it's an object with tickets property
    if (ticketsResponse && typeof ticketsResponse === 'object' && 'tickets' in ticketsResponse) {
      return Array.isArray(ticketsResponse.tickets) ? ticketsResponse.tickets : [];
    }

    // If it's a single ticket object, wrap it in an array
    if (ticketsResponse && typeof ticketsResponse === 'object' && 'ticketId' in ticketsResponse) {
      return [ticketsResponse];
    }

    return [];
  }, [ticketsResponse]);

  const [updateTicketStatus, { isLoading: isUpdatingStatus }] =
    useUpdateSupportTicketMutation();

  const [addResponse, { isLoading: isAddingResponse }] =
    useAddSupportTicketResponseMutation();

  // Get detailed ticket with responses when modal is open
  const {
    data: ticketWithResponses,
    isLoading: isLoadingResponses,
    refetch: refetchTicketResponses,
  } = useGetSupportTicketWithResponsesQuery(selectedTicket?.ticketId || 0, {
    skip: !selectedTicket || !isModalOpen,
  });

  // Utility functions
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

  const hasUnreadMessages = useCallback((ticket: SupportTicketDataTypes) => {
    if (!ticket.responses || ticket.responses.length === 0) {
      return ticket.supportTicketStatus === "Open";
    }

    const sortedResponses = [...ticket.responses].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const lastResponse = sortedResponses[sortedResponses.length - 1];
    return lastResponse?.responderType === "user";
  }, []);

  const getUnreadMessageCount = useCallback(
    (ticket: SupportTicketDataTypes) => {
      if (!ticket.responses || ticket.responses.length === 0) {
        return ticket.supportTicketStatus === "Open" ? 1 : 0;
      }

      const sortedResponses = [...ticket.responses].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      let unreadCount = 0;
      for (let i = sortedResponses.length - 1; i >= 0; i--) {
        if (sortedResponses[i].responderType === "user") {
          unreadCount++;
        } else {
          break;
        }
      }

      return unreadCount;
    },
    []
  );

  const needsAttention = useCallback(
    (ticket: SupportTicketDataTypes) => {
      const hasUnread = hasUnreadMessages(ticket);
      const isOld =
        new Date().getTime() - new Date(ticket.createdAt).getTime() >
        24 * 60 * 60 * 1000;
      return hasUnread && (ticket.supportTicketStatus === "Open" || isOld);
    },
    [hasUnreadMessages]
  );

  // 1. Update getStatusIcon to keep only icon color, not badge background
  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open":
        return <AlertTriangle className="text-blue-400" size={16} />;
      case "in progress":
        return <Clock className="text-blue-400" size={16} />;
      case "resolved":
        return <CheckCircle className="text-green-400" size={16} />;
      case "closed":
        return <XCircle className="text-gray-400" size={16} />;
      default:
        return <MessageSquare className="text-gray-400" size={16} />;
    }
  };

  // 2. Update getStatusClass to use neutral badge backgrounds
  const getStatusClass = (status: string) => {
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Filter and search tickets
  const filteredTickets = useMemo(() => {
    let filtered = [...tickets];

    if (searchTerm) {
      filtered = filtered.filter((ticket: SupportTicketDataTypes) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          ticket.ticketId?.toString().includes(searchLower) ||
          ticket.user?.firstName?.toLowerCase().includes(searchLower) ||
          ticket.user?.lastName?.toLowerCase().includes(searchLower) ||
          ticket.user?.email?.toLowerCase().includes(searchLower) ||
          ticket.subject?.toLowerCase().includes(searchLower) ||
          ticket.description?.toLowerCase().includes(searchLower) ||
          ticket.category?.toLowerCase().includes(searchLower)
        );
      });
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (ticket: SupportTicketDataTypes) =>
          ticket.supportTicketStatus?.toLowerCase() ===
          statusFilter.toLowerCase()
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (ticket: SupportTicketDataTypes) =>
          ticket.category?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    filtered.sort((a: SupportTicketDataTypes, b: SupportTicketDataTypes) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt || "").getTime() -
            new Date(a.createdAt || "").getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt || "").getTime() -
            new Date(b.createdAt || "").getTime()
          );
        case "status":
          return (a.supportTicketStatus || "").localeCompare(
            b.supportTicketStatus || ""
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [tickets, searchTerm, statusFilter, categoryFilter, sortBy]);

  // Pagination
  const totalItems = filteredTickets.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTickets = filteredTickets.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Statistics
  const stats = useMemo(() => {
    const totalTickets = tickets.length;
    const openCount = tickets.filter(
      (t: SupportTicketDataTypes) =>
        t.supportTicketStatus?.toLowerCase() === "open"
    ).length;
    const inProgressCount = tickets.filter(
      (t: SupportTicketDataTypes) =>
        t.supportTicketStatus?.toLowerCase() === "in progress"
    ).length;
    const resolvedCount = tickets.filter(
      (t: SupportTicketDataTypes) =>
        t.supportTicketStatus?.toLowerCase() === "resolved"
    ).length;
    const closedCount = tickets.filter(
      (t: SupportTicketDataTypes) =>
        t.supportTicketStatus?.toLowerCase() === "closed"
    ).length;

    const unreadCount = tickets.filter((t: SupportTicketDataTypes) =>
      hasUnreadMessages(t)
    ).length;

    const urgentCount = tickets.filter((t: SupportTicketDataTypes) =>
      needsAttention(t)
    ).length;

    return {
      totalTickets,
      openCount,
      inProgressCount,
      resolvedCount,
      closedCount,
      unreadCount,
      urgentCount,
    };
  }, [tickets, hasUnreadMessages, needsAttention]);

  // Modal handlers
  const openModal = (ticket: SupportTicketDataTypes) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTicket(null);
    setIsModalOpen(false);
    setIsRespondingMode(false);
    setResponseMessage("");
  };

  // Get current user from auth state
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Handle adding a response to a ticket
  const handleAddResponse = async () => {
    if (!selectedTicket || !responseMessage.trim()) {
      toast.error("Please enter a response message");
      return;
    }

    if (!currentUser?.userId) {
      toast.error("User authentication required");
      return;
    }

    try {
      await addResponse({
        ticketId: selectedTicket.ticketId,
        responderId: currentUser.userId,
        responderType: "admin",
        message: responseMessage.trim(),
      }).unwrap();

      toast.success("Response added successfully!");
      setResponseMessage("");
      refetchTicketResponses();

      if (selectedTicket.supportTicketStatus === "Open") {
        await handleUpdateTicketStatus(
          selectedTicket.ticketId,
          "In Progress",
          selectedTicket.supportTicketStatus,
          false
        );
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error.data as { error?: string })?.error ||
            "Failed to add response."
          : "Failed to add response.";
      toast.error(errorMessage);
    }
  };

  const handleStartResponding = () => {
    setIsRespondingMode(true);
  };

  const handleCancelResponding = () => {
    setIsRespondingMode(false);
    setResponseMessage("");
  };

  // Export functionality
  const handleExportTickets = () => {
    const csvContent = [
      [
        "Ticket ID",
        "User",
        "Email",
        "Subject",
        "Category",
        "Status",
        "Created Date",
      ].join(","),
      ...filteredTickets.map((ticket: SupportTicketDataTypes) =>
        [
          ticket.ticketId,
          `${ticket.user?.firstName || "N/A"} ${ticket.user?.lastName || ""}`,
          ticket.user?.email || "N/A",
          `"${ticket.subject || ""}"`,
          ticket.category || "N/A",
          ticket.supportTicketStatus || "N/A",
          formatDate(ticket.createdAt || ""),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `support-tickets-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Support tickets exported successfully!");
  };

  // Admin Actions
  const handleUpdateTicketStatus = async (
    ticketId: number,
    newStatus: string,
    currentStatus: string,
    showConfirmation: boolean = true
  ) => {
    if (showConfirmation) {
      const result = await Swal.fire({
        title: "Update Ticket Status?",
        text: `Change ticket status from "${currentStatus}" to "${newStatus}"?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#2563eb",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) return;
    }

    try {
      await updateTicketStatus({
        ticketId,
        supportTicketStatus: newStatus,
      }).unwrap();

      if (showConfirmation) {
        await Swal.fire({
          title: "Success!",
          text: "Ticket status updated successfully!",
          icon: "success",
          confirmButtonColor: "#2563eb",
        });
      }

      toast.success("Ticket status updated successfully!");
      refetchTickets();

      if (selectedTicket && selectedTicket.ticketId === ticketId) {
        refetchTicketResponses();
      }
    } catch (error: unknown) {
      console.error("Update ticket status error:", error);
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error.data as { error?: string })?.error ||
            "Failed to update ticket status."
          : "Failed to update ticket status.";

      if (showConfirmation) {
        await Swal.fire({
          title: "Error!",
          text: errorMessage,
          icon: "error",
          confirmButtonColor: "#2563eb",
        });
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleMarkAsInProgress = (ticket: SupportTicketDataTypes) => {
    if (ticket.supportTicketStatus === "In Progress") {
      toast.info("Ticket is already in progress!");
      return;
    }
    handleUpdateTicketStatus(
      ticket.ticketId,
      "In Progress",
      ticket.supportTicketStatus || "Open"
    );
  };

  const handleMarkAsResolved = (ticket: SupportTicketDataTypes) => {
    if (ticket.supportTicketStatus === "Resolved") {
      toast.info("Ticket is already resolved!");
      return;
    }
    handleUpdateTicketStatus(
      ticket.ticketId,
      "Resolved",
      ticket.supportTicketStatus || "Open"
    );
  };

  const handleMarkAsClosed = (ticket: SupportTicketDataTypes) => {
    if (ticket.supportTicketStatus === "Closed") {
      toast.info("Ticket is already closed!");
      return;
    }
    handleUpdateTicketStatus(
      ticket.ticketId,
      "Closed",
      ticket.supportTicketStatus || "Open"
    );
  };

  if (ticketsLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading support tickets...</span>
        </div>
      </div>
    );
  }

  if (ticketsError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <X size={20} />
            <span className="font-medium">Error loading support tickets</span>
          </div>
          <p className="text-red-600 text-sm mt-1">
            Failed to fetch support tickets. Please try again.
          </p>
          <div className="mt-2 text-xs text-red-500">
            <p>Error details: {JSON.stringify(ticketsError)}</p>
          </div>
          <button
            onClick={() => refetchTickets()}
            className="mt-3 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" flex-1 overflow-x-hidden p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="text-blue-600" size={32} />
            Support Tickets Management
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor and manage all customer support requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportTickets}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={16} />
            Export CSV
          </button>
          <button
            onClick={() => refetchTickets()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={ticketsLoading}
          >
            <RefreshCw
              size={16}
              className={ticketsLoading ? "animate-spin" : ""}
            />
            {ticketsLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tickets</p>
              <p className="text-2xl font-bold text-blue-600">
                {ticketsLoading ? "..." : stats.totalTickets}
              </p>
            </div>
            <MessageSquare className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-orange-200 bg-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600">Open</p>
              <p className="text-2xl font-bold text-orange-600">
                {ticketsLoading ? "..." : stats.openCount}
              </p>
            </div>
            <AlertTriangle className="text-orange-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-blue-200 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {ticketsLoading ? "..." : stats.inProgressCount}
              </p>
            </div>
            <Clock className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-green-200 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">
                {ticketsLoading ? "..." : stats.resolvedCount}
              </p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-red-200 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Unread Messages</p>
              <p className="text-2xl font-bold text-red-600">
                {ticketsLoading ? "..." : stats.unreadCount}
              </p>
            </div>
            <div className="relative">
              <BellRing className="text-red-500" size={24} />
              {stats.unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-yellow-200 bg-yellow-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Needs Attention</p>
              <p className="text-2xl font-bold text-yellow-600">
                {ticketsLoading ? "..." : stats.urgentCount}
              </p>
            </div>
            <Zap className="text-yellow-500" size={24} />
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
              placeholder="Search by ticket ID, user name, email, subject, description, or category..."
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
              <option value="open">Open</option>
              <option value="in progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <ChevronDown
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="general">General</option>
              <option value="feature request">Feature Request</option>
              <option value="bug report">Bug Report</option>
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
              <option value="status">Status</option>
            </select>
            <ChevronDown
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>
        </div>
      </div>

      {/* Support Tickets Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredTickets.length === 0 ? (
          <div className="p-12 text-center ">
            <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No support tickets found
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                ? "Try adjusting your search criteria."
                : "No support tickets have been submitted yet."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <div className="min-w-[1024px]">
                <table className="w-full ">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Ticket ID
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        User
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Subject
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Created
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedTickets.map((ticket: SupportTicketDataTypes) => (
                      <tr
                        key={ticket.ticketId}
                        className={`transition-colors ${
                          hasUnreadMessages(ticket)
                            ? "bg-gray-50 hover:bg-gray-100" // Subtle highlight for unread
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              #{ticket.ticketId}
                            </span>
                            {hasUnreadMessages(ticket) && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 shadow align-middle">
                                {getUnreadMessageCount(ticket)} new
                              </span>
                            )}
                            {needsAttention(ticket) && (
                              <div title="Needs immediate attention">
                                <Zap className="text-yellow-500" size={16} />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <User size={16} className="text-gray-400" />
                            <div>
                              <div className="font-medium text-gray-900">
                                {ticket.user?.firstName || "N/A"}{" "}
                                {ticket.user?.lastName || ""}
                              </div>
                              <div className="text-sm text-gray-500">
                                {ticket.user?.email || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900 max-w-xs truncate">
                            {ticket.subject || "N/A"}
                          </div>
                          {hasUnreadMessages(ticket) && (
                            <div className="flex items-center gap-1 text-xs text-red-600 font-medium mt-1">
                              <BellRing size={12} />
                              New message waiting for response
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-gray-900 capitalize">
                            {ticket.category || "N/A"}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusClass(
                              ticket.supportTicketStatus || ""
                            )}`}
                          >
                            {getStatusIcon(ticket.supportTicketStatus || "")}
                            {ticket.supportTicketStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-gray-900 text-sm">
                            {formatDate(ticket.createdAt || "")}
                          </div>
                        </td>
                        <td className="py-3 px-4 min-w-[180px] max-w-[260px] align-top">
                          <div className="flex flex-wrap items-center gap-1 min-w-0">
                            <button
                              onClick={() => openModal(ticket)}
                              className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full shadow transition-all truncate max-w-[120px] bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400`}
                              title={hasUnreadMessages(ticket) ? "View new messages" : "View details"}
                            >
                              {hasUnreadMessages(ticket) ? (
                                <>
                                  <span className="truncate">Reply</span>
                                  {getUnreadMessageCount(ticket) > 0 && (
                                    <span className="ml-1 bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full font-bold truncate shadow align-middle">
                                      {getUnreadMessageCount(ticket)}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <>
                                  <span className="truncate">View</span>
                                </>
                              )}
                            </button>
                            {ticket.supportTicketStatus === "Open" && (
                              <button
                                onClick={() => handleMarkAsInProgress(ticket)}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-full shadow bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-2 focus:ring-blue-200 truncate max-w-[90px]"
                                title="Mark as In Progress"
                                disabled={isUpdatingStatus}
                              >
                                <ArrowRight size={12} />
                                <span className="hidden sm:inline truncate">
                                  Progress
                                </span>
                              </button>
                            )}
                            {(ticket.supportTicketStatus === "Open" ||
                              ticket.supportTicketStatus === "In Progress") && (
                              <button
                                onClick={() => handleMarkAsResolved(ticket)}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-full shadow bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-200 truncate max-w-[90px]"
                                title="Mark as Resolved"
                                disabled={isUpdatingStatus}
                              >
                                <CheckCircle size={12} />
                                <span className="hidden sm:inline truncate">
                                  Resolve
                                </span>
                              </button>
                            )}
                            {ticket.supportTicketStatus === "Resolved" && (
                              <button
                                onClick={() => handleMarkAsClosed(ticket)}
                                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-full shadow bg-gray-500 text-white hover:bg-gray-600 focus:ring-2 focus:ring-gray-200 truncate max-w-[90px]"
                                title="Close Ticket"
                                disabled={isUpdatingStatus}
                              >
                                <XCircle size={12} />
                                <span className="hidden sm:inline truncate">
                                  Close
                                </span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden">
              <div className="divide-y divide-gray-200">
                {paginatedTickets.map((ticket: SupportTicketDataTypes) => (
                  <div
                    key={ticket.ticketId}
                    className={`p-4 transition-colors ${
                      hasUnreadMessages(ticket) ? "bg-gray-50 hover:bg-gray-100" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare size={16} className="text-blue-400" />
                        <span className="font-medium text-gray-900">
                          #{ticket.ticketId}
                        </span>
                        {hasUnreadMessages(ticket) && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 shadow align-middle">
                            {getUnreadMessageCount(ticket)} new
                          </span>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusClass(
                          ticket.supportTicketStatus || ""
                        )}`}
                      >
                        {getStatusIcon(ticket.supportTicketStatus || "")}
                        {ticket.supportTicketStatus}
                      </span>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-gray-400" />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">
                            {ticket.user?.firstName || "N/A"} {ticket.user?.lastName || ""}
                          </div>
                          <div className="text-xs text-gray-500">
                            {ticket.user?.email || "N/A"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MessageCircle size={14} className="text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">
                            {ticket.subject || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {ticket.category || "N/A"}
                          </div>
                          {hasUnreadMessages(ticket) && (
                            <div className="flex items-center gap-1 text-xs text-blue-700 font-semibold mt-1">
                              <BellRing size={12} />
                              New message waiting for response
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        <div className="text-sm text-gray-600">
                          {formatDate(ticket.createdAt || "")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100 flex-wrap">
                      <button
                        onClick={() => openModal(ticket)}
                        className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full shadow transition-all flex-1 justify-center truncate max-w-[120px] bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400`}
                      >
                        <Eye size={12} />
                        {hasUnreadMessages(ticket) ? "Reply" : "View"}
                      </button>
                      {ticket.supportTicketStatus === "Open" && (
                        <button
                          onClick={() => handleMarkAsInProgress(ticket)}
                          className="flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-full shadow bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-2 focus:ring-blue-200 flex-1 justify-center truncate max-w-[90px]"
                          disabled={isUpdatingStatus}
                        >
                          <Clock size={12} />
                          Progress
                        </button>
                      )}
                      {(ticket.supportTicketStatus === "Open" || ticket.supportTicketStatus === "In Progress") && (
                        <button
                          onClick={() => handleMarkAsResolved(ticket)}
                          className="flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-full shadow bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-200 flex-1 justify-center truncate max-w-[90px]"
                          disabled={isUpdatingStatus}
                        >
                          <CheckCircle size={12} />
                          Resolve
                        </button>
                      )}
                      {ticket.supportTicketStatus === "Resolved" && (
                        <button
                          onClick={() => handleMarkAsClosed(ticket)}
                          className="flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-full shadow bg-gray-500 text-white hover:bg-gray-600 focus:ring-2 focus:ring-gray-200 flex-1 justify-center truncate max-w-[90px]"
                          disabled={isUpdatingStatus}
                        >
                          <XCircle size={12} />
                          Close
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

      {/* Modal Backdrop */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-40 z-40"></div>
      )}
      {/* Modal Container */}
      {isModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="relative w-full max-w-lg sm:max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col sm:flex-row max-h-[90vh] overflow-y-auto">
            {/* Close button at top left */}
            <button
              onClick={closeModal}
              className="absolute top-4 left-4 z-50 bg-gray-100 rounded-full p-2 shadow hover:bg-gray-200 focus:outline-none"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            {/* Left panel: Ticket Info */}
            <div className="w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-gray-200 p-4 sm:p-6 overflow-y-auto max-h-full bg-gray-50">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <MessageSquare className="text-blue-600" size={24} />
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                      Support Ticket #{selectedTicket.ticketId}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Created {formatDate(selectedTicket.createdAt || "")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full border ${getStatusClass(
                      selectedTicket.supportTicketStatus || ""
                    )}`}
                  >
                    {getStatusIcon(selectedTicket.supportTicketStatus || "")}
                    {selectedTicket.supportTicketStatus}
                  </span>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="space-y-6">
                {/* Original Ticket */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Original Request
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Subject
                      </label>
                      <p className="text-gray-900 mt-1 font-medium">
                        {selectedTicket.subject || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Category
                      </label>
                      <p className="text-gray-900 mt-1 capitalize">
                        {selectedTicket.category || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Initial Message
                      </label>
                      <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg">
                        <p className="text-gray-900 text-sm whitespace-pre-wrap">
                          {selectedTicket.description ||
                            "No message provided."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Customer Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedTicket.user?.firstName || "N/A"}{" "}
                          {selectedTicket.user?.lastName || ""}
                        </p>
                        <p className="text-sm text-gray-600">
                          User ID: #{selectedTicket.userId || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <p className="text-gray-900 break-all text-sm">
                        {selectedTicket.user?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Status Actions
                  </h3>
                  <div className="space-y-2">
                    {selectedTicket.supportTicketStatus === "Open" && (
                      <button
                        onClick={() =>
                          handleUpdateTicketStatus(
                            selectedTicket.ticketId,
                            "In Progress",
                            selectedTicket.supportTicketStatus
                          )
                        }
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        disabled={isUpdatingStatus}
                      >
                        <Clock size={16} />
                        Mark as In Progress
                      </button>
                    )}

                    {(selectedTicket.supportTicketStatus === "Open" ||
                      selectedTicket.supportTicketStatus ===
                        "In Progress") && (
                      <button
                        onClick={() =>
                          handleUpdateTicketStatus(
                            selectedTicket.ticketId,
                            "Resolved",
                            selectedTicket.supportTicketStatus
                          )
                        }
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        disabled={isUpdatingStatus}
                      >
                        <CheckCircle size={16} />
                        Mark as Resolved
                      </button>
                    )}

                    {selectedTicket.supportTicketStatus === "Resolved" && (
                      <button
                        onClick={() =>
                          handleUpdateTicketStatus(
                            selectedTicket.ticketId,
                            "Closed",
                            selectedTicket.supportTicketStatus
                          )
                        }
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                        disabled={isUpdatingStatus}
                      >
                        <XCircle size={16} />
                        Close Ticket
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Divider for mobile */}
            <div className="block sm:hidden h-2 bg-gray-200 w-full"></div>
            {/* Right panel: Chat Interface */}
            <div className="flex-1 flex flex-col h-full bg-white p-2 sm:p-0">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Conversation
                  </h3>
                  {!isRespondingMode &&
                    selectedTicket.supportTicketStatus !== "Closed" && (
                      <button
                        onClick={handleStartResponding}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <MessageCircle size={16} />
                        Respond
                      </button>
                    )}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoadingResponses ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">
                      Loading conversation...
                    </span>
                  </div>
                ) : (
                  <>
                    {/* Original ticket message */}
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User size={16} className="text-gray-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-100 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm text-gray-900">
                              {selectedTicket.user?.firstName}{" "}
                              {selectedTicket.user?.lastName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(selectedTicket.createdAt || "")}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm whitespace-pre-wrap">
                            {selectedTicket.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Responses */}
                    {ticketWithResponses?.responses?.map(
                      (response: SupportTicketResponseTypes) => (
                        <div key={response.responseId} className="flex gap-3">
                          <div className="flex-shrink-0">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                response.responderType === "admin"
                                  ? "bg-blue-100"
                                  : "bg-gray-300"
                              }`}
                            >
                              {response.responderType === "admin" ? (
                                <UserCheck
                                  size={16}
                                  className="text-blue-600"
                                />
                              ) : (
                                <User size={16} className="text-gray-600" />
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div
                              className={`rounded-lg p-3 ${
                                response.responderType === "admin"
                                  ? "bg-blue-50 border border-blue-200"
                                  : "bg-gray-100"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm text-gray-900">
                                  {response.responder?.firstName}{" "}
                                  {response.responder?.lastName}
                                  {response.responderType === "admin" && (
                                    <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                                      Admin
                                    </span>
                                  )}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatDate(response.createdAt)}
                                </span>
                              </div>
                              <p className="text-gray-700 text-sm whitespace-pre-wrap">
                                {response.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    )}

                    {/* Empty state */}
                    {(!ticketWithResponses?.responses ||
                      ticketWithResponses.responses.length === 0) && (
                      <div className="text-center py-8">
                        <MessageCircle
                          className="mx-auto text-gray-300 mb-3"
                          size={48}
                        />
                        <p className="text-gray-500">
                          No responses yet. Start the conversation!
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Response Input */}
              {isRespondingMode &&
                selectedTicket.supportTicketStatus !== "Closed" && (
                  <div className="p-4 border-t border-gray-200 backdrop-blur-sm">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Response
                        </label>
                        <textarea
                          value={responseMessage}
                          onChange={(e) => setResponseMessage(e.target.value)}
                          placeholder="Type your response here..."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={3}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          This will automatically mark the ticket as "In
                          Progress" if it's currently "Open"
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={handleCancelResponding}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleAddResponse}
                            disabled={
                              isAddingResponse || !responseMessage.trim()
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            {isAddingResponse ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <Send size={16} />
                            )}
                            {isAddingResponse
                              ? "Sending..."
                              : "Send Response"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {selectedTicket.supportTicketStatus === "Closed" && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="text-center text-gray-500">
                    <XCircle className="mx-auto mb-2" size={24} />
                    <p className="text-sm">
                      This ticket has been closed. No further responses can be
                      added.
                    </p>
                  </div>
                </div>
              )}
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


