/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../Features/app/store";
import { supportTicketApi } from "../../Features/api/SupportTicketApi";
import type { SupportTicketDataTypes } from "../../types/types";
import { PuffLoader } from "react-spinners";
import { toast } from "sonner";
import {
  MdSupport,
  MdAdd,
  MdFilterList,
  MdSearch,
  MdAccessTime,
  MdMessage,
  MdCheck,
  MdClose,
  MdHourglassEmpty,
} from "react-icons/md";

export const UserSupport = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const userId = user?.userId;

  // Fetch user's support tickets from backend using the specific user endpoint
  const {
    data: userTickets = [],
    isLoading,
    error,
  } = supportTicketApi.useGetSupportTicketsByUserIdQuery(userId, {
    skip: !userId, // Skip the query if userId is not available
  });

  // Create support ticket mutation
  const [createSupport, { isLoading: isCreating }] =
    supportTicketApi.useRegisterSupportTicketMutation();

  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state for creating tickets
  const [formData, setFormData] = useState({
    subject: "",
    category: "General",
    description: "",
  });

  // Filter tickets based on current filters - now working directly with userTickets from API
  const filteredTickets = userTickets.filter(
    (ticket: SupportTicketDataTypes) => {
      const matchesStatus =
        filterStatus === "All" || ticket.supportTicketStatus === filterStatus;
      const matchesCategory =
        filterCategory === "All" || ticket.category === filterCategory;
      const matchesSearch =
        searchTerm === "" ||
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.ticketId.toString().includes(searchTerm);

      return matchesStatus && matchesCategory && matchesSearch;
    }
  );

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const ticketData = {
        subject: formData.subject,
        category: formData.category,
        description: formData.description,
        userId: userId,
        supportTicketStatus: "Open", // Required by backend
      };

      console.log("Creating ticket with data:", ticketData);

      await createSupport(ticketData).unwrap();

      // Success toast
      toast.success(
        "Support ticket created successfully! We'll get back to you soon."
      );

      // Reset form and close modal
      setFormData({
        subject: "",
        category: "General",
        description: "",
      });
      setShowCreateModal(false);
    } catch (error: any) {
      // Error toast
      console.error("Error creating support ticket:", error);
      toast.error(
        error?.data?.message ||
          "Failed to create support ticket. Please try again."
      );
    }
  };

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
      case "Open":
        return "badge badge-error text-white";
      case "In Progress":
        return "badge badge-warning text-white";
      case "Resolved":
        return "badge badge-success text-white";
      case "Closed":
        return "badge badge-neutral text-white";
      default:
        return "badge badge-ghost text-base-content";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open":
        return <MdHourglassEmpty className="w-4 h-4" />;
      case "In Progress":
        return <MdAccessTime className="w-4 h-4" />;
      case "Resolved":
        return <MdCheck className="w-4 h-4" />;
      case "Closed":
        return <MdClose className="w-4 h-4" />;
      default:
        return <MdMessage className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-base-content">
            Support Center
          </h2>
          <p className="text-base-content/70 mt-1 text-sm sm:text-base">
            Manage your support tickets and get help
          </p>
        </div>
        <button
          className="btn btn-primary w-full sm:w-auto text-sm sm:text-base"
          onClick={() => setShowCreateModal(true)}
        >
          <MdAdd className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Create Ticket
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-base-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-base-300 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 sm:gap-0">
          <h3 className="text-base sm:text-lg font-semibold text-base-content">
            <MdFilterList className="inline mr-2" />
            Filter Tickets
          </h3>
          <div className="text-xs sm:text-sm text-base-content/60">
            {filteredTickets.length} of {userTickets.length} tickets
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Search */}
          <div className="form-control sm:col-span-2 lg:col-span-1">
            <label className="label">
              <span className="label-text font-medium text-sm">Search</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search tickets..."
                className="input input-bordered input-sm sm:input-md w-full pl-8 sm:pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MdSearch className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-base-content/40" />
            </div>
          </div>

          {/* Status Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-sm">Status</span>
            </label>
            <select
              className="select select-bordered select-sm sm:select-md w-full"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-sm">Category</span>
            </label>
            <select
              className="select select-bordered select-sm sm:select-md w-full"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="General">General</option>
              <option value="Payment">Payment</option>
              <option value="Technical">Technical</option>
              <option value="Booking">Booking</option>
              <option value="Account">Account</option>
              <option value="Refund">Refund</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-base-100 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-base-300 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-xs sm:text-sm">
                Total Tickets
              </p>
              <p className="text-xl sm:text-2xl font-bold text-primary">
                {userTickets.length}
              </p>
            </div>
            <MdSupport className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
        </div>

        <div className="bg-base-100 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-base-300 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-xs sm:text-sm">
                Open & In Progress
              </p>
              <p className="text-xl sm:text-2xl font-bold text-warning">
                {
                  userTickets.filter(
                    (t: SupportTicketDataTypes) =>
                      t.supportTicketStatus === "Open" ||
                      t.supportTicketStatus === "In Progress"
                  ).length
                }
              </p>
            </div>
            <MdAccessTime className="w-6 h-6 sm:w-8 sm:h-8 text-warning" />
          </div>
        </div>

        <div className="bg-base-100 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-base-300 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-xs sm:text-sm">
                Resolved
              </p>
              <p className="text-xl sm:text-2xl font-bold text-success">
                {
                  userTickets.filter(
                    (t: SupportTicketDataTypes) =>
                      t.supportTicketStatus === "Resolved"
                  ).length
                }
              </p>
            </div>
            <MdCheck className="w-6 h-6 sm:w-8 sm:h-8 text-success" />
          </div>
        </div>
      </div>

      {/* Support Tickets Table */}
      <div className="bg-base-100 rounded-xl sm:rounded-2xl border border-base-300 shadow-sm">
        <div className="p-4 sm:p-6 border-b border-base-300">
          <h3 className="text-lg sm:text-xl font-bold text-base-content">
            <MdSupport className="inline mr-2" />
            Support Tickets
          </h3>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="text-center">
              <PuffLoader size={60} color="#6366f1" />
              <p className="text-sm mt-3">Loading support tickets...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <MdClose className="w-12 h-12 mx-auto mb-4 text-error" />
              <p className="text-xl font-semibold text-error">
                Error loading tickets
              </p>
              <p className="text-sm text-base-content/50 mt-2">
                Please try refreshing the page
              </p>
            </div>
          </div>
        ) : userTickets.length === 0 &&
          !searchTerm &&
          filterStatus === "All" &&
          filterCategory === "All" ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <MdSupport className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-xl font-semibold text-base-content/70">
                No support tickets yet
              </p>
              <p className="text-sm text-base-content/50 mt-2">
                Create your first support ticket if you need help
              </p>
              <button
                className="btn btn-primary btn-sm mt-4"
                onClick={() => setShowCreateModal(true)}
              >
                <MdAdd className="w-4 h-4 mr-2" />
                Create Your First Ticket
              </button>
            </div>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <MdSearch className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-xl font-semibold text-base-content/70">
                No tickets match your filters
              </p>
              <p className="text-sm text-base-content/50 mt-2">
                Try adjusting your search or filters to find what you're looking
                for
              </p>
              <div className="flex gap-2 mt-4 justify-center">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("All");
                    setFilterCategory("All");
                  }}
                >
                  Clear Filters
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowCreateModal(true)}
                >
                  <MdAdd className="w-4 h-4 mr-2" />
                  Create New Ticket
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Mobile Card View */}
            <div className="block sm:hidden space-y-3 p-4">
              {filteredTickets.map((ticket: SupportTicketDataTypes) => (
                <div
                  key={ticket.ticketId}
                  className="bg-base-200/50 rounded-lg p-4 border border-base-300 space-y-3"
                >
                  {/* Ticket Header */}
                  <div className="flex justify-between items-start">
                    <div className="font-mono text-sm font-semibold text-primary">
                      st{String(ticket.ticketId).padStart(3, "0")}
                    </div>
                    <span
                      className={`badge badge-xs px-2 py-1 gap-1 ${getStatusBadge(
                        ticket.supportTicketStatus
                      )} whitespace-nowrap`}
                    >
                      <span className="w-2 h-2">
                        {getStatusIcon(ticket.supportTicketStatus)}
                      </span>
                      <span className="text-xs font-medium truncate">
                        {ticket.supportTicketStatus}
                      </span>
                    </span>
                  </div>

                  {/* Subject and Description */}
                  <div>
                    <div className="font-semibold text-sm text-base-content mb-1">
                      {ticket.subject}
                    </div>
                    <div className="text-xs text-base-content/70 line-clamp-2">
                      {ticket.description}
                    </div>
                  </div>

                  {/* Category and Date */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="badge badge-outline badge-xs">
                      {ticket.category}
                    </span>
                    <span className="text-base-content/60">
                      {formatDate(ticket.createdAt)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button className="btn btn-xs btn-outline flex-1 h-8 min-h-8">
                      <MdMessage className="w-3 h-3 mr-1" />
                      View
                    </button>
                    {ticket.supportTicketStatus === "Open" && (
                      <button className="btn btn-xs btn-primary flex-1 h-8 min-h-8">
                        <MdCheck className="w-3 h-3 mr-1" />
                        Update
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="table table-zebra w-full min-w-[600px]">
                <thead className="bg-base-200 sticky top-0">
                  <tr>
                    <th className="text-xs sm:text-sm w-20 sm:w-24">
                      Ticket ID
                    </th>
                    <th className="text-xs sm:text-sm min-w-[120px] sm:min-w-[200px]">
                      Subject
                    </th>
                    <th className="text-xs sm:text-sm w-20 sm:w-24">
                      Category
                    </th>
                    <th className="text-xs sm:text-sm w-24 sm:w-32">Status</th>
                    <th className="text-xs sm:text-sm hidden lg:table-cell w-32">
                      Created
                    </th>
                    <th className="text-xs sm:text-sm hidden xl:table-cell w-32">
                      Updated
                    </th>
                    <th className="text-xs sm:text-sm w-20 sm:w-28">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket: SupportTicketDataTypes) => (
                    <tr key={ticket.ticketId} className="hover">
                      <td className="text-center">
                        <div className="font-mono text-xs sm:text-sm font-semibold text-primary">
                          st{String(ticket.ticketId).padStart(3, "0")}
                        </div>
                      </td>
                      <td>
                        <div className="space-y-1">
                          <div className="font-semibold text-xs sm:text-sm line-clamp-1">
                            {ticket.subject}
                          </div>
                          <div className="text-xs opacity-50 line-clamp-1 hidden sm:block">
                            {ticket.description}
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <span className="badge badge-outline badge-xs sm:badge-sm whitespace-nowrap">
                          {ticket.category}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="flex justify-center">
                          <span
                            className={`badge px-2 py-1 sm:px-3 sm:py-2 gap-1 sm:gap-2 text-xs ${getStatusBadge(
                              ticket.supportTicketStatus
                            )} whitespace-nowrap max-w-full`}
                          >
                            <span className="w-3 h-3 flex-shrink-0">
                              {getStatusIcon(ticket.supportTicketStatus)}
                            </span>
                            <span className="font-medium hidden sm:inline truncate">
                              {ticket.supportTicketStatus}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="hidden lg:table-cell text-center">
                        <div className="text-xs whitespace-nowrap">
                          {formatDate(ticket.createdAt)}
                        </div>
                      </td>
                      <td className="hidden xl:table-cell text-center">
                        <div className="text-xs whitespace-nowrap">
                          {formatDate(ticket.updatedAt)}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-1 sm:gap-2 justify-center items-center">
                          <button className="btn btn-xs sm:btn-sm btn-outline flex-shrink-0">
                            <span className="hidden sm:inline">View</span>
                            <MdMessage className="w-3 h-3 sm:hidden" />
                          </button>
                          {ticket.supportTicketStatus === "Open" && (
                            <button className="btn btn-xs sm:btn-sm btn-primary flex-shrink-0">
                              <span className="hidden sm:inline">Update</span>
                              <MdCheck className="w-3 h-3 sm:hidden" />
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
        )}
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl bg-gradient-to-br from-base-100 to-base-200 shadow-2xl border border-base-300 mx-2 sm:mx-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-base-300">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <MdSupport className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg sm:text-2xl text-base-content">
                    Create Support Ticket
                  </h3>
                  <p className="text-xs sm:text-sm text-base-content/60 mt-1 hidden sm:block">
                    We're here to help resolve your issue quickly
                  </p>
                </div>
              </div>
              <button
                className="btn btn-sm btn-circle btn-ghost hover:bg-error/10 hover:text-error transition-colors"
                onClick={() => setShowCreateModal(false)}
              >
                <MdClose className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Subject Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base-content flex items-center gap-2 text-sm sm:text-base">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Subject *
                  </span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Brief description of your issue"
                  className="input input-bordered input-sm sm:input-md w-full focus:input-primary transition-all duration-200 hover:border-primary/50"
                  required
                  maxLength={100}
                />
                <label className="label">
                  <span className="label-text-alt text-base-content/60 text-xs">
                    {formData.subject.length}/100 characters
                  </span>
                </label>
              </div>

              {/* Category Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base-content flex items-center gap-2 text-sm sm:text-base">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Category *
                  </span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="select select-bordered select-sm sm:select-md w-full focus:select-primary transition-all duration-200 hover:border-primary/50"
                  required
                >
                  <option value="General">General Inquiry</option>
                  <option value="Payment">Payment Issues</option>
                  <option value="Technical">Technical Support</option>
                  <option value="Booking">Booking Support</option>
                  <option value="Account">Account Issues</option>
                  <option value="Refund">Refund Request</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Description Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base-content flex items-center gap-2 text-sm sm:text-base">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Description *
                  </span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered textarea-sm sm:textarea-md h-24 sm:h-32 w-full focus:textarea-primary resize-none transition-all duration-200 hover:border-primary/50"
                  placeholder="Please provide detailed information about your issue. Include any error messages, steps you've taken, and what you expected to happen..."
                  required
                  maxLength={1000}
                ></textarea>
                <label className="label">
                  <span className="label-text-alt text-base-content/60 text-xs">
                    {formData.description.length}/1000 characters
                  </span>
                </label>
              </div>

              {/* User Info Display */}
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-primary/20">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <MdMessage className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                  </div>
                  <h4 className="font-semibold text-base-content text-sm sm:text-base">
                    Contact Information
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div className="bg-base-100/50 rounded-lg p-2 sm:p-3">
                    <span className="font-medium text-base-content/70">
                      User ID:
                    </span>
                    <p className="font-mono text-primary">
                      st{String(userId).padStart(3, "0")}
                    </p>
                  </div>
                  <div className="bg-base-100/50 rounded-lg p-2 sm:p-3">
                    <span className="font-medium text-base-content/70">
                      Email:
                    </span>
                    <p className="truncate">{user?.email || "Not provided"}</p>
                  </div>
                  <div className="bg-base-100/50 rounded-lg p-2 sm:p-3">
                    <span className="font-medium text-base-content/70">
                      Name:
                    </span>
                    <p className="truncate">
                      {user?.fullName || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="modal-action pt-4 sm:pt-6 border-t border-base-300">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm sm:btn-md hover:bg-base-300 transition-colors flex-1 sm:flex-none"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm sm:btn-md hover:btn-primary-focus disabled:loading transition-all duration-200 shadow-lg hover:shadow-xl flex-1 sm:flex-none"
                  disabled={
                    isCreating ||
                    !formData.subject.trim() ||
                    !formData.description.trim()
                  }
                >
                  {isCreating ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      <span className="hidden sm:inline">Creating...</span>
                    </>
                  ) : (
                    <>
                      <MdAdd className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Create Ticket</span>
                      <span className="sm:hidden">Create</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          <div
            className="modal-backdrop bg-black/30 backdrop-blur-sm"
            onClick={() => !isCreating && setShowCreateModal(false)}
          ></div>
        </div>
      )}
    </div>
  );
};
