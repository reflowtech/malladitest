import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Userdash from "../components/Userdash/Userdash";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue, set } from "firebase/database";
import Admindash from "../components/Admindash/Admindash";

const Homepage = () => {
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getCookie = async () => {
    try {
      const user = Cookies.get("user");
      if (user === undefined) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error while getting the user cookie:", error);
      navigate("/login");
    }
  };
  
  useEffect(() => {
    const fetchUserType = async () => {
      const jwt =  Cookies.get("jwt");
      const uid =  Cookies.get("uid");
      if (jwt === undefined) {
        navigate("/login");
      } else {
        const db = getDatabase();
        const userRef = ref(db, `users/${uid}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          setUserType(data.userType);
          setLoading(false); 
        });
      }
    };
    fetchUserType();
  }, [navigate]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
        } catch (error) {
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <>
      {loading ? (
        <div className="loader">
        <h1>Loading...!</h1>
      </div>
      ) : (
        <div className="main-box">
          {userType === "admin" ? <Admindash /> : <Userdash />}
        </div>
      )}
    </>
  );
};

export default Homepage;
