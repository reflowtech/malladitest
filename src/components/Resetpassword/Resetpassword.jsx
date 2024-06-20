import "./Resetpassword.css";
import React,{useState} from "react";
import { Link,useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

import { app } from "../../firebase/firebase";

const Resetpassword = () => {
  document.title = "Malladi/Reflow | Forgot Password ";
  const [email,setEmail] = useState('');
  const [buttontext,setButtontext] = useState('Reset');

  const navigate = useNavigate();

  const [notification,setNotification] = useState({
    Name: "notification slideXto0",
    Message: "Internal Error",
  });

  const handelNotificationtoggle = (event) => {
    setNotification({...notification,
      Name: notification.Name === "notification"? "notification slideXto0" : "notification",
    });
  };

  const handelClick = async (e) => {
    e.preventDefault()
    try {

      setButtontext('Sending..');
      // Get the auth instance
      const auth = getAuth(app);
      
      // Send password reset email
      await sendPasswordResetEmail(auth, email);

      // Update the message and button text
      let message = "If the email is registered with us, you will receive a password reset link on your email address.";
      setNotification({
        Name: "notification",
        Message: message,
      });

      setTimeout(() => {
        setButtontext('Reset');
        // Redirect to another page (replace '/new-page' with your desired route)
        navigate('/login');
      }, 3000);
    } catch (error) {
      // Handle any errors here
      setNotification({
        Name: "notification",
        Message: error.message,
      });
      setButtontext('Reset');
    }
  }


  return (
    <>
      <div className={notification.Name} onClick={handelNotificationtoggle}>
        <p>{notification.Message}</p>
      </div>
      <section className="resetpasssword">
        <form onSubmit={handelClick}>
          <div className="logosection">
            <img className="reflow" src="\images\trans-bg.png" alt="" />
            <img className="reflow" src="\images\New-Logo.png" alt="" />
          </div>
          <h1>Reset password</h1>
          <h2>
            Enter the <b>Email</b> you used to register with
          </h2>

          <div className="inputbox">
            <input required type="email" placeholder="Email"  onChange={(e) => setEmail(e.target.value)} value={email}/>
          </div>

          <Link to="/login">Back to login</Link>

          <button className="primary-btn">{buttontext}</button>
        </form>
      </section>
    </>
  );
};

export default Resetpassword;
