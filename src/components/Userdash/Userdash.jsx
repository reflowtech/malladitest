import "./Userdash.css";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import mqtt from "mqtt";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Userdash = () => {
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');

  const handleExport = async () => {
    const response = await fetch('/run-csv-script', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ startDateTime, endDateTime }),
    });

    if (response.ok) {
      const data = await response.blob();
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'AX301.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      console.error('Failed to run CSV script');
    }
  };

  const handleSecondExport = async () => {
    const response = await fetch('/run-second-csv-script', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ startDateTime, endDateTime }),
    });

    if (response.ok) {
      const data = await response.blob();
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'second_filtered_output.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      console.error('Failed to run second CSV script');
    }
  };

  document.title = "Dashboard | ReFlow";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // New state for loading indicator

  const [message, setMessage] = useState(null);
  const [allTopics, setAllTopics] = useState({});
  const [allTopics2, setAllTopics2] = useState({});
  const username = import.meta.env.VITE_MQTT_USERNAME;
  const password = import.meta.env.VITE_MQTT_PASSWORD;
  const topic = "AX3/01/#";
  const topic2 = "AX3/02/#";

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/");
      }
    });

    // Cleanup function to unsubscribe the observer when the component is unmounted
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const brokerUrl = "ws://reflow.online:9001";
    const options = {
      clientId: `mqtt-subscriber-${Math.random().toString(16).substr(2, 8)}`,
      username,
      password,
    };

    const client = mqtt.connect(brokerUrl, options);

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe(topic);
    });

    client.on("message", (receivedTopic, receivedMessage) => {
      const message = receivedMessage.toString();
      setLoading(false);
      setAllTopics((prevAllTopics) => ({
        ...prevAllTopics,
        [receivedTopic]: message,
      }));
    });

    return () => {
      client.end();
      console.log("Disconnected from MQTT broker");
    };
  }, [topic]);

  useEffect(() => {
    const brokerUrl = "ws://reflow.online:9001";
    const options = {
      clientId: `mqtt-subscriber-${Math.random().toString(16).substr(2, 8)}`,
      username,
      password,
    };

    const client = mqtt.connect(brokerUrl, options);

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe(topic2);
    });

    client.on("message", (receivedTopic, receivedMessage) => {
      const message = receivedMessage.toString();
      setLoading(false);
      setAllTopics2((prevAllTopics2) => ({
        ...prevAllTopics2,
        [receivedTopic]: message,
      }));
    });

    return () => {
      client.end();
      console.log("Disconnected from MQTT broker");
    };
  }, [topic2]);

  return (
    <>
      {loading ? (
        <div className="loader">
          <h1>Loading...!</h1>
        </div>
      ) : (
        <>
          <section className="main">
            <>
              <p style={{ textAlign: "left", width: "100%" }}>
                Hello, <strong>{Cookies.get("name")}</strong>{" "}
              </p>
              <p style={{ textAlign: "left", width: "100%" }}>
                <strong>Updated At: </strong>
                {allTopics2["AX3/02/MALLADI/UPDATE_TIME"] || "Loading..."}
              </p>

              <table>
                <thead>
                  <tr>
                    <th rowSpan={2}>Serial No</th>
                    <th rowSpan={2}>Readings</th>
                    <th rowSpan={2}>Status</th>
                    <th rowSpan={2}>Export Data</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{allTopics["AX3/01/MALLADI/CSV/1"] || "LOADING..."}</td>
                    <td>{allTopics["AX3/01/MALLADI/1/CALIBRATED_VALUE"] || "LOADING..."}</td>
                    <td
                      rowSpan={3}
                      style={{
                        background:
                          allTopics["AX3/01/MALLADI/STATUS"] === "Online" ? "green" : "rgb(245,106,94)",
                        color: "white",
                      }}
                    >
                      {allTopics["AX3/01/MALLADI/STATUS"] || "Loading..."}
                    </td>
                    <td
                      rowSpan={3}
                      style={{
                        background: "white",
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}>
                        <label style={{ fontSize: '12px', margin: '5px 0' }}>
                          Start Date and Time:
                          <input
                            type="datetime-local"
                            id="startDateTime"
                            value={startDateTime}
                            onChange={(e) => setStartDateTime(e.target.value)}
                            style={{
                              fontSize: '12px',
                              padding: '5px',
                              marginLeft: '5px',
                              borderRadius: '4px',
                              border: '1px solid #ccc'
                            }}
                          />
                        </label>
                        <label style={{ fontSize: '12px', margin: '5px 0' }}>
                          End Date and Time:
                          <input
                            type="datetime-local"
                            id="endDateTime"
                            value={endDateTime}
                            onChange={(e) => setEndDateTime(e.target.value)}
                            style={{
                              fontSize: '12px',
                              padding: '5px',
                              marginLeft: '5px',
                              borderRadius: '4px',
                              border: '1px solid #ccc'
                            }}
                          />
                        </label>
                        <button
                          className="btn-export"
                          onClick={handleExport}
                          style={{
                            fontSize: '14px',
                            padding: '8px 12px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            marginTop: '10px'
                          }}
                        >
                          EXPORT
                        </button>
                        <p style={{ fontSize: "12px", marginTop: "8px" }}>SNo: AX301</p>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>{allTopics["AX3/01/MALLADI/CSV/2"] || "LOADING..."}</td>
                    <td>{allTopics["AX3/01/MALLADI/2/CALIBRATED_VALUE"] || "LOADING..."}</td>
                  </tr>

                  <tr>
                    <td>{allTopics["AX3/01/MALLADI/CSV/3"] || "LOADING..."}</td>
                    <td>{allTopics["AX3/01/MALLADI/3/CALIBRATED_VALUE"] || "LOADING..."}</td>
                  </tr>
                </tbody>
              </table>

              <table>
                <thead>
                  <tr>
                    <th rowSpan={2}>Serial No</th>
                    <th rowSpan={2}>Readings</th>
                    <th rowSpan={2}>Status</th>
                    <th rowSpan={2}>Export Data</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{allTopics2["AX3/02/MALLADI/CSV/1"] || "No data available"}</td>
                    <td>{allTopics2["AX3/02/MALLADI/1/CALIBRATED_VALUE"] || "No data available"}</td>
                    <td
                      rowSpan={3}
                      style={{
                        background:
                          allTopics2["AX3/02/MALLADI/STATUS"] === "Online" ? "green" : "rgb(245,106,94)",
                        color: "white",
                      }}
                    >
                      {allTopics2["AX3/02/MALLADI/STATUS"] || "No data available"}
                    </td>
                    <td
                      rowSpan={3}
                      style={{
                        background: "white",
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}>
                        <label style={{ fontSize: '12px', margin: '5px 0' }}>
                          Start Date and Time:
                          <input
                            type="datetime-local"
                            id="startDateTime"
                            value={startDateTime}
                            onChange={(e) => setStartDateTime(e.target.value)}
                            style={{
                              fontSize: '12px',
                              padding: '5px',
                              marginLeft: '5px',
                              borderRadius: '4px',
                              border: '1px solid #ccc'
                            }}
                          />
                        </label>
                        <label style={{ fontSize: '12px', margin: '5px 0' }}>
                          End Date and Time:
                          <input
                            type="datetime-local"
                            id="endDateTime"
                            value={endDateTime}
                            onChange={(e) => setEndDateTime(e.target.value)}
                            style={{
                              fontSize: '12px',
                              padding: '5px',
                              marginLeft: '5px',
                              borderRadius: '4px',
                              border: '1px solid #ccc'
                            }}
                          />
                        </label>
                        <button
                          className="btn-export"
                          onClick={handleSecondExport}
                          style={{
                            fontSize: '14px',
                            padding: '8px 12px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            marginTop: '10px'
                          }}
                        >
                          EXPORT
                        </button>
                        <p style={{ fontSize: "12px", marginTop: "8px" }}>SNo: AX302</p>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>{allTopics2["AX3/02/MALLADI/CSV/2"] || "No data available"}</td>
                    <td>{allTopics2["AX3/02/MALLADI/2/CALIBRATED_VALUE"] || "No data available"}</td>
                  </tr>

                  <tr>
                    <td>{allTopics2["AX3/02/MALLADI/CSV/3"] || "No data available"}</td>
                    <td>{allTopics2["AX3/02/MALLADI/3/CALIBRATED_VALUE"] || "No data available"}</td>
                  </tr>
                </tbody>
              </table>
            </>
          </section>
        </>
      )}
    </>
  );
};

export default Userdash;
