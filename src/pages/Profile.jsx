import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase"; 
import { doc, getDoc } from "firebase/firestore";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const docRef = doc(db, "users", auth.currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUser(docSnap.data());
          } else {
            console.log("No such document!");
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, user, { merge: true }); 
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update profile: " + err.message);
    }
  };

  if (loading) {
    return <p className="mt-4 p-4">Loading profile...</p>;
  }

  if (!auth.currentUser) {
    return (
      <div className="mt-4 p-4">
        <h2>Profile</h2>
        <p>Please log in or create an account to access your profile.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4">
      <h2 className="mb-4">Profile</h2>

      <div className="card shadow-sm p-4" style={{ maxWidth: "500px" }}>
        <div className="mb-3">
          <label className="form-label"><strong>Name:</strong></label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={user.name}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="mb-3">
          <label className="form-label"><strong>Email:</strong></label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={user.email}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label"><strong>Phone:</strong></label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="mb-3">
          <label className="form-label"><strong>Address:</strong></label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={user.address}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div>
          {isEditing ? (
            <>
              <button className="btn btn-success me-2" onClick={handleSave}>
                Save
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
