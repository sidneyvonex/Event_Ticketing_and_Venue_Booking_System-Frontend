const AdminSettings = () => {
  return (
    <div className="p-6 space-y-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Settings</h1>

      {/* Site Information */}
      <section className="bg-white rounded-xl shadow p-4 space-y-3">
        <h2 className="text-lg font-semibold mb-2">Site Information</h2>
        <div className="flex flex-col gap-2">
          <label className="font-medium">Site Name</label>
          <input
            className="input input-bordered w-full"
            placeholder="Event Platform Name"
          />
          <label className="font-medium mt-2">Contact Email</label>
          <input
            className="input input-bordered w-full"
            placeholder="admin@email.com"
          />
        </div>
      </section>

      {/* Email Settings */}
      <section className="bg-white rounded-xl shadow p-4 space-y-3">
        <h2 className="text-lg font-semibold mb-2">Email Settings</h2>
        <div className="flex flex-col gap-2">
          <label className="font-medium">Sender Address</label>
          <input
            className="input input-bordered w-full"
            placeholder="noreply@yourdomain.com"
          />
        </div>
      </section>

      {/* User Management */}
      <section className="bg-white rounded-xl shadow p-4 space-y-3">
        <h2 className="text-lg font-semibold mb-2">User Management</h2>
        <div className="flex items-center gap-2">
          <label className="font-medium">Allow Registration</label>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            defaultChecked
          />
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <label className="font-medium">Default User Role</label>
          <select className="select select-bordered w-full">
            <option>User</option>
            <option>Admin</option>
          </select>
        </div>
      </section>

      {/* Appearance */}
      <section className="bg-white rounded-xl shadow p-4 space-y-3">
        <h2 className="text-lg font-semibold mb-2">Appearance</h2>
        <div className="flex flex-col gap-2">
          <label className="font-medium">Theme</label>
          <select className="select select-bordered w-full">
            <option>System</option>
            <option>Light</option>
            <option>Dark</option>
          </select>
        </div>
      </section>

      {/* Maintenance Mode */}
      <section className="bg-white rounded-xl shadow p-4 space-y-3">
        <h2 className="text-lg font-semibold mb-2">Maintenance Mode</h2>
        <div className="flex items-center gap-2">
          <label className="font-medium">Enable Maintenance</label>
          <input type="checkbox" className="toggle toggle-warning" />
        </div>
        <input
          className="input input-bordered w-full mt-2"
          placeholder="Maintenance message..."
        />
      </section>

      <button className="btn btn-primary w-full mt-6">Save Settings</button>
    </div>
  );
};

export default AdminSettings;
