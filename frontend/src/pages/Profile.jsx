import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation hook

export default function Settings() {
  const navigate = useNavigate(); // ✅ Initialize navigation

  const [user, setUser] = useState({ name: "User", email: "user@example.com", password: "********" });
  const [profilePicture, setProfilePicture] = useState(""); 
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({ name: "", email: "", currentPassword: "", newPassword: "" });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setProfilePicture(storedUser.profilePicture || "https://via.placeholder.com/150/10b981/ffffff?text=G+G");
    } else {
      setProfilePicture("https://via.placeholder.com/150/10b981/ffffff?text=G+G");
    }
  }, []);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePicture(imageUrl);
      localStorage.setItem("user", JSON.stringify({ ...user, profilePicture: imageUrl }));
    }
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();

    if (!updatedInfo.currentPassword || !updatedInfo.newPassword) {
      alert("Please fill all fields before submitting.");
      return;
    }

    const updatedUser = { ...user, name: updatedInfo.name, email: updatedInfo.email, password: updatedInfo.newPassword };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    setShowEditModal(false);
    setShowSuccess(true);

    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Settings:</h1>

      {/* User Info Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-4">
        <div className="flex items-center space-x-6">
          <img src={profilePicture} alt="Profile" className="w-28 h-28 rounded-full border-4 border-gray-300" />
          <div className="text-lg">
            <p className="font-semibold text-xl">Name: {user.name}</p>
            <p className="text-gray-700 text-lg">Email: {user.email}</p>
            <p className="text-gray-700 text-lg">Password: ********</p>
          </div>
        </div>
        
        {/* Buttons Side by Side */}
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
            <form onSubmit={handleUpdateInfo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input type="text" className="input input-bordered w-full" value={updatedInfo.name} onChange={(e) => setUpdatedInfo({ ...updatedInfo, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input type="email" className="input input-bordered w-full" value={updatedInfo.email} onChange={(e) => setUpdatedInfo({ ...updatedInfo, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium">Current Password</label>
                <input type="password" className="input input-bordered w-full" value={updatedInfo.currentPassword} onChange={(e) => setUpdatedInfo({ ...updatedInfo, currentPassword: e.target.value })} />
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

      {/* ✅ Fixed Return to Dashboard Button */}
      <button className="btn btn-primary mt-8 w-full" onClick={() => navigate("/dashboard")}>
        Return to Dashboard
      </button>
    </div>
  );
}
