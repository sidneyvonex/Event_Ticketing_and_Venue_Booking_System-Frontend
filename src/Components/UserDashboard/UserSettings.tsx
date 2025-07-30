
import { useState } from "react";
import Swal from "sweetalert2";

export const UserSettings = () => {

  // Settings unique from profile: notification preferences, privacy, theme, language
  const [newsletter, setNewsletter] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [profileVisibility, setProfileVisibility] = useState("public");

  // Placeholder for save handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    Swal.fire({
      icon: "success",
      title: "Settings Saved",
      text: "Your settings have been updated.",
      timer: 1800,
      showConfirmButton: false,
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-base-100 rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-primary">User Settings</h2>
      <form onSubmit={handleSave} className="space-y-6">
        {/* Notification Preferences */}
        <div>
          <h3 className="font-semibold mb-2">Notifications</h3>
          <div className="flex items-center gap-2 mb-2">
            <input
              id="newsletter"
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={newsletter}
              onChange={() => setNewsletter(!newsletter)}
            />
            <label htmlFor="newsletter" className="text-sm">
              Receive event updates & newsletters
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="smsAlerts"
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={smsAlerts}
              onChange={() => setSmsAlerts(!smsAlerts)}
            />
            <label htmlFor="smsAlerts" className="text-sm">
              Receive SMS alerts for bookings
            </label>
          </div>
        </div>

        {/* Privacy Settings */}
        <div>
          <h3 className="font-semibold mb-2">Privacy</h3>
          <div className="flex items-center gap-2">
            <input
              id="profile-public"
              type="radio"
              name="profileVisibility"
              className="radio radio-primary"
              checked={profileVisibility === "public"}
              onChange={() => setProfileVisibility("public")}
            />
            <label htmlFor="profile-public" className="text-sm">
              Public profile (visible to others)
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="profile-private"
              type="radio"
              name="profileVisibility"
              className="radio radio-primary"
              checked={profileVisibility === "private"}
              onChange={() => setProfileVisibility("private")}
            />
            <label htmlFor="profile-private" className="text-sm">
              Private profile (hidden from others)
            </label>
          </div>
        </div>

        {/* Appearance */}
        <div>
          <h3 className="font-semibold mb-2">Appearance</h3>
          <div className="flex items-center gap-2">
            <input
              id="darkMode"
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <label htmlFor="darkMode" className="text-sm">
              Enable dark mode
            </label>
          </div>
        </div>

        {/* Language */}
        <div>
          <h3 className="font-semibold mb-2">Language</h3>
          <select
            className="select select-bordered w-full max-w-xs"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="sw">Swahili</option>
            <option value="fr">French</option>
          </select>
        </div>

        <div className="pt-2">
          <button className="btn btn-primary" type="submit">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};
