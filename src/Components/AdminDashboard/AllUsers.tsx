/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useGetAllUserProfilesQuery,
  useDeleteUserMutation,
  useAdminCreateUserMutation,
} from "../../Features/api/userApi";
import { PuffLoader } from "react-spinners";
import { UserPlus } from "lucide-react";
import React, { useState } from "react";
import {
  showDeleteUserConfirm,
  showSuccess,
  showError,
} from "./UserModalHelpers";
import CreateUserModal from "./UserModals";
import { useUpdateUserProfileMutation } from "../../Features/api/userApi";
import { useForm } from "react-hook-form";
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
  const [adminCreateUser] = useAdminCreateUserMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [viewUser, setViewUser] = useState<any>(null);
  const [editUser, setEditUser] = useState<any>(null);
  const [updateUserProfile] = useUpdateUserProfileMutation();

  // Pagination logic
  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handleView = (user: any) => setViewUser(user);
  const handleEdit = (user: any) => setEditUser(user);

  // Edit modal logic
  const EditUserModal = ({ open, onClose, user, onUpdate }: any) => {
    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm({
      defaultValues: user || {},
    });
    const [loading, setLoading] = useState(false);
    const [apiErrors, setApiErrors] = useState<string[]>([]);

    // Reset form when user changes
    React.useEffect(() => {
      reset(user);
    }, [user, reset]);

    const onSubmit = async (data: any) => {
      setLoading(true);
      setApiErrors([]);
      try {
        await onUpdate({ userId: user.userId, ...data }).unwrap();
        showSuccess("User updated successfully");
        onClose();
        refetch();
      } catch (err: any) {
        if (Array.isArray(err?.data?.error)) {
          setApiErrors(err.data.error.map((e: any) => e.message));
        } else {
          setApiErrors([err?.data?.error || "Failed to update user"]);
        }
      } finally {
        setLoading(false);
      }
    };

    if (!open || !user) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
          <button
            className="absolute top-2 right-2 btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
          >
            &times;
          </button>
          <h2 className="text-xl font-bold mb-4">Edit User</h2>
          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            {apiErrors.length > 0 && (
              <div className="text-red-500 text-sm mb-2">
                {apiErrors.map((msg, i) => (
                  <div key={i}>{msg}</div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                {...register("firstName", {
                  required: "First name is required",
                })}
                className="input input-bordered w-1/2"
                placeholder="First Name"
              />
              <input
                {...register("lastName", { required: "Last name is required" })}
                className="input input-bordered w-1/2"
                placeholder="Last Name"
              />
            </div>
            {errors.firstName && (
              <p className="text-red-500 text-xs">
                {errors.firstName.message as string}
              </p>
            )}
            {errors.lastName && (
              <p className="text-red-500 text-xs">
                {errors.lastName.message as string}
              </p>
            )}
            <input
              {...register("email", { required: "Email is required" })}
              className="input input-bordered w-full"
              placeholder="Email"
              type="email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">
                {errors.email.message as string}
              </p>
            )}
            <input
              {...register("contactPhone", { required: "Phone is required" })}
              className="input input-bordered w-full"
              placeholder="Phone"
            />
            {errors.contactPhone && (
              <p className="text-red-500 text-xs">
                {errors.contactPhone.message as string}
              </p>
            )}
            <input
              {...register("address", { required: "Address is required" })}
              className="input input-bordered w-full"
              placeholder="Address"
            />
            {errors.address && (
              <p className="text-red-500 text-xs">
                {errors.address.message as string}
              </p>
            )}
            <select
              {...register("userRole", { required: "Role is required" })}
              className="select select-bordered w-full"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button
              className="btn btn-primary w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update User"}
            </button>
          </form>
        </div>
      </div>
    );
  };
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
      await adminCreateUser(form).unwrap();
      showSuccess("User created successfully");
      refetch();
    } catch (err: any) {
      showError(err?.data?.error || "Failed to create user");
      throw err;
    }
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 space-y-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 w-full">
        <div className="text-center sm:text-left w-full sm:w-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-base-content">
            All Users
          </h2>
          <p className="text-base-content/70 mt-1">
            Manage all registered users.
          </p>
        </div>
        <button
          className="btn btn-primary flex items-center gap-2 w-full sm:w-auto text-base px-4 py-2"
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
      <EditUserModal
        open={!!editUser}
        onClose={() => setEditUser(null)}
        user={editUser}
        onUpdate={updateUserProfile}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <PuffLoader size={60} color="#0f172a" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">Failed to load users.</div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-4">
            {paginatedUsers.length === 0 ? (
              <div className="text-center py-12 text-base-content/70 bg-white rounded-xl shadow">
                No users found.
              </div>
            ) : (
              paginatedUsers.map((user: any) => (
                <div
                  key={user.userId}
                  className="bg-white rounded-xl shadow p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-3">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.firstName + " " + user.lastName}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <span className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg border border-gray-200">
                        {user.firstName?.[0]?.toUpperCase() || ""}
                        {user.lastName?.[0]?.toUpperCase() || ""}
                      </span>
                    )}
                    <div>
                      <div className="font-semibold text-base text-blue-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: #{user.userId}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 text-sm">
                    <div>
                      <span className="font-semibold text-blue-800">
                        Email:
                      </span>{" "}
                      <span className="text-gray-700">{user.email}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-blue-800">
                        Phone:
                      </span>{" "}
                      <span className="text-gray-700">
                        {user.contactPhone || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-blue-800">
                        Address:
                      </span>{" "}
                      <span className="text-gray-700">
                        {user.address || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-blue-800">Role:</span>{" "}
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          user.userRole === "admin"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.userRole || "user"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="btn btn-xs btn-outline flex-1"
                      onClick={() => handleView(user)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-xs btn-outline flex-1"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-xs btn-error flex-1"
                      onClick={() => handleDelete(user)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
            {/* Pagination Controls for Mobile */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
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
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto rounded-2xl border border-base-300 bg-white shadow-2xl p-2 sm:p-4 md:p-6 my-4 w-full">
            <table className="table w-full min-w-[600px] text-xs sm:text-sm md:text-base border-separate border-spacing-y-2">
              <thead className="bg-gradient-to-r from-blue-900 to-blue-700 text-white border-b border-blue-800">
                <tr>
                  <th className="px-2 sm:px-3 py-2 sm:py-3 rounded-tl-xl whitespace-nowrap">
                    User ID
                  </th>
                  <th className="px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap">
                    Name
                  </th>
                  <th className="px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap">
                    Email
                  </th>
                  <th className="px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap">
                    Phone
                  </th>
                  <th className="px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap">
                    Address
                  </th>
                  <th className="px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap">
                    Role
                  </th>
                  <th className="px-2 sm:px-3 py-2 sm:py-3 rounded-tr-xl whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
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
                      <td className="font-mono text-sm px-2 py-2 whitespace-nowrap">
                        #{user.userId}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        <span className="inline-flex items-center gap-2">
                          {user.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={user.firstName + " " + user.lastName}
                              className="w-8 h-8 rounded-full object-cover border border-gray-200"
                            />
                          ) : (
                            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm border border-gray-200">
                              {user.firstName?.[0]?.toUpperCase() || ""}
                              {user.lastName?.[0]?.toUpperCase() || ""}
                            </span>
                          )}
                          <span className="truncate max-w-[80px] sm:max-w-none">
                            {user.firstName} {user.lastName}
                          </span>
                        </span>
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap max-w-[120px] truncate">
                        {user.email}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap max-w-[90px] truncate">
                        {user.contactPhone || "N/A"}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap max-w-[120px] truncate">
                        {user.address || "N/A"}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">
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
                      <td className="px-2 py-2 whitespace-nowrap">
                        <div className="flex flex-col sm:flex-row flex-wrap gap-2 justify-end items-center">
                          <button
                            className="btn btn-xs btn-outline w-full sm:w-auto"
                            onClick={() => handleView(user)}
                          >
                            View
                          </button>
                          <button
                            className="btn btn-xs btn-outline w-full sm:w-auto"
                            onClick={() => handleEdit(user)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-xs btn-error w-full sm:w-auto"
                            onClick={() => handleDelete(user)}
                          >
                            Delete
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
        </>
      )}
    </div>
  );
};

export default AllUsers;
