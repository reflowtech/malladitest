import "./Registerbox.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { getDatabase, ref, push, onValue, get, set } from "firebase/database";
import { app } from "../../firebase/firebase";

const Registerbox = () => {
  document.title = "Malladi/Reflow | Register";
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");

  const [RegisterBtnValue, setRegisterButtonValue] = useState("Register");
  const [notification, setNotification] = useState({
    Name: "notification slideXto0",
    Message: "Internal Error",
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

  const registerNewUser = async (e) => {
    e.preventDefault();

    try {
      setRegisterButtonValue("Registering...");

      const auth = getAuth(app);
      const database = getDatabase(app);

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Get the user's UID
      const uid = userCredential.user.uid;

      // Set the user type in the database based on the selected type
      const userTypeRef = ref(database, `users/${uid}/userType`);
      await set(userTypeRef, userType);
      const emailRef = ref(database, `users/${uid}/email`);
      await set(emailRef, email);

      // Send email verification
      await sendEmailVerification(userCredential.user);

      setRegisterButtonValue("Registered!");
      setNotification({
        Name: "notification",
        Message: "Successfully registered!",
      });

      // Optionally, you can navigate the user to a different page after successful registration
      // navigate('/dashboard');
    } catch (error) {
      // Handle registration errors
      setNotification({
        Name: "notification",
        Message: error.message || "Internal Error",
      });
      setRegisterButtonValue("Register");
    }
  };

  return (
    <>
      <div className={notification.Name} onClick={handelNotificationtoggle}>
        <p>{notification.Message}</p>
      </div>

      <section className="register">
        <div className="registerbox">
          <form onSubmit={registerNewUser}>
            <div className="logosection">
              <img className="reflow" src="\images\trans-bg.png" alt="" />
              <img className="reflow" src="\images\New-Logo.png" alt="" />
            </div>
            <h1>Register!</h1>
            <h2>
              Give us some of <b>Your</b> information
              <br />
              Let's begin the <b>journey</b>
            </h2>

            <div className="inputbox">
              <select
                name="usertype"
                id="usertype"
                value={userType}
                onChange={(e) => {
                  setUserType(e.target.value);
                }}
              >
                <option value="" disabled>
                  Select User Type
                </option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
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
            <Link to="/login">Back to Login!</Link>
            <button className="primary-btn">{RegisterBtnValue}</button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Registerbox;
