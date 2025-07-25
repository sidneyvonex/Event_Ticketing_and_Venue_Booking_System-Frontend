import { useState, useMemo } from "react";
import { toast, Toaster } from "sonner";
import {
  Building2,
  MapPin,
  Users,
  Plus,
  Search,
  ChevronDown,
  Edit2,
  Trash2,
  X,
  Save,
  Calendar,
  Eye,
} from "lucide-react";
import {
  useGetAllVenuesQuery,
  useCreateVenueMutation,
  useUpdateVenueMutation,
  useDeleteVenueMutation,
} from "../../Features/api/VenueApi";
import Swal from "sweetalert2";

interface VenueData {
  venueId: number;
  venueName: string;
  venueAddress: string;
  venueCapacity: number;
  createdAt?: string;
  updatedAt?: string;
}

export const AllVenues = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [selectedVenue, setSelectedVenue] = useState<VenueData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form data for create/edit
  const [formData, setFormData] = useState({
    venueName: "",
    venueAddress: "",
    venueCapacity: "",
  });

  // API hooks
  const {
    data: venues = [],
    isLoading: venuesLoading,
    error: venuesError,
  } = useGetAllVenuesQuery({});

  const [createVenue, { isLoading: isCreating }] = useCreateVenueMutation();
  const [updateVenue, { isLoading: isUpdating }] = useUpdateVenueMutation();
  const [deleteVenue] = useDeleteVenueMutation();

  // Filter and search venues
  const filteredVenues = useMemo(() => {
    let filtered = [...venues];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (venue: VenueData) =>
          venue.venueName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          venue.venueAddress?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a: VenueData, b: VenueData) => {
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
        case "name":
          return a.venueName.localeCompare(b.venueName);
        case "capacity-high":
          return b.venueCapacity - a.venueCapacity;
        case "capacity-low":
          return a.venueCapacity - b.venueCapacity;
        default:
          return 0;
      }
    });

    return filtered;
  }, [venues, searchTerm, sortBy]);

  // Pagination
  const totalItems = filteredVenues.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVenues = filteredVenues.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Modal handlers
  const openModal = (venue: VenueData) => {
    setSelectedVenue(venue);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedVenue(null);
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    setFormData({
      venueName: "",
      venueAddress: "",
      venueCapacity: "",
    });
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setFormData({
      venueName: "",
      venueAddress: "",
      venueCapacity: "",
    });
  };

  const openEditModal = (venue: VenueData) => {
    setSelectedVenue(venue);
    setFormData({
      venueName: venue.venueName,
      venueAddress: venue.venueAddress,
      venueCapacity: venue.venueCapacity.toString(),
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedVenue(null);
    setIsEditModalOpen(false);
    setFormData({
      venueName: "",
      venueAddress: "",
      venueCapacity: "",
    });
  };

  // CRUD operations
  const handleCreateVenue = async () => {
    // Validation
    if (!formData.venueName.trim()) {
      toast.error("Venue name is required!");
      return;
    }
    if (!formData.venueAddress.trim()) {
      toast.error("Venue address is required!");
      return;
    }
    if (!formData.venueCapacity || parseInt(formData.venueCapacity) <= 0) {
      toast.error("Valid venue capacity is required!");
      return;
    }

    const result = await Swal.fire({
      title: "Create New Venue?",
      text: "Are you sure you want to create this venue?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, create it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const venueData = {
          venueName: formData.venueName.trim(),
          venueAddress: formData.venueAddress.trim(),
          venueCapacity: parseInt(formData.venueCapacity),
        };

        console.log("=== CREATING VENUE ===");
        console.log("Venue Data being sent:", venueData);

        await createVenue(venueData).unwrap();

        console.log("✅ Venue created successfully!");

        await Swal.fire({
          title: "Success!",
          text: "Venue created successfully!",
          icon: "success",
          confirmButtonColor: "#2563eb",
        });

        closeCreateModal();
        toast.success("Venue created successfully!");
      } catch (error: unknown) {
        console.error("❌ Create venue error:", error);

        const errorMessage =
          error && typeof error === "object" && "data" in error
            ? (error.data as { error?: string })?.error ||
              "Failed to create venue. Please try again."
            : "Failed to create venue. Please try again.";

        await Swal.fire({
          title: "Error!",
          text: errorMessage,
          icon: "error",
          confirmButtonColor: "#2563eb",
        });
      }
    }
  };

  const handleUpdateVenue = async () => {
    if (!selectedVenue) return;

    // Validation
    if (!formData.venueName.trim()) {
      toast.error("Venue name is required!");
      return;
    }
    if (!formData.venueAddress.trim()) {
      toast.error("Venue address is required!");
      return;
    }
    if (!formData.venueCapacity || parseInt(formData.venueCapacity) <= 0) {
      toast.error("Valid venue capacity is required!");
      return;
    }

    const result = await Swal.fire({
      title: "Update Venue?",
      text: "Are you sure you want to update this venue?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const updateData = {
          venueId: selectedVenue.venueId,
          venueName: formData.venueName.trim(),
          venueAddress: formData.venueAddress.trim(),
          venueCapacity: parseInt(formData.venueCapacity),
        };

        console.log("=== UPDATING VENUE ===");
        console.log("Update Data being sent:", updateData);

        await updateVenue(updateData).unwrap();

        console.log("✅ Venue updated successfully!");

        await Swal.fire({
          title: "Success!",
          text: "Venue updated successfully!",
          icon: "success",
          confirmButtonColor: "#2563eb",
        });

        closeEditModal();
        toast.success("Venue updated successfully!");
      } catch (error: unknown) {
        console.error("❌ Update venue error:", error);

        const errorMessage =
          error && typeof error === "object" && "data" in error
            ? (error.data as { error?: string })?.error ||
              "Failed to update venue. Please try again."
            : "Failed to update venue. Please try again.";

        await Swal.fire({
          title: "Error!",
          text: errorMessage,
          icon: "error",
          confirmButtonColor: "#2563eb",
        });
      }
    }
  };

  const handleDeleteVenue = async (venueId: number, venueName: string) => {
    const result = await Swal.fire({
      title: "Delete Venue?",
      text: `Are you sure you want to delete "${venueName}"? This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteVenue(venueId).unwrap();

        await Swal.fire({
          title: "Deleted!",
          text: "Venue has been deleted successfully.",
          icon: "success",
          confirmButtonColor: "#2563eb",
        });

        toast.success("Venue deleted successfully!");
      } catch (error: unknown) {
        console.error("Delete venue error:", error);
        await Swal.fire({
          title: "Error!",
          text: "Failed to delete venue. Please try again.",
          icon: "error",
          confirmButtonColor: "#2563eb",
        });
      }
    }
  };

  if (venuesLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading venues...</span>
        </div>
      </div>
    );
  }

  if (venuesError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <X size={20} />
            <span className="font-medium">Error loading venues</span>
          </div>
          <p className="text-red-600 text-sm mt-1">
            Failed to fetch venues. Please try again.
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
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="text-blue-600" size={32} />
            Venues Management
          </h1>
          <p className="text-gray-600 mt-1">
            Create, manage and monitor all event venues
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Create Venue
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Venues</p>
              <p className="text-2xl font-bold text-gray-900">
                {venues.length}
              </p>
            </div>
            <Building2 className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Capacity</p>
              <p className="text-2xl font-bold text-green-600">
                {venues.reduce(
                  (sum: number, venue: VenueData) => sum + venue.venueCapacity,
                  0
                )}
              </p>
            </div>
            <Users className="text-green-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Capacity</p>
              <p className="text-2xl font-bold text-purple-600">
                {venues.length > 0
                  ? Math.round(
                      venues.reduce(
                        (sum: number, venue: VenueData) =>
                          sum + venue.venueCapacity,
                        0
                      ) / venues.length
                    )
                  : 0}
              </p>
            </div>
            <Calendar className="text-purple-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Largest Venue</p>
              <p className="text-2xl font-bold text-orange-600">
                {venues.length > 0
                  ? Math.max(
                      ...venues.map((venue: VenueData) => venue.venueCapacity)
                    )
                  : 0}
              </p>
            </div>
            <MapPin className="text-orange-500" size={24} />
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
              placeholder="Search venues by name or address..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              <option value="name">Name A-Z</option>
              <option value="capacity-high">Capacity (High to Low)</option>
              <option value="capacity-low">Capacity (Low to High)</option>
            </select>
            <ChevronDown
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>
        </div>
      </div>

      {/* Venues Grid */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredVenues.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No venues found
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "Try adjusting your search criteria."
                : "No venues have been created yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {paginatedVenues.map((venue: VenueData) => (
              <div
                key={venue.venueId}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                {/* Venue Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg truncate">
                      {venue.venueName}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 flex items-center gap-1">
                      <MapPin size={12} />
                      {venue.venueAddress}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-medium text-gray-900 flex items-center gap-1">
                        <Users size={14} />
                        {venue.venueCapacity} people
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <button
                      onClick={() => openModal(venue)}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Eye size={12} />
                      View
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(venue)}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded transition-colors"
                      >
                        <Edit2 size={12} />
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteVenue(venue.venueId, venue.venueName)
                        }
                        className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={12} />
                        Delete
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

      {/* Venue Details Modal */}
      {isModalOpen && selectedVenue && (
        <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Venue Details
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
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Building2 size={20} />
                    {selectedVenue.venueName}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Venue Name
                      </label>
                      <p className="text-gray-900">{selectedVenue.venueName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Capacity
                      </label>
                      <p className="text-gray-900 flex items-center gap-1">
                        <Users size={16} />
                        {selectedVenue.venueCapacity} people
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <p className="text-gray-900 flex items-center gap-1">
                        <MapPin size={16} />
                        {selectedVenue.venueAddress}
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
                  openEditModal(selectedVenue);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Edit2 size={16} />
                Edit Venue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Venue Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Create New Venue
              </h2>
              <button
                onClick={closeCreateModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    value={formData.venueName}
                    onChange={(e) =>
                      setFormData({ ...formData, venueName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter venue name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue Address *
                  </label>
                  <textarea
                    value={formData.venueAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, venueAddress: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter venue address"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue Capacity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.venueCapacity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        venueCapacity: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter venue capacity"
                    required
                  />
                </div>
              </form>
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
                onClick={handleCreateVenue}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                disabled={
                  isCreating ||
                  !formData.venueName ||
                  !formData.venueAddress ||
                  !formData.venueCapacity
                }
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Create Venue
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Venue Modal */}
      {isEditModalOpen && selectedVenue && (
        <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Venue
              </h2>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    value={formData.venueName}
                    onChange={(e) =>
                      setFormData({ ...formData, venueName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter venue name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue Address *
                  </label>
                  <textarea
                    value={formData.venueAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, venueAddress: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter venue address"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue Capacity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.venueCapacity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        venueCapacity: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter venue capacity"
                    required
                  />
                </div>
              </form>
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
                onClick={handleUpdateVenue}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                disabled={
                  isUpdating ||
                  !formData.venueName ||
                  !formData.venueAddress ||
                  !formData.venueCapacity
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
                    Update Venue
                  </>
                )}
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
