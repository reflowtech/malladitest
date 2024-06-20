import React, { useEffect, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import "./Header.css";

import Cookies from "js-cookie";

const Header = () => {
  const [navMenu, setNaveMenu] = useState({ Name: "navlinks" });
  const [user, setUser] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setNaveMenu({
      Name: navMenu.Name === "navlinks" ? "navlinks slideXto0" : "navlinks",
    });
  };

  const handleLogout = () => {
    Cookies.remove("jwt");
    Cookies.remove("uid");
    Cookies.remove("name");
    Cookies.remove("user");
    setUser(false);
    window.location.reload();
  };

  useEffect(() => {
    const getCookie = async () => {
      try {
        const userCheck = await Cookies.get("user");
        if (userCheck == undefined) {
          setUser(false);
        }
        else{
          setUser(true);
        }
      } catch (error) {
        console.error("Error while getting the user cookie:", error);
      }
    };
    getCookie();
  },[]);

  return (
    <>
      <section className="header">
        <div className="logobox">
          <Link to="/">
            <img className="reflow" src="\images\logo.png" alt="" />
          </Link>
        </div>

        <img
          className="menubtn"
          src="https://img.icons8.com/ios-filled/25/menu--v1.png"
          alt="menu--v1"
          onClick={toggleMenu}
        />
        <div className={navMenu.Name}>
          <Link>Dashboard</Link>
          <Link>Help Center</Link>
          {user  === false ? (
            <Link to="/login">
              <button className="primary-btn">Login</button>
            </Link>
          ) : (
            <Link>
              <button className="primary-btn" onClick={handleLogout}>
                Logout
              </button>
            </Link>
          )}
        </div>
      </section>
    </>
  );
};

export default Header;
