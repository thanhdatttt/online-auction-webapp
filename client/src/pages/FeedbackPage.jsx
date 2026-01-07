import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/axios"; 
import ProfileLayout from "../components/Profile/ProfileLayout.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const FeedbackPage = () => {
  const { userId } = useParams();
  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        // Ensure you have an API endpoint to get public user info by ID
        // Example: GET /api/users/:id
        const res = await api.get(`/users/${userId}`); 
        // Adjust 'res.data.user' based on your actual API response structure
        setTargetUser(res.data.user); 
      } catch (error) {
        console.error("Failed to load user info", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (loading) return <div className="mt-20 text-center">Loading...</div>;
  if (!targetUser) return <div className="mt-20 text-center">User not found</div>;

  return (
    <>
      <Header />
      <ProfileLayout isPublic={true} targetUser={targetUser} />
      <Footer />
    </>
  );
};

export default FeedbackPage;