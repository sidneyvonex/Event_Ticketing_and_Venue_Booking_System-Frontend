import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast, Toaster } from "sonner";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Eye,
  EyeOff,
  Lock,
  Shield,
  Edit2,
  X,
} from "lucide-react";
import type { RootState } from "../../Features/app/store";
import {
  useGetUserByIdQuery,
  useUpdateUserProfileMutation,
  useUpdateProfilePictureMutation,
  useChangePasswordMutation,
} from "../../Features/api/userApi";
import { useUploadImageMutation } from "../../Features/api/uploadApi";
import { validateImage } from "../../utils/imageUploadUtils";

export const AdminProfile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const userId = user?.userId;

  // Fetch fresh user data
  const {
    data: userProfile,
    isLoading: isLoadingProfile,
    refetch: refetchProfile,
  } = useGetUserByIdQuery(userId, {
    skip: !userId,
    refetchOnMountOrArgChange: true,
  });

  // Get fresh user data
  const apiUserData = userProfile || userProfile?.user || userProfile?.data;

  // Mutations
  const [updateUserProfile, { isLoading: isUpdatingProfile }] =
    useUpdateUserProfileMutation();
  const [updateProfilePicture, { isLoading: isUpdatingPicture }] =
    useUpdateProfilePictureMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();
  const [uploadImage, { isLoading: isUploadingImage }] =
    useUploadImageMutation();

  // State for profile editing
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactPhone: "",
    address: "",
  });

  // State for password change
  const [isChangingPasswordMode, setIsChangingPasswordMode] = useState(false);
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

  // State for profile picture
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");

  // Initialize profile data when user data is loaded
  useEffect(() => {
    if (apiUserData) {
      setProfileData({
        firstName: apiUserData.firstName || "",
        lastName: apiUserData.lastName || "",
        email: apiUserData.email || "",
        contactPhone: apiUserData.contactPhone || "",
        address: apiUserData.address || "",
      });
      setProfileImagePreview(apiUserData.profilePicture || "");
    }
  }, [apiUserData]);

  // Handle profile picture upload
  const handleProfilePictureUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate image
    const validation = validateImage(file, 5); // 5MB max for profile pictures
    if (!validation.isValid) {
      toast.error(validation.error!);
      return;
    }

    try {
      console.log("=== UPLOADING ADMIN PROFILE PICTURE ===");
      toast.info("Uploading profile picture...");

      // Upload to Cloudinary
      const result = await uploadImage({
        file,
        context: "user-profile", // Use same context as UserProfile
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
          profilePictureUrl: result.secure_url,
        }).unwrap();

        console.log("Database Update Result:", dbResult);
      } catch (profileError: unknown) {
        console.error("Profile picture endpoint failed:", profileError);
        console.log("Trying fallback method with general profile update...");

        // Fallback: use general profile update endpoint
        const fallbackResult = await updateUserProfile({
          userId,
          profilePicture: result.secure_url,
        }).unwrap();

        console.log("Fallback update result:", fallbackResult);
      }

      // Update preview and refetch data
      setProfileImagePreview(result.secure_url);
      await refetchProfile();

      toast.success("Profile picture updated successfully!");
    } catch (error: unknown) {
      console.error("Error uploading profile picture:", error);
      toast.error("Failed to update profile picture. Please try again.");
    }
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    if (!userId) return;

    try {
      console.log("=== UPDATING ADMIN PROFILE ===");
      console.log("Profile Data:", profileData);

      await updateUserProfile({
        userId,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        contactPhone: profileData.contactPhone,
        address: profileData.address,
      }).unwrap();

      await refetchProfile();
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error: unknown) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (!userId) return;

    // Validation
    if (!passwordData.currentPassword) {
      toast.error("Current password is required!");
      return;
    }
    if (!passwordData.newPassword) {
      toast.error("New password is required!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long!");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      console.log("=== CHANGING ADMIN PASSWORD ===");

      await changePassword({
        userId,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();

      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPasswordMode(false);
      setShowPasswords({ current: false, new: false, confirm: false });

      toast.success("Password changed successfully!");
    } catch (error: unknown) {
      console.error("Error changing password:", error);
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error.data as { error?: string })?.error
          : "Failed to change password. Please try again.";
      toast.error(errorMessage);
    }
  };

  // Generate initials for fallback avatar
  const getInitials = () => {
    const firstName = apiUserData?.firstName || profileData.firstName;
    const lastName = apiUserData?.lastName || profileData.lastName;

    if (firstName && lastName) {
      return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    }
    return "AD"; // Admin default
  };

  if (isLoadingProfile) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading admin profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="text-blue-600" size={32} />
            Admin Profile
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your admin account settings and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={20} />
              Profile Picture
            </h2>

            <div className="flex flex-col items-center space-y-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {profileImagePreview || apiUserData?.profilePicture ? (
                    <img
                      src={profileImagePreview || apiUserData?.profilePicture}
                      alt="Admin Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <div
                    className={`${
                      profileImagePreview || apiUserData?.profilePicture
                        ? "hidden"
                        : ""
                    } w-full h-full bg-blue-600 flex items-center justify-center`}
                  >
                    <span className="text-white font-bold text-2xl">
                      {getInitials()}
                    </span>
                  </div>
                </div>

                {/* Upload button */}
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                  <Camera size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                    disabled={isUploadingImage || isUpdatingPicture}
                  />
                </label>
              </div>

              {/* Upload status */}
              {(isUploadingImage || isUpdatingPicture) && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  Updating profile picture...
                </div>
              )}

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Click the camera icon to upload a new profile picture
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Max size: 5MB. Formats: JPG, PNG, GIF
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User size={20} />
                Personal Information
              </h2>
              <button
                onClick={() => {
                  if (isEditing) {
                    // Cancel editing - reset form
                    setProfileData({
                      firstName: apiUserData?.firstName || "",
                      lastName: apiUserData?.lastName || "",
                      email: apiUserData?.email || "",
                      contactPhone: apiUserData?.contactPhone || "",
                      address: apiUserData?.address || "",
                    });
                  }
                  setIsEditing(!isEditing);
                }}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {isEditing ? (
                  <>
                    <X size={16} />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit2 size={16} />
                    Edit
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter first name"
                  />
                ) : (
                  <p className="text-gray-900 py-2">
                    {apiUserData?.firstName || "Not provided"}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        lastName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter last name"
                  />
                ) : (
                  <p className="text-gray-900 py-2">
                    {apiUserData?.lastName || "Not provided"}
                  </p>
                )}
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Mail size={16} />
                  Email Address
                </label>
                <p className="text-gray-900 py-2 bg-gray-50 px-3 rounded-lg">
                  {apiUserData?.email || "Not provided"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>

              {/* Role (read-only) */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Shield size={16} />
                  Role
                </label>
                <p className="text-gray-900 py-2 bg-blue-50 px-3 rounded-lg">
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                    <Shield size={12} />
                    Administrator
                  </span>
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.contactPhone}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        contactPhone: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="text-gray-900 py-2">
                    {apiUserData?.contactPhone || "Not provided"}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} />
                  Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        address: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter address"
                  />
                ) : (
                  <p className="text-gray-900 py-2">
                    {apiUserData?.address || "Not provided"}
                  </p>
                )}
              </div>
            </div>

            {/* Save button */}
            {isEditing && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleProfileUpdate}
                  disabled={isUpdatingProfile}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingProfile ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Lock size={20} />
                Security Settings
              </h2>
              <button
                onClick={() => {
                  if (isChangingPasswordMode) {
                    // Cancel password change - reset form
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                    setShowPasswords({
                      current: false,
                      new: false,
                      confirm: false,
                    });
                  }
                  setIsChangingPasswordMode(!isChangingPasswordMode);
                }}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {isChangingPasswordMode ? (
                  <>
                    <X size={16} />
                    Cancel
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Change Password
                  </>
                )}
              </button>
            </div>

            {isChangingPasswordMode ? (
              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          current: !showPasswords.current,
                        })
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          new: !showPasswords.new,
                        })
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          confirm: !showPasswords.confirm,
                        })
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password requirements */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800 font-medium mb-1">
                    Password Requirements:
                  </p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• At least 6 characters long</li>
                    <li>• Different from your current password</li>
                  </ul>
                </div>

                {/* Save password button */}
                <div className="flex justify-end">
                  <button
                    onClick={handlePasswordChange}
                    disabled={isChangingPassword}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isChangingPassword ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Changing Password...
                      </>
                    ) : (
                      <>
                        <Lock size={16} />
                        Change Password
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Lock size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Click "Change Password" to update your password</p>
              </div>
            )}
          </div>
        </div>
      </div>

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
