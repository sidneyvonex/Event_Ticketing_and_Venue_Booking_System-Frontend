/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
// Helper functions moved to UserModalHelpers.ts for react-refresh compliance
// Import them where needed

const CreateUserModal = ({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
}) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactPhone: "",
    address: "",
    password: "",
    userRole: "user",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onCreate(form);
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // error handled by parent
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 btn btn-sm btn-circle btn-ghost"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Create New User</h2>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="input input-bordered w-1/2"
              placeholder="First Name"
              required
            />
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="input input-bordered w-1/2"
              placeholder="Last Name"
              required
            />
          </div>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Email"
            type="email"
            required
          />
          <input
            name="contactPhone"
            value={form.contactPhone}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Phone"
          />
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Address"
          />
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Password"
            type="password"
            required
          />
          <select
            name="userRole"
            value={form.userRole}
            onChange={handleChange}
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
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
