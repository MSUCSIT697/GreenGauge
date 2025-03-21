import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import defaultProfile from "../assets/defaultProfile.jpg"; // ✅ Profile Image

export default function Settings() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "User",
    email: "user@example.com",
    password: "password123", // ✅ Placeholder (Replace when using API)
  });

  const [profilePicture, setProfilePicture] = useState(defaultProfile);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [updatedInfo, setUpdatedInfo] = useState({
    oldUsername: "",
    newUsername: "",
    oldEmail: "",
    newEmail: "",
    oldPassword: "",
    newPassword: "",
  });

  // ✅ Load stored user data
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // ✅ Validate profile image (Avoids invalid blobs)
        const isValidImage =
          parsedUser.profilePicture && parsedUser.profilePicture.startsWith("data:image");
        setProfilePicture(isValidImage ? parsedUser.profilePicture : defaultProfile);
      } catch (error) {
        console.error("⚠️ Error parsing user data:", error);
        setErrorMessage("⚠️ Error loading profile. Please re-login.");
      }
    } else {
      setErrorMessage("⚠️ No user data found. Please log in.");
    }
  }, []);

  // ✅ Profile Picture Change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        const base64Image = reader.result;
        setProfilePicture(base64Image);

        // ✅ Save in localStorage
        const storedUser = JSON.parse(localStorage.getItem("user")) || {};
        localStorage.setItem("user", JSON.stringify({ ...storedUser, profilePicture: base64Image }));
      };
    }
  };

  // ✅ Handle account info update (Validations Applied)
  const handleUpdateInfo = (e) => {
    e.preventDefault();
    setErrorMessage("");
  
    let newUserData = { ...user };
    let hasChanges = false;
  
    // ✅ Username Validation
    const trimmedNewUsername = updatedInfo.newUsername.trim();
    if (trimmedNewUsername) {
      if (!updatedInfo.oldUsername.trim() || updatedInfo.oldUsername !== user.username) {
        setErrorMessage("⚠️ Incorrect old username.");
        return;
      }
      if (trimmedNewUsername.includes(" ")) {
        setErrorMessage("⚠️ Username cannot contain spaces.");
        return;
      }
      newUserData.username = trimmedNewUsername;
      hasChanges = true;
    }
  
    // ✅ Email Validation
    const trimmedNewEmail = updatedInfo.newEmail.trim();
    if (trimmedNewEmail) {
      if (!updatedInfo.oldEmail.trim() || updatedInfo.oldEmail !== user.email) {
        setErrorMessage("⚠️ Incorrect old email.");
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(trimmedNewEmail)) {
        setErrorMessage("⚠️ Please enter a valid email.");
        return;
      }
      newUserData.email = trimmedNewEmail;
      hasChanges = true;
    }
  
    // ✅ Password Validation
    if (updatedInfo.newPassword.trim()) {
      if (!updatedInfo.oldPassword || updatedInfo.oldPassword !== user.password) {
        setErrorMessage("⚠️ Incorrect old password.");
        return;
      }
      if (updatedInfo.newPassword.length < 6) {
        setErrorMessage("⚠️ New password must be at least 6 characters.");
        return;
      }
      newUserData.password = updatedInfo.newPassword;
      hasChanges = true;
    }
  
    if (!hasChanges) {
      setErrorMessage("⚠️ No changes detected.");
      return;
    }
  
    // ✅ Save changes
    localStorage.setItem("user", JSON.stringify(newUserData));
    setUser(newUserData);
    setShowEditModal(false);
    setShowSuccess(true);
  
    setTimeout(() => setShowSuccess(false), 2000);
  };
  

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Settings</h1>

      {/* ✅ Error Message */}
      {errorMessage && (
        <div className="bg-red-500 text-white p-3 rounded-md text-center mt-4">{errorMessage}</div>
      )}

      {/* User Info Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-4">
        <div className="flex items-center space-x-6">
          <img
            src={profilePicture || defaultProfile}
            onError={(e) => {
              e.target.src = defaultProfile;
            }}
            alt="Profile"
            className="w-40 h-40 rounded-full border-4 border-gray-300"
          />

          <div className="text-lg">
            <p className="text-2xl font-bold">
              Username: <span className="font-normal">{user.username}</span>
            </p>
            <p className="text-2xl font-bold">
              Email: <span className="font-normal">{user.email}</span>
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-4">
          <label className="btn btn-primary cursor-pointer w-1/2 text-center">
            Change Profile Picture
            <input type="file" className="hidden" onChange={handleProfilePictureChange} />
          </label>
          <button className="btn btn-primary w-1/2" onClick={() => setShowEditModal(true)}>
            Change Account Info
          </button>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-500 text-white p-3 rounded-md text-center mt-4">
          Info Change Success!
        </div>
      )}

      {/* Update Info Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Update Account Info</h2>
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
            <form onSubmit={handleUpdateInfo} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium">Old Username</label>
                <input type="text" className="input input-bordered w-full" 
                  value={updatedInfo.oldUsername} 
                  onChange={(e) => setUpdatedInfo({ ...updatedInfo, oldUsername: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium">New Username</label>
                <input type="text" className="input input-bordered w-full" 
                  value={updatedInfo.newUsername} 
                  onChange={(e) => setUpdatedInfo({ ...updatedInfo, newUsername: e.target.value })} />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium">Old Email</label>
                <input type="email" className="input input-bordered w-full" 
                  value={updatedInfo.oldEmail} 
                  onChange={(e) => setUpdatedInfo({ ...updatedInfo, oldEmail: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium">New Email</label>
                <input type="email" className="input input-bordered w-full" 
                  value={updatedInfo.newEmail} 
                  onChange={(e) => setUpdatedInfo({ ...updatedInfo, newEmail: e.target.value })} />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium">Old Password</label>
                <input type="password" className="input input-bordered w-full" 
                  value={updatedInfo.oldPassword} 
                  onChange={(e) => setUpdatedInfo({ ...updatedInfo, oldPassword: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium">New Password</label>
                <input type="password" className="input input-bordered w-full" 
                  value={updatedInfo.newPassword} 
                  onChange={(e) => setUpdatedInfo({ ...updatedInfo, newPassword: e.target.value })} />
              </div>

              {/* Submit & Cancel Buttons */}
              <button type="submit" className="btn btn-primary w-full mt-4">Submit</button>
              <button type="button" className="btn btn-secondary w-full mt-2" onClick={() => setShowEditModal(false)}>Cancel</button>
            </form>

          </div>
        </div>
      )}

      <button className="btn btn-primary mt-8 w-full" onClick={() => navigate("/dashboard")}>
        Return to Dashboard
      </button>
    </div>
  );
}
