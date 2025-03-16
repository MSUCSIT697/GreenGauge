import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import defaultProfile from "../assets/defaultProfile.jpg"; // Relative path



export default function Settings() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "User",
    email: "user@example.com",
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
  
        // ✅ Validate the stored image (ensure it is not an invalid blob URL)
        const isValidImage = parsedUser.profilePicture && parsedUser.profilePicture.startsWith("data:image");
  
        setUser({ username: parsedUser.username, email: parsedUser.email });
        setProfilePicture(isValidImage ? parsedUser.profilePicture : defaultProfile);
  
        console.log("Profile picture URL on load:", isValidImage ? parsedUser.profilePicture : "Using default");
      } catch (error) {
        console.error("⚠️ Error parsing user data from localStorage:", error);
        setErrorMessage("⚠️ Error loading profile. Please re-login.");
      }
    } else {
      console.warn("⚠️ No user data found in localStorage.");
      setErrorMessage("⚠️ No user data found. Please log in.");
    }
  }, []);
  
  
  
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // ✅ Convert image to Base64 (persistent storage)
  
      reader.onloadend = () => {
        const base64Image = reader.result;
        setProfilePicture(base64Image);
  
        console.log("✅ New profile picture URL:", base64Image);
  
        // ✅ Save Base64 in localStorage (instead of blob URL)
        const storedUser = JSON.parse(localStorage.getItem("user")) || {};
        localStorage.setItem("user", JSON.stringify({ ...storedUser, profilePicture: base64Image }));
      };
    }
  };
  
  
  

  // ✅ Handle account info update
  const handleUpdateInfo = (e) => {
    e.preventDefault();
  
    let newUserData = { ...user };
    let hasChanges = false;
    setErrorMessage("");
  
    // ✅ Update Username
    if (updatedInfo.newUsername) {
      if (!updatedInfo.oldUsername || updatedInfo.oldUsername !== user.username) {
        setErrorMessage("⚠️ Please enter your correct old username to update it.");
        return;
      }
      newUserData.username = updatedInfo.newUsername;
      hasChanges = true;
    }
  
    // ✅ Update Email
    if (updatedInfo.newEmail) {
      if (!updatedInfo.oldEmail || updatedInfo.oldEmail !== user.email) {
        setErrorMessage("⚠️ Please enter your correct old email to update it.");
        return;
      }
      newUserData.email = updatedInfo.newEmail;
      hasChanges = true;
    }
  
    if (!hasChanges) {
      setShowEditModal(false);
      return;
    }
  
    // ✅ Save changes in localStorage
    localStorage.setItem("user", JSON.stringify(newUserData));
    setUser(newUserData);
    setShowEditModal(false);
    setShowSuccess(true);
  
    setTimeout(() => setShowSuccess(false), 2000);
  };
  
  console.log("Rendering profile picture:", profilePicture);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Settings:</h1>
      {/* ✅ Show Error Message */}
        {errorMessage && (
          <div className="bg-red-500 text-white p-3 rounded-md text-center mt-4">
            {errorMessage}
          </div>
        )}
      {/* User Info Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-4">
        <div className="flex items-center space-x-6">
        <img 
          src={profilePicture || defaultProfile} 
          onError={(e) => { 
            console.warn("⚠️ Profile image failed to load. Falling back to default.");
            e.target.src = defaultProfile;  // ✅ Fallback to default profile image
          }} 
          alt="Profile" 
          className="w-40 h-40 rounded-full border-4 border-gray-300" 
        />

          <div className="text-lg">
          <p className="text-2xl font-bold">Username: <span className="font-normal">{user.username}</span></p>
          <p className="text-2xl font-bold">Email: <span className="font-normal">{user.email}</span></p>


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
                <input type="text" className="input input-bordered w-full" value={updatedInfo.oldUsername} onChange={(e) => setUpdatedInfo({ ...updatedInfo, oldUsername: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium">New Username</label>
                <input type="text" className="input input-bordered w-full" value={updatedInfo.newUsername} onChange={(e) => setUpdatedInfo({ ...updatedInfo, newUsername: e.target.value })} />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium">Old Email</label>
                <input type="email" className="input input-bordered w-full" value={updatedInfo.oldEmail} onChange={(e) => setUpdatedInfo({ ...updatedInfo, oldEmail: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium">New Email</label>
                <input type="email" className="input input-bordered w-full" value={updatedInfo.newEmail} onChange={(e) => setUpdatedInfo({ ...updatedInfo, newEmail: e.target.value })} />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium">Old Password</label>
                <input type="password" className="input input-bordered w-full" value={updatedInfo.oldPassword} onChange={(e) => setUpdatedInfo({ ...updatedInfo, oldPassword: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium">New Password</label>
                <input type="password" className="input input-bordered w-full" value={updatedInfo.newPassword} onChange={(e) => setUpdatedInfo({ ...updatedInfo, newPassword: e.target.value })} />
              </div>

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
