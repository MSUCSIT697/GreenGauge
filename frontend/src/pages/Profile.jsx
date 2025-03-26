import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import defaultProfile from "../assets/defaultProfile.jpg";
import { AuthContext } from "../context/AuthContext";

export default function Settings() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useContext(AuthContext);

  // Load theme from localStorage or default to light
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : false;
  });

  // Apply theme class to document root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const [user, setUser] = useState({
    username: "",
    email: ""
  });

  const [profilePicture, setProfilePicture] = useState(defaultProfile);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
    setErrorMessage("");
    setIsLoading(true);
  
    try {
      const storedUser = JSON.parse(localStorage.getItem("profile")) || {};
      
      // Prepare the update data
      const updateData = {};
      const requestBody = {};
      if (updatedInfo.username && updatedInfo.username !== user.username) {
        if (updatedInfo.username.trim().includes(" ")) {
          setErrorMessage("⚠️ Username cannot contain spaces.");
          return;
        }else{
          updateData.username = updatedInfo.username;
          requestBody.username = updatedInfo.username;
        }
      }
      if (updatedInfo.email && updatedInfo.email !== user.email) {
        if (!/^\S+@\S+\.\S+$/.test(updatedInfo)) {
          setErrorMessage("⚠️ Please enter a valid email.");
          return;
        }else{
          updateData.email = updatedInfo.email;
          requestBody.email = updatedInfo.email;
        }
      }
      if (updatedInfo.password) {
        requestBody.password = updatedInfo.password;
      }
  
      if (Object.keys(requestBody).length === 0) {
        setErrorMessage("No changes detected");
        return;
      }
  
      // Make API call to update profile
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
  
      // Update local storage if API call succeeds
      const updatedUser = { ...storedUser, ...updateData };
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
      setErrorMessage(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="p-6 dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200">
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

      {/* Dark Mode Toggle */}
      <div className="flex justify-end mb-4">
        <label className="flex items-center cursor-pointer">
          <span className="mr-2">Dark Mode</span>
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            <div className={`block w-14 h-8 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${darkMode ? 'transform translate-x-6' : ''}`}></div>
          </div>
        </label>
      </div>

      {/* Profile Content */}
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
        <div className="flex items-center gap-6">
          <div className="relative group shrink-0">
            <img
              src={profilePicture || defaultProfile}
              onError={(e) => {
                e.target.src = defaultProfile;
              }}
              alt="Profile"
              className="w-40 h-40 rounded-full border-4 border-gray-200 dark:border-gray-600 object-cover"
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
            <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-16">
          <button 
            className="btn btn-primary dark:bg-blue-600 dark:hover:bg-blue-700"
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
            className="btn btn-primary dark:bg-blue-600 dark:hover:bg-blue-700"
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
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Update Profile</h2>
            <form onSubmit={handleUpdateInfo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input 
                  type="text" 
                  className="input input-bordered w-full dark:bg-gray-600 dark:border-gray-500"
                  value={updatedInfo.username}
                  onChange={(e) => setUpdatedInfo({ ...updatedInfo, username: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  className="input input-bordered w-full dark:bg-gray-600 dark:border-gray-500"
                  value={updatedInfo.email}
                  onChange={(e) => setUpdatedInfo({ ...updatedInfo, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input 
                  type="password" 
                  className="input input-bordered w-full dark:bg-gray-600 dark:border-gray-500"
                  value={updatedInfo.password}
                  onChange={(e) => setUpdatedInfo({ ...updatedInfo, password: e.target.value })}
                  placeholder="Leave blank to keep current"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="submit" 
                  className="btn btn-primary flex-1 dark:bg-blue-600 dark:hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline flex-1 dark:border-gray-600 dark:hover:bg-gray-600"
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