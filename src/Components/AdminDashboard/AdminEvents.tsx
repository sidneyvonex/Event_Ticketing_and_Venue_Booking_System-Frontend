/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Calendar,
  MapPin,
  DollarSign,
  Eye,
  Edit3,
  Trash2,
  Users,
  Clock,
  X,
  Save,
  Image,
  FileText,
  ChevronDown,
  Upload,
} from "lucide-react";
import { eventApi } from "../../Features/api/EventApi";
import { venueApi } from "../../Features/api/VenueApi";
import { useUploadImageMutation } from "../../Features/api/uploadApi";
import { validateImage } from "../../utils/imageUploadUtils";
import type { EventsDataTypes } from "../../types/types";
import { toast, Toaster } from "sonner";
import { PuffLoader } from "react-spinners";
import Swal from "sweetalert2";

export const AdminEvents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [selectedEvent, setSelectedEvent] = useState<EventsDataTypes | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isImageUploading, setIsImageUploading] = useState(false);

  // Cloudinary upload mutation
  const [uploadImage] = useUploadImageMutation();

  // Form data for create/editIsImageUploading] = useState(false);

  // Form data for create/edit
  const [formData, setFormData] = useState({
    eventTitle: "",
    description: "",
    category: "",
    eventDate: "",
    eventTime: "",
    ticketPrice: "",
    ticketsTotal: "",
    eventImageUrl: "",
    venueId: "",
  });

  // Fetch data
  const {
    data: events = [],
    isLoading: eventsLoading,
    error: eventsError,
  } = eventApi.useGetAllEventsQuery({});

  // Fetch venues data
  const {
    data: venues = [],
    isLoading: venuesLoading,
    error: venuesError,
  } = venueApi.useGetAllVenuesQuery({});

  const [createEvent, { isLoading: isCreating }] =
    eventApi.useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] =
    eventApi.useUpdateEventMutation();
  const [deleteEvent, { isLoading: isDeleting }] =
    eventApi.useDeleteEventMutation();

  // Filter and search events
  const filteredEvents = useMemo(() => {
    let filtered = [...events]; // Create a copy of the array to avoid mutating the original

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (event: EventsDataTypes) =>
          event.eventTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.venue?.venueName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          event.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "All") {
      filtered = filtered.filter(
        (event: EventsDataTypes) => event.category === categoryFilter
      );
    }

    // Sort
    filtered.sort((a: EventsDataTypes, b: EventsDataTypes) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "price-high":
          return parseFloat(b.ticketPrice) - parseFloat(a.ticketPrice);
        case "price-low":
          return parseFloat(a.ticketPrice) - parseFloat(b.ticketPrice);
        case "title":
          return a.eventTitle.localeCompare(b.eventTitle);
        default:
          return 0;
      }
    });

    return filtered;
  }, [events, searchTerm, categoryFilter, sortBy]);

  // Pagination
  const totalItems = filteredEvents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // If venueId is changed, autofill ticketsTotal from venue capacity
    if (name === "venueId" && value) {
      const selectedVenue = venues.find(
        (venue: any) => venue.venueId.toString() === value
      );
      if (selectedVenue) {
        setFormData((prev) => ({
          ...prev,
          venueId: value,
          ticketsTotal: selectedVenue.venueCapacity.toString(),
        }));
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate image using utility function
    const validation = validateImage(file, 10); // 10MB max for events
    if (!validation.isValid) {
      toast.error(validation.error!);
      return;
    }

    setIsImageUploading(true);

    try {
      // Upload to Cloudinary
      const result = await uploadImage({
        file,
        context: "event-images",
        quality: 0.85,
        maxWidth: 1200,
        maxHeight: 800,
      }).unwrap();

      // Update form data and preview with Cloudinary URL
      setImagePreview(result.secure_url);
      setFormData((prev) => {
        const updatedFormData = {
          ...prev,
          eventImageUrl: result.secure_url,
        };
        console.log("Updated Form Data:", updatedFormData);
        return updatedFormData;
      });

      toast.success("Event image uploaded successfully!");
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsImageUploading(false);
    }
  };

  // Format date and time for display
  const formatDateTime = (eventDate: string, eventTime: string) => {
    const datePart = new Date(eventDate).toISOString().split("T")[0];
    const combined = new Date(`${datePart}T${eventTime}`);
    return combined.toLocaleString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Format currency for display
  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numAmount);
  };

  // Modal handlers
  const openModal = (event: EventsDataTypes) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    setFormData({
      eventTitle: "",
      description: "",
      category: "",
      eventDate: "",
      eventTime: "",
      ticketPrice: "",
      ticketsTotal: "",
      eventImageUrl: "",
      venueId: "",
    });
    setImagePreview("");
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setImagePreview("");
    setFormData({
      eventTitle: "",
      description: "",
      category: "",
      eventDate: "",
      eventTime: "",
      ticketPrice: "",
      ticketsTotal: "",
      eventImageUrl: "",
      venueId: "",
    });
  };

  const openEditModal = (event: EventsDataTypes) => {
    setSelectedEvent(event);
    setImagePreview(event.eventImageUrl || "");
    setFormData({
      eventTitle: event.eventTitle,
      description: event.description,
      category: event.category,
      eventDate: event.eventDate.split("T")[0],
      eventTime: event.eventTime,
      ticketPrice: event.ticketPrice,
      ticketsTotal: event.venue?.venueCapacity?.toString() || "",
      eventImageUrl: event.eventImageUrl,
      venueId: event.venue?.venueId?.toString() || "",
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedEvent(null);
    setIsEditModalOpen(false);
    setImagePreview("");
    setFormData({
      eventTitle: "",
      description: "",
      category: "",
      eventDate: "",
      eventTime: "",
      ticketPrice: "",
      ticketsTotal: "",
      eventImageUrl: "",
      venueId: "",
    });
  };

  // CRUD operations
  const handleCreateEvent = async () => {
    // Validate required fields
    if (!formData.eventTitle.trim()) {
      toast.error("Event title is required!");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Event description is required!");
      return;
    }
    if (!formData.category) {
      toast.error("Event category is required!");
      return;
    }
    if (!formData.eventDate) {
      toast.error("Event date is required!");
      return;
    }
    if (!formData.eventTime) {
      toast.error("Event time is required!");
      return;
    }
    if (!formData.ticketPrice || parseFloat(formData.ticketPrice) <= 0) {
      toast.error("Valid ticket price is required!");
      return;
    }
    if (!formData.venueId) {
      toast.error("Please select a venue!");
      return;
    }
    if (!formData.ticketsTotal || parseInt(formData.ticketsTotal) <= 0) {
      toast.error("Valid ticket capacity is required!");
      return;
    }

    const result = await Swal.fire({
      title: "Create New Event?",
      text: "Are you sure you want to create this event?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, create it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        // Validation
        if (!formData.eventImageUrl || formData.eventImageUrl.trim() === "") {
          await Swal.fire({
            title: "Missing Image!",
            text: "Please upload an event image before creating the event.",
            icon: "warning",
            confirmButtonColor: "#2563eb",
          });
          return;
        }

        const eventData = {
          eventTitle: formData.eventTitle,
          description: formData.description,
          category: formData.category,
          eventDate: formData.eventDate,
          eventTime: formData.eventTime,
          ticketPrice: parseFloat(formData.ticketPrice),
          ticketsTotal: parseInt(formData.ticketsTotal),
          venueId: parseInt(formData.venueId),
          eventImageUrl: formData.eventImageUrl, // Backend expects this field name
          ticketsSold: 0,
        };

        console.log("=== CREATING EVENT ===");
        console.log("Event Data being sent:", eventData);
        console.log("Image URL:", formData.eventImageUrl);

        await createEvent(eventData).unwrap();

        console.log("✅ Event created successfully!");

        await Swal.fire({
          title: "Success!",
          text: "Event created successfully!",
          icon: "success",
          confirmButtonColor: "#2563eb",
        });

        closeCreateModal();
      } catch (error: any) {
        console.error("❌ Create event error:", error);
        console.error("❌ Error response:", error?.data);
        console.error("❌ Error status:", error?.status);

        await Swal.fire({
          title: "Error!",
          text:
            error?.data?.error ||
            error?.data?.message ||
            "Failed to create event. Please try again.",
          icon: "error",
          confirmButtonColor: "#2563eb",
        });
      }
    }
  };

  const handleUpdateEvent = async () => {
    if (!selectedEvent) return;

    const result = await Swal.fire({
      title: "Update Event?",
      text: "Are you sure you want to update this event?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        // Validation
        if (!formData.eventImageUrl || formData.eventImageUrl.trim() === "") {
          await Swal.fire({
            title: "Missing Image!",
            text: "Please upload an event image before updating the event.",
            icon: "warning",
            confirmButtonColor: "#2563eb",
          });
          return;
        }

        const updateData = {
          eventId: selectedEvent.eventId,
          eventTitle: formData.eventTitle,
          description: formData.description,
          category: formData.category,
          eventDate: formData.eventDate,
          eventTime: formData.eventTime,
          ticketPrice: parseFloat(formData.ticketPrice),
          ticketsTotal: parseInt(formData.ticketsTotal),
          venueId: parseInt(formData.venueId),
          eventImageUrl: formData.eventImageUrl, // Backend expects this field name
        };

        console.log("=== UPDATING EVENT ===");
        console.log("Update Data being sent:", updateData);
        console.log("Image URL:", formData.eventImageUrl);

        await updateEvent(updateData).unwrap();

        console.log("✅ Event updated successfully!");

        await Swal.fire({
          title: "Success!",
          text: "Event updated successfully!",
          icon: "success",
          confirmButtonColor: "#2563eb",
        });

        closeEditModal();
      } catch (error: any) {
        console.error("❌ Update event error:", error);
        console.error("❌ Error response:", error?.data);
        console.error("❌ Error status:", error?.status);

        await Swal.fire({
          title: "Error!",
          text:
            error?.data?.error ||
            error?.data?.message ||
            "Failed to update event. Please try again.",
          icon: "error",
          confirmButtonColor: "#2563eb",
        });
      }
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    const result = await Swal.fire({
      title: "Delete Event?",
      text: "Are you sure you want to delete this event? This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteEvent(eventId).unwrap();

        await Swal.fire({
          title: "Deleted!",
          text: "Event has been deleted successfully.",
          icon: "success",
          confirmButtonColor: "#2563eb",
        });
      } catch (error: any) {
        console.error("Delete event error:", error);
        await Swal.fire({
          title: "Error!",
          text: "Failed to delete event. Please try again.",
          icon: "error",
          confirmButtonColor: "#2563eb",
        });
      }
    }
  };

  if (eventsLoading || venuesLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-48">
          <PuffLoader size={60} color="#0f172a" />
          <span className="ml-3 text-gray-600">
            Loading events and venues...
          </span>
        </div>
      </div>
    );
  }

  if (eventsError || venuesError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <X size={20} />
            <span className="font-medium">Error loading data</span>
          </div>
          <p className="text-red-600 text-sm mt-1">
            Failed to fetch data. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Events Management
          </h1>
          <p className="text-gray-600 mt-1">
            Create, manage and monitor all platform events
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Create Event
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.length}
              </p>
            </div>
            <Calendar className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Events</p>
              <p className="text-2xl font-bold text-green-600">
                {
                  events.filter(
                    (e: EventsDataTypes) => new Date(e.eventDate) > new Date()
                  ).length
                }
              </p>
            </div>
            <Clock className="text-green-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tickets</p>
              <p className="text-2xl font-bold text-purple-600">
                {events.reduce(
                  (sum: number, event: EventsDataTypes) =>
                    sum + (event.venue?.venueCapacity || 0),
                  0
                )}
              </p>
            </div>
            <Users className="text-purple-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(
                  events
                    .reduce(
                      (sum: number, event: EventsDataTypes) =>
                        sum +
                        (event.ticketsSold || 0) *
                          parseFloat(event.ticketPrice || "0"),
                      0
                    )
                    .toString()
                )}
              </p>
            </div>
            <DollarSign className="text-orange-500" size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search events by title, description, venue..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="music">Music</option>
              <option value="sport">Sport</option>
              <option value="fashion">Fashion</option>
              <option value="art-design">Art & Design</option>
              <option value="technology">Technology</option>
              <option value="business">Business</option>
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
              <option value="title">Title A-Z</option>
              <option value="price-high">Price (High to Low)</option>
              <option value="price-low">Price (Low to High)</option>
            </select>
            <ChevronDown
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-600">
              {searchTerm || categoryFilter !== "All"
                ? "Try adjusting your search or filter criteria."
                : "No events have been created yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {paginatedEvents.map((event: EventsDataTypes) => (
              <div
                key={event.eventId}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                {/* Event Image */}
                <div className="relative">
                  <img
                    src={event.eventImageUrl || "/api/placeholder/300/200"}
                    alt={event.eventTitle}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        new Date(event.eventDate) > new Date()
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {new Date(event.eventDate) > new Date()
                        ? "Active"
                        : "Past"}
                    </span>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg truncate">
                      {event.eventTitle}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={14} />
                      <span>
                        {formatDateTime(event.eventDate, event.eventTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={14} />
                      <span>{event.venue?.venueName || "TBD"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign size={14} />
                      <span>{formatCurrency(event.ticketPrice)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users size={14} />
                      <span>
                        {event.ticketsSold || 0} /{" "}
                        {event.venue?.venueCapacity || 0} sold
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        event.category === "music"
                          ? "bg-purple-100 text-purple-800"
                          : event.category === "sport"
                          ? "bg-green-100 text-green-800"
                          : event.category === "fashion"
                          ? "bg-pink-100 text-pink-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {event.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openModal(event)}
                        className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openEditModal(event)}
                        className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                        title="Edit Event"
                        disabled={isUpdating}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.eventId)}
                        className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Delete Event"
                        disabled={isDeleting}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
      </div>

      {/* Event Details Modal */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Event Details
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
                {/* Event Image */}
                <div>
                  <img
                    src={
                      selectedEvent.eventImageUrl || "/api/placeholder/400/300"
                    }
                    alt={selectedEvent.eventTitle}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                {/* Event Information */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedEvent.eventTitle}
                    </h3>
                    <p className="text-gray-600 mt-2">
                      {selectedEvent.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">
                        Category:
                      </span>
                      <p className="text-gray-900">{selectedEvent.category}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Ticket Price:
                      </span>
                      <p className="text-gray-900">
                        {formatCurrency(selectedEvent.ticketPrice)}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Date & Time:
                      </span>
                      <p className="text-gray-900">
                        {formatDateTime(
                          selectedEvent.eventDate,
                          selectedEvent.eventTime
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Venue:</span>
                      <p className="text-gray-900">
                        {selectedEvent.venue?.venueName || "TBD"}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Venue Capacity:
                      </span>
                      <p className="text-gray-900">
                        {selectedEvent.venue?.venueCapacity || 0}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Tickets Sold:
                      </span>
                      <p className="text-gray-900">
                        {selectedEvent.ticketsSold || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  closeModal();
                  openEditModal(selectedEvent);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Create New Event
              </h2>
              <button
                onClick={closeCreateModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isCreating}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <FileText size={18} />
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Title *
                      </label>
                      <input
                        type="text"
                        value={formData.eventTitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            eventTitle: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter event title"
                        disabled={isCreating}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <div className="relative">
                        <select
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category: e.target.value,
                            })
                          }
                          className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isCreating}
                        >
                          <option value="">Select category</option>
                          <option value="music">Music</option>
                          <option value="sport">Sport</option>
                          <option value="fashion">Fashion</option>
                          <option value="art-design">Art & Design</option>
                          <option value="technology">Technology</option>
                          <option value="business">Business</option>
                        </select>
                        <ChevronDown
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter event description"
                      disabled={isCreating}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Image
                    </label>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mb-4">
                        <img
                          src={imagePreview}
                          alt="Event preview"
                          className="w-full h-48 object-cover rounded-lg border border-gray-300"
                        />
                      </div>
                    )}

                    {/* Image Upload */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload-create"
                        disabled={isCreating || isImageUploading}
                      />
                      <label
                        htmlFor="image-upload-create"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        {isImageUploading ? (
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        ) : (
                          <Upload className="text-gray-400" size={32} />
                        )}
                        <span className="text-sm text-gray-600">
                          {isImageUploading
                            ? "Uploading..."
                            : imagePreview
                            ? "Click to change image"
                            : "Click to upload image"}
                        </span>
                        <span className="text-xs text-gray-400">
                          PNG, JPG, GIF up to 5MB
                        </span>
                      </label>
                    </div>

                    {/* URL Input Alternative */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Or enter image URL
                      </label>
                      <div className="relative">
                        <Image
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                        <input
                          type="url"
                          value={formData.eventImageUrl}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              eventImageUrl: e.target.value,
                            });
                            setImagePreview(e.target.value);
                          }}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://example.com/image.jpg"
                          disabled={isCreating}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Calendar size={18} />
                    Date & Time
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Date *
                      </label>
                      <input
                        type="date"
                        value={formData.eventDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            eventDate: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isCreating}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Time *
                      </label>
                      <input
                        type="time"
                        value={formData.eventTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            eventTime: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isCreating}
                      />
                    </div>
                  </div>
                </div>

                {/* Tickets & Pricing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <DollarSign size={18} />
                    Tickets & Pricing
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ticket Price (Ksh) *
                      </label>
                      <input
                        type="number"
                        name="ticketPrice"
                        min="0"
                        step="0.01"
                        value={formData.ticketPrice}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                        disabled={isCreating}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ticket Capacity *
                      </label>
                      <input
                        type="number"
                        name="ticketsTotal"
                        min="1"
                        value={formData.ticketsTotal}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Auto-filled from venue capacity"
                        disabled={isCreating}
                      />
                    </div>
                  </div>
                </div>

                {/* Venue Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <MapPin size={18} />
                    Venue
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Venue *
                    </label>
                    <div className="relative">
                      <select
                        name="venueId"
                        value={formData.venueId}
                        onChange={handleInputChange}
                        className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isCreating || venuesLoading}
                      >
                        <option value="">Select a venue</option>
                        {venues.map((venue: any) => (
                          <option key={venue.venueId} value={venue.venueId}>
                            {venue.venueName} - Capacity: {venue.venueCapacity}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={16}
                      />
                    </div>
                    {venuesLoading && (
                      <p className="text-sm text-gray-500 mt-1">
                        Loading venues...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={closeCreateModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isCreating}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                disabled={
                  isCreating ||
                  !formData.eventTitle ||
                  !formData.description ||
                  !formData.category ||
                  !formData.eventDate ||
                  !formData.eventTime ||
                  !formData.ticketPrice ||
                  !formData.ticketsTotal ||
                  !formData.venueId
                }
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Create Event
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {isEditModalOpen && selectedEvent && (
        <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Event: {selectedEvent.eventTitle}
              </h2>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isUpdating}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content - Same as Create Modal but with Update handlers */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <FileText size={18} />
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Title *
                      </label>
                      <input
                        type="text"
                        value={formData.eventTitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            eventTitle: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter event title"
                        disabled={isUpdating}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <div className="relative">
                        <select
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category: e.target.value,
                            })
                          }
                          className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isUpdating}
                        >
                          <option value="">Select category</option>
                          <option value="music">Music</option>
                          <option value="sport">Sport</option>
                          <option value="fashion">Fashion</option>
                          <option value="art-design">Art & Design</option>
                          <option value="technology">Technology</option>
                          <option value="business">Business</option>
                        </select>
                        <ChevronDown
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter event description"
                      disabled={isUpdating}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Image
                    </label>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mb-4">
                        <img
                          src={imagePreview}
                          alt="Event preview"
                          className="w-full h-48 object-cover rounded-lg border border-gray-300"
                        />
                      </div>
                    )}

                    {/* Image Upload */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload-edit"
                        disabled={isUpdating || isImageUploading}
                      />
                      <label
                        htmlFor="image-upload-edit"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        {isImageUploading ? (
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        ) : (
                          <Upload className="text-gray-400" size={32} />
                        )}
                        <span className="text-sm text-gray-600">
                          {isImageUploading
                            ? "Uploading..."
                            : imagePreview
                            ? "Click to change image"
                            : "Click to upload image"}
                        </span>
                        <span className="text-xs text-gray-400">
                          PNG, JPG, GIF up to 5MB
                        </span>
                      </label>
                    </div>

                    {/* URL Input Alternative */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Or enter image URL
                      </label>
                      <div className="relative">
                        <Image
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                        <input
                          type="url"
                          value={formData.eventImageUrl}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              eventImageUrl: e.target.value,
                            });
                            setImagePreview(e.target.value);
                          }}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://example.com/image.jpg"
                          disabled={isUpdating}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Calendar size={18} />
                    Date & Time
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Date *
                      </label>
                      <input
                        type="date"
                        value={formData.eventDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            eventDate: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isUpdating}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Time *
                      </label>
                      <input
                        type="time"
                        value={formData.eventTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            eventTime: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isUpdating}
                      />
                    </div>
                  </div>
                </div>

                {/* Tickets & Pricing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <DollarSign size={18} />
                    Tickets & Pricing
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ticket Price (Ksh) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.ticketPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ticketPrice: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                        disabled={isUpdating}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ticket Capacity *
                      </label>
                      <input
                        type="number"
                        name="ticketsTotal"
                        min="1"
                        value={formData.ticketsTotal}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Auto-filled from venue capacity"
                        disabled={isUpdating}
                      />
                    </div>
                  </div>
                </div>

                {/* Venue Selection (Editable in Edit Modal) */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <MapPin size={18} />
                    Venue
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Venue *
                    </label>
                    <div className="relative">
                      <select
                        name="venueId"
                        value={formData.venueId}
                        onChange={handleInputChange}
                        className="appearance-none w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isUpdating || venuesLoading}
                      >
                        <option value="">Select a venue</option>
                        {venues.map((venue: any) => (
                          <option key={venue.venueId} value={venue.venueId}>
                            {venue.venueName} - Capacity: {venue.venueCapacity}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={16}
                      />
                    </div>
                    {venuesLoading && (
                      <p className="text-sm text-gray-500 mt-1">
                        Loading venues...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateEvent}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                disabled={
                  isUpdating ||
                  !formData.eventTitle ||
                  !formData.description ||
                  !formData.category ||
                  !formData.eventDate ||
                  !formData.eventTime ||
                  !formData.ticketPrice ||
                  !formData.ticketsTotal ||
                  !formData.venueId
                }
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Update Event
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <Toaster richColors position="top-right" />
    </div>
  );
};
