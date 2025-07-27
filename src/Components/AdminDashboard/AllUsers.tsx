/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useGetAllUserProfilesQuery,
  useDeleteUserMutation,
  useRegisterUserMutation,
} from "../../Features/api/userApi";
import { PuffLoader } from "react-spinners";
import { UserPlus, MoreVertical } from "lucide-react";
import { useState } from "react";
import {
  showDeleteUserConfirm,
  showSuccess,
  showError,
} from "./UserModalHelpers";
import CreateUserModal from "./UserModals";
import { UserViewModal } from "./UserViewModal";

export const AllUsers = () => {
  const {
    data: users = [],
    isLoading,
    error,
    refetch,
  } = useGetAllUserProfilesQuery({});
  const [deleteUser] = useDeleteUserMutation();
  const [showCreate, setShowCreate] = useState(false);
  const [registerUser] = useRegisterUserMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [viewUser, setViewUser] = useState<any>(null);

  // Pagination logic
  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handleView = (user: any) => setViewUser(user);
  const handleEdit = (user: any) =>
    showSuccess(`Edit user: ${user.firstName} ${user.lastName}`);
  const handleDelete = (user: any) => {
    showDeleteUserConfirm(async () => {
      try {
        await deleteUser(user.userId).unwrap();
        showSuccess("User deleted successfully");
        refetch();
      } catch (err: any) {
        showError(err?.data?.error || "Failed to delete user");
      }
    });
  };
  const handleCreateUser = async (form: any) => {
    try {
      await registerUser(form).unwrap();
      showSuccess("User created successfully");
      refetch();
    } catch (err: any) {
      showError(err?.data?.error || "Failed to create user");
      throw err;
    }
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-base-content">
            All Users
          </h2>
          <p className="text-base-content/70 mt-1">
            Manage all registered users.
          </p>
        </div>
        <button
          className="btn btn-primary flex items-center gap-2 w-full sm:w-auto"
          onClick={() => setShowCreate(true)}
        >
          <UserPlus className="w-4 h-4" />
          Create User
        </button>
      </div>

      <CreateUserModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreateUser}
      />
      <UserViewModal
        open={!!viewUser}
        onClose={() => setViewUser(null)}
        user={viewUser}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <PuffLoader size={60} color="#0f172a" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">Failed to load users.</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-base-300 bg-base-100 shadow-lg">
          <table className="table w-full text-xs sm:text-sm md:text-base">
            <thead className="bg-base-200 text-base-content border-b border-base-300">
              <tr>
                <th className="px-2 py-3">User ID</th>
                <th className="px-2 py-3">Name</th>
                <th className="px-2 py-3">Email</th>
                <th className="px-2 py-3">Phone</th>
                <th className="px-2 py-3">Address</th>
                <th className="px-2 py-3">Role</th>
                <th className="px-2 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-base-content/70"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user: any) => (
                  <tr
                    key={user.userId}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="font-mono text-sm px-2 py-2">
                      #{user.userId}
                    </td>
                    <td className="px-2 py-2">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-2 py-2">{user.email}</td>
                    <td className="px-2 py-2">{user.contactPhone || "N/A"}</td>
                    <td className="px-2 py-2">{user.address || "N/A"}</td>
                    <td className="px-2 py-2">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          user.userRole === "admin"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.userRole || "user"}
                      </span>
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex flex-wrap gap-2 justify-end">
                        <button
                          className="btn btn-xs btn-outline"
                          onClick={() => handleView(user)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-xs btn-outline"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-xs btn-error"
                          onClick={() => handleDelete(user)}
                        >
                          Delete
                        </button>
                        <button className="btn btn-xs btn-ghost">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 mt-4">
              <button
                className="btn btn-xs"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`btn btn-xs ${
                    currentPage === i + 1 ? "btn-primary" : ""
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="btn btn-xs"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllUsers;
