import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./Loginbox.css";

import Cookies from "js-cookie";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { app } from "../../firebase/firebase";

const auth = getAuth();

const Loginbox = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);

  document.title = "Login | ReFlow";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [LoginBtnValue, setLoginButtonValue] = useState("Login");
  const navigate = useNavigate();

  const [imageValue, setImageValue] = useState(
    Math.floor(Math.random() * 11) + 1
  );

  const [notification, setNotification] = useState({
    Name: "notification slideXto0",
    Message: "No message",
  });

  const handelNotificationtoggle = (event) => {
    setNotification({
      ...notification,
      Name:
        notification.Name === "notification"
          ? "notification slideXto0"
          : "notification",
    });
  };

  const getCookie = async () => {
    try {
      const user = await Cookies.get("jwt");
      if (user != undefined) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error while getting the user cookie:", error);
    }
  };
  getCookie();

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoginButtonValue("Logging...");
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        if (userCredential.user.emailVerified === false) {
          setNotification({
            Name: "notification",
            Message: "Please verify your email address",
          });
          scrollTo(0, 0);
          setLoginButtonValue("Login");
        } else {
          const user = userCredential.user;
          setCookie("user", user.email, { path: "/" });
          setCookie("name",user.email.split("@")[0], { path: "/" });
          setCookie("uid", user.uid,{ path: "/" });
          setCookie("jwt", user.accessToken,{ path: "/" });
          setLoginButtonValue("Login");
          navigate("/");
          window.location.reload();
        }
      })
      .catch((error) => {
        setLoginButtonValue("Login");
        if (error.code === "auth/invalid-credential") {
          window.scrollTo(0, 0);
          setNotification({
            Name: "notification",
            Message: "Invalid Credentials",
          });
        }
      });
  };

  return (
    <>
      <div className={notification.Name} onClick={handelNotificationtoggle}>
        <p>{notification.Message}</p>
      </div>

      <section className="loginbox">
        <div className="loginleftbox">
          <img
            src={`\\images\\${imageValue}.jpg`}
            alt={`Image ${imageValue}`}
          />
        </div>
        <div className="loginrightbox">
          <form onSubmit={loginHandler}>
            <div className="logosection">
              <img className="reflow" src="\images\trans-bg.png" alt="" />
              <img className="reflow" src="\images\New-Logo.png" alt="" />
            </div>
            <h1>Welcome back!</h1>
            <h2>
              Simplify your workflow with our <b>Dashboard</b>.
              <br />
              Get started for free
            </h2>

            <div className="inputbox">
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <Link to="/resetpassword">Forgot Password?</Link>
            <button className="primary-btn">{LoginBtnValue}</button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Loginbox;
