/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../Features/app/store";
import type { UserDataTypes } from "../../types/types";
import {
  useGetUserByIdQuery,
  useUpdateUserProfileMutation,
  useChangePasswordMutation,
  useUpdateProfilePictureMutation,
} from "../../Features/api/userApi";
import { useUploadImageMutation } from "../../Features/api/uploadApi";
import { validateImage } from "../../utils/imageUploadUtils";
import {
  MdEdit,
  MdSave,
  MdCancel,
  MdCamera,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdPerson,
  MdSecurity,
  MdNotifications,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { toast, Toaster } from "sonner";
import { PuffLoader } from "react-spinners";

export const UserProfile = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  // Get user ID from auth state
  const userId = user?.userId;

  // RTK Query hooks - Primary source of user data
  const {
    data: userProfile,
    isLoading: isLoadingProfile,
    error,
    refetch,
  } = useGetUserByIdQuery(userId, {
    skip: !userId, // Skip query if no userId
  });

  const [updateUserProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();
  const [updateProfilePicture, { isLoading: isUpdatingPicture }] =
    useUpdateProfilePictureMutation();
  const [uploadImage, { isLoading: isUploadingImage }] =
    useUploadImageMutation();

  // Initialize user data from API response or defaults
  const [userData, setUserData] = useState<UserDataTypes>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    profilePicture: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<UserDataTypes>(userData);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Load user data from API response only
  useEffect(() => {
    if (userProfile) {
      // Use the API response directly, handle different response structures
      const apiUserData = userProfile.user || userProfile.data || userProfile;

      const initialData: UserDataTypes = {
        firstName: apiUserData.firstName || "",
        lastName: apiUserData.lastName || "",
        email: apiUserData?.email || "",
        phoneNumber: apiUserData?.contactPhone || "",
        address: apiUserData?.address || "",
        profilePicture: apiUserData?.profilePicture || "",
      };

      setUserData(initialData);
      setEditedData(initialData);
    }
  }, [userProfile]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value || "", // Ensure value is never undefined
    }));
  };

  // Handle password input changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle profile image upload with Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image using utility function
    const validation = validateImage(file, 5); // 5MB max for profile pictures
    if (!validation.isValid) {
      toast.error(validation.error!);
      return;
    }

    try {
      toast.info("Uploading profile picture...");

      // Upload to Cloudinary
      const result = await uploadImage({
        file,
        context: "user-profile",
        quality: 0.9,
        maxWidth: 800,
        maxHeight: 800,
      }).unwrap();

      console.log("Cloudinary Upload Result:", result);
      console.log("Secure URL:", result.secure_url);

      // Immediately save the profile picture to database
      if (!userId) {
        toast.error("User ID not found. Please log in again.");
        return;
      }

      console.log("=== SAVING PROFILE PICTURE TO DATABASE ===");
      console.log("User ID:", userId);
      console.log("Profile Picture URL:", result.secure_url);

      // Try to save to database using dedicated profile picture endpoint
      try {
        const dbResult = await updateProfilePicture({
          userId,
          profilePictureUrl: result.secure_url, // Use profilePictureUrl to match API
        }).unwrap();

        console.log("Database Update Result:", dbResult);
      } catch (profileError: any) {
        console.error("Profile picture endpoint failed:", profileError);
        console.log("Trying fallback method with general profile update...");

        // Fallback: use general profile update endpoint
        const fallbackResult = await updateUserProfile({
          userId,
          profilePicture: result.secure_url,
        }).unwrap();

        console.log("Fallback update result:", fallbackResult);
      }

      // Update the editedData with the Cloudinary URL
      setEditedData((prev) => ({
        ...prev,
        profilePicture: result.secure_url,
      }));

      // Also update userData for immediate UI update
      setUserData((prev) => ({
        ...prev,
        profilePicture: result.secure_url,
      }));

      toast.success("Profile picture updated successfully!");

      // Refetch user data to ensure consistency
      refetch();
    } catch (error: any) {
      console.error("Error uploading profile picture:", error);
      toast.error("Failed to upload profile picture. Please try again.");
    }
  };

  // Save profile changes
  const handleSave = async () => {
    if (!editedData.firstName.trim() || !editedData.lastName.trim()) {
      toast.error("First name and last name are required!");
      return;
    }

    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    try {
      // Prepare data for API call (exclude profilePicture - it's handled separately)
      const updateData = {
        firstName: editedData.firstName.trim(),
        lastName: editedData.lastName.trim(),
        phoneNumber: editedData.phoneNumber.trim(),
        address: editedData.address.trim(),
      };

      console.log("=== SAVING PROFILE DATA TO DATABASE ===");
      console.log("User ID:", userId);
      console.log("Update Data:", updateData);
      console.log("Note: Profile picture is updated separately");

      const result = await updateUserProfile({
        userId,
        ...updateData,
      }).unwrap();

      console.log("Profile Update Result:", result);

      // Update local state
      setUserData(editedData);
      setIsEditing(false);

      toast.success("Profile updated successfully!");

      // Refetch user data to ensure consistency
      refetch();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Failed to update profile. Please try again."
      );
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditedData(userData);
    setIsEditing(false);
  };

  // Handle password change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    try {
      await changePassword({
        userId,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();

      toast.success("Password changed successfully!");
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Failed to change password. Please try again."
      );
    }
  };

  // Get user initials for avatar
  const getInitials = (firstName: string, lastName: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  // Get full name for display
  const getFullName = (firstName: string, lastName: string) => {
    if (!firstName && !lastName) return "User";
    return `${firstName || ""} ${lastName || ""}`.trim();
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Loading State */}
      {isLoadingProfile && (
        <div className="flex justify-center items-center h-64">
          <PuffLoader color="#093FB4" size={60} />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-error">
          <span>Failed to load user profile. Please try again.</span>
          <button onClick={() => refetch()} className="btn btn-sm btn-outline">
            Retry
          </button>
        </div>
      )}

      {/* User not found */}
      {!userId && (
        <div className="alert alert-warning">
          <span>Please log in to view your profile.</span>
        </div>
      )}

      {/* Main Content */}
      {!isLoadingProfile && !error && userId && (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-base-content">
                My Profile
              </h2>
              <p className="text-base-content/70 mt-1">
                Manage your account settings and preferences
              </p>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary w-full sm:w-auto"
              >
                <MdEdit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleSave}
                  className="btn btn-success flex-1 sm:flex-none"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <PuffLoader color="#ffffff" size={20} />
                      <span className="ml-2">Saving...</span>
                    </>
                  ) : (
                    <>
                      <MdSave className="w-4 h-4 mr-2" />
                      Save
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  className="btn btn-outline flex-1 sm:flex-none"
                >
                  <MdCancel className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-base-100 rounded-2xl p-6 border border-base-300 shadow-sm">
                <div className="text-center space-y-4">
                  {/* Profile Image */}
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-primary/20">
                      {(
                        isEditing
                          ? editedData.profilePicture
                          : userData.profilePicture
                      ) ? (
                        <img
                          src={
                            isEditing
                              ? editedData.profilePicture
                              : userData.profilePicture
                          }
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl font-bold text-primary">
                          {getInitials(
                            isEditing
                              ? editedData.firstName
                              : userData.firstName,
                            isEditing ? editedData.lastName : userData.lastName
                          )}
                        </span>
                      )}
                    </div>

                    {/* Image upload icon - always visible */}
                    <label
                      className={`absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary-focus transition-colors shadow-lg ${
                        isUploadingImage || isUpdatingPicture
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {isUploadingImage || isUpdatingPicture ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <MdCamera className="w-4 h-4" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploadingImage || isUpdatingPicture}
                      />
                    </label>
                  </div>

                  {/* User Info */}
                  <div>
                    <h3 className="text-xl font-bold text-base-content">
                      {getFullName(userData.firstName, userData.lastName)}
                    </h3>
                    <p className="text-base-content/60">{userData.email}</p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-base-300">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">12</div>
                      <div className="text-xs text-base-content/60">
                        Events Attended
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">5</div>
                      <div className="text-xs text-base-content/60">
                        Upcoming Events
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-base-100 rounded-2xl p-6 border border-base-300 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <MdPerson className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-base-content">
                    Personal Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        First Name *
                      </span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={editedData.firstName}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        required
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                        <MdPerson className="w-4 h-4 text-base-content/60" />
                        <span>{userData.firstName}</span>
                      </div>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Last Name *
                      </span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={editedData.lastName}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        required
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                        <MdPerson className="w-4 h-4 text-base-content/60" />
                        <span>{userData.lastName}</span>
                      </div>
                    )}
                  </div>

                  {/* Email - Read Only */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Email Address
                      </span>
                    </label>
                    <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                      <MdEmail className="w-4 h-4 text-base-content/60" />
                      <span>{userData.email}</span>
                    </div>
                    {isEditing && (
                      <label className="label">
                        <span className="label-text-alt text-base-content/50">
                          Email cannot be changed
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Phone Number
                      </span>
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={editedData.phoneNumber}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                        <MdPhone className="w-4 h-4 text-base-content/60" />
                        <span>{userData.phoneNumber || "Not provided"}</span>
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text font-medium">Address</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={editedData.address}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                        <MdLocationOn className="w-4 h-4 text-base-content/60" />
                        <span>{userData.address || "Not provided"}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-base-100 rounded-2xl p-6 border border-base-300 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
                    <MdSecurity className="w-5 h-5 text-error" />
                  </div>
                  <h3 className="text-xl font-bold text-base-content">
                    Security Settings
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                    <div>
                      <h4 className="font-medium">Password</h4>
                      <p className="text-sm text-base-content/60">
                        Last changed 30 days ago
                      </p>
                    </div>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="btn btn-outline btn-sm"
                    >
                      Change Password
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-base-content/60">
                        Add an extra layer of security
                      </p>
                    </div>
                    <input type="checkbox" className="toggle toggle-primary" />
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-base-100 rounded-2xl p-6 border border-base-300 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-info/10 rounded-full flex items-center justify-center">
                    <MdNotifications className="w-5 h-5 text-info" />
                  </div>
                  <h3 className="text-xl font-bold text-base-content">
                    Notification Preferences
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-base-content/60">
                        Receive event updates via email
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      defaultChecked
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">SMS Notifications</h4>
                      <p className="text-sm text-base-content/60">
                        Receive important alerts via SMS
                      </p>
                    </div>
                    <input type="checkbox" className="toggle toggle-primary" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Push Notifications</h4>
                      <p className="text-sm text-base-content/60">
                        Receive notifications in your browser
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      defaultChecked
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Password Change Modal */}
          {showPasswordModal && (
            <div className="modal modal-open">
              <div className="modal-box w-11/12 max-w-md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-xl">Change Password</h3>
                  <button
                    className="btn btn-sm btn-circle btn-ghost"
                    onClick={() => setShowPasswordModal(false)}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  {/* Current Password */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Current Password</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="input input-bordered w-full pr-12"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            current: !prev.current,
                          }))
                        }
                      >
                        {showPasswords.current ? (
                          <MdVisibilityOff className="w-4 h-4 text-base-content/60" />
                        ) : (
                          <MdVisibility className="w-4 h-4 text-base-content/60" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">New Password</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="input input-bordered w-full pr-12"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            new: !prev.new,
                          }))
                        }
                      >
                        {showPasswords.new ? (
                          <MdVisibilityOff className="w-4 h-4 text-base-content/60" />
                        ) : (
                          <MdVisibility className="w-4 h-4 text-base-content/60" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Confirm New Password</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="input input-bordered w-full pr-12"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            confirm: !prev.confirm,
                          }))
                        }
                      >
                        {showPasswords.confirm ? (
                          <MdVisibilityOff className="w-4 h-4 text-base-content/60" />
                        ) : (
                          <MdVisibility className="w-4 h-4 text-base-content/60" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="modal-action pt-4">
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => setShowPasswordModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isChangingPassword}
                    >
                      {isChangingPassword ? (
                        <>
                          <PuffLoader color="#ffffff" size={20} />
                          <span className="ml-2">Changing...</span>
                        </>
                      ) : (
                        "Change Password"
                      )}
                    </button>
                  </div>
                </form>
              </div>
              <div
                className="modal-backdrop"
                onClick={() => setShowPasswordModal(false)}
              ></div>
            </div>
          )}
        </>
      )}

      {/* Toast Notifications */}
      <Toaster richColors position="top-right" />
    </div>
  );
};
