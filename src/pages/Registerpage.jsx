import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Registerbox from "../components/Registerbox/Registerbox";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { useCookies } from "react-cookie";

const Registerpage = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);
  const [loading, setLoading] = useState(true);
  const [renderPage, setRenderPage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchuser = async () => {
      const uid = Cookies.get("uid");
      if (uid === undefined) {
        navigate("/login");
      } else {
        const db = getDatabase();
        const userRef = ref(db, `users/${uid}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data.userType !== "admin") {
            navigate("/");
          } else {
            setRenderPage(true);
            setLoading(false); // Set loading to false when user type is fetched
          }
        });
      }
    };
    fetchuser();
  }, [navigate]);

  return (
    <>
      {loading ? (
        <div className="loader">
          <h1>Loading...!</h1>
        </div>
      ) : (
        <div className="main-box">{renderPage && <Registerbox />}</div>
      )}
    </>
  );
};

export default Registerpage;
