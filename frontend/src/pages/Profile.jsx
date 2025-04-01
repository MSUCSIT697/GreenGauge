import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import defaultProfile from "../assets/defaultProfile.jpg";
import { AuthContext } from "../context/AuthContext";

export default function Settings() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useContext(AuthContext);

  const [user, setUser] = useState({
    username: "",
    email: ""
  });

  const [profilePicture, setProfilePicture] = useState(defaultProfile);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalErrorMessage, setModalErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({
    username: "",
    email: "",
    password: ""
  });

  // ✅ Load stored user data
  useEffect(() => {
    if (!isLoggedIn) {
      setErrorMessage("Please log in to view profile");
      return;
    }

    const storedUser = localStorage.getItem("profile");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser({
          username: userData.username || "Guest",
          email: userData.email || "No email provided"
        });
        if (userData.profilePicture) {
          setProfilePicture(userData.profilePicture);
        }
      } catch (error) {
        console.error("Failed to parse user data:", error);
        setErrorMessage("Failed to load profile data");
      }
    }
  }, [isLoggedIn]);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("Image size should be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      const base64Image = reader.result;
      try {
        const storedUser = JSON.parse(localStorage.getItem("profile")) || {};
        const updatedUser = { ...storedUser, profilePicture: base64Image };
        localStorage.setItem("profile", JSON.stringify(updatedUser));
        setProfilePicture(base64Image);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
        console.error("Failed to update profile picture:", error);
        setErrorMessage("Failed to update profile picture");
      }
    };
  };

  // ✅ Handle account info update
  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setModalErrorMessage("");
    setIsLoading(true);
  
    try {
      const storedUser = JSON.parse(localStorage.getItem("profile")) || {};
      const currentPassword = storedUser.password; // Get current password from storage
      
      // Prepare the update data
      const updateData = {};
      const requestBody = {};
      
      // Password validation
      if (updatedInfo.password) {
        if (!updatedInfo.oldPassword) {
          setModalErrorMessage("Please enter your current password");
          return;
        }
        
        if (updatedInfo.oldPassword !== currentPassword) {
          setModalErrorMessage("Current password is incorrect");
          return;
        }
        
        if (updatedInfo.password === updatedInfo.oldPassword) {
          setModalErrorMessage("New password must be different from current password");
          return;
        }
        
        if (updatedInfo.password.length < 6) {
          setModalErrorMessage("Password must be at least 6 characters");
          return;
        }
        
        requestBody.password = updatedInfo.password;
      }
  
      // Username validation
      if (updatedInfo.username && updatedInfo.username !== user.username) {
        if (updatedInfo.username.trim().includes(" ")) {
          setModalErrorMessage("Username cannot contain spaces");
          return;
        }
        updateData.username = updatedInfo.username;
        requestBody.username = updatedInfo.username;
      }
  
      // Email validation
      if (updatedInfo.email && updatedInfo.email !== user.email) {
        if (!/^\S+@\S+\.\S+$/.test(updatedInfo.email)) {
          setModalErrorMessage("Please enter a valid email");
          return;
        }
        updateData.email = updatedInfo.email;
        requestBody.email = updatedInfo.email;
      }
  
      if (Object.keys(requestBody).length === 0) {
        setModalErrorMessage("No changes detected");
        return;
      }
  
      // API call
      const response = await fetch(`${import.meta.env.VITE_API_URL}/update_profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestBody)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }
  
      // Update local storage
      const updatedUser = { ...storedUser, ...updateData };
      if (updatedInfo.password) {
        updatedUser.password = updatedInfo.password; // Update password in local storage
      }
      localStorage.setItem("profile", JSON.stringify(updatedUser));
      
      // Update state
      setUser({
        username: updatedUser.username,
        email: updatedUser.email
      });
      
      setShowEditModal(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setModalErrorMessage(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 transition-colors duration-200">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      {/* Loading state */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-500 text-white p-3 rounded-md text-center mb-4">
          {errorMessage}
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-500 text-white p-3 rounded-md text-center mb-4">
          Profile updated successfully!
        </div>
      )}

      {/* Profile Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-6">
          <div className="relative group shrink-0">
            <img
              src={profilePicture || defaultProfile}
              onError={(e) => {
                e.target.src = defaultProfile;
              }}
              alt="Profile"
              className="w-40 h-40 rounded-full border-4 border-gray-200 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <label className="text-white cursor-pointer text-sm font-medium">
                Change Photo
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleProfilePictureChange}
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-2">
            <h2 className="text-2xl font-bold">{user.username}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-16">
          <button 
            className="btn btn-primary"
            onClick={() => {
              setUpdatedInfo({
                username: user.username,
                email: user.email,
                password: ""
              });
              setShowEditModal(true);
            }}
            disabled={isLoading}
          >
            Edit Profile
          </button>
          
          <button 
            className="btn btn-primary"
            onClick={() => navigate("/dashboard")}
            disabled={isLoading}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Update Info Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Update Profile</h2>

            {/* Modal-specific error message */}
            {modalErrorMessage && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4">
                <p>{modalErrorMessage}</p>
              </div>
            )}

            <form onSubmit={handleUpdateInfo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input 
                  type="text" 
                  className="input input-bordered w-full"
                  value={updatedInfo.username}
                  onChange={(e) => setUpdatedInfo({ ...updatedInfo, username: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  className="input input-bordered w-full"
                  value={updatedInfo.email}
                  onChange={(e) => setUpdatedInfo({ ...updatedInfo, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <input 
                  type="password" 
                  className="input input-bordered w-full"
                  value={updatedInfo.oldPassword || ""}
                  onChange={(e) => setUpdatedInfo({ ...updatedInfo, oldPassword: e.target.value })}
                  placeholder="Required for password changes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input 
                  type="password" 
                  className="input input-bordered w-full"
                  value={updatedInfo.password || ""}
                  onChange={(e) => setUpdatedInfo({ ...updatedInfo, password: e.target.value })}
                  placeholder="Leave blank to keep current"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="submit" 
                  className="btn btn-primary flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline flex-1"
                  onClick={() => setShowEditModal(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}