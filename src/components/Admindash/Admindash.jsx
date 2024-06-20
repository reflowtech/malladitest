import "./Admindash.css";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import mqtt from "mqtt";
import { getAuth, onAuthStateChanged } from "firebase/auth";


const Admindash = () => {
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
            a.download = 'filtered_output.csv';
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

  const [isVisible, setIsVisible] = useState(true);
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  
    const [value, setValue] = useState();
    const [value2, setValue2] = useState();
    const [value3, setValue3] = useState();
    
    const [Min1, setMin1] = useState();
    const [Max1, setMax1] = useState();

    const [Min2, setMin2] = useState();
    const [Max2, setMax2] = useState();

    const [Min3, setMin3] = useState();
    const [Max3, setMax3] = useState();

    const [cal1, setCal1] = useState();
    const [cal2, setCal2] = useState();
    const [cal3, setCal3] = useState();

    const [fac1, setFac1] = useState();
    const [fac2, setFac2] = useState();
    const [fac3, setFac3] = useState();


    const [value11, setValue11] = useState();
    const [value12, setValue12] = useState();
    const [value13, setValue13] = useState();
    
    const [Min11, setMin11] = useState();
    const [Max11, setMax11] = useState();

    const [Min12, setMin12] = useState();
    const [Max12, setMax12] = useState();

    const [Min13, setMin13] = useState();
    const [Max13, setMax13] = useState();

    const [cal11, setCal11] = useState();
    const [cal12, setCal12] = useState();
    const [cal13, setCal13] = useState();

    const [fac11, setFac11] = useState();
    const [fac12, setFac12] = useState();
    const [fac13, setFac13] = useState();

    const [time, setTime] = useState();
    
    
  
  document.title = "Dashboard | ReFlow";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // New state for loading indicator

  const [message, setMessage] = useState(null);
  const [allTopics, setAllTopics] = useState({});
  const [allTopics2, setAllTopics2] = useState({});
  const username = import.meta.env.VITE_MQTT_USERNAME;
  const password = import.meta.env.VITE_MQTT_PASSWORD;
  const topic = "AX3/01/MALLADI/#";
  const topic2 = "AX3/02/MALLADI/#";
  

  const temp = allTopics["AX3/01/MALLADI/1/VALUE"];

  

  
 

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
        } catch (error) {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    });

    // Cleanup function to unsubscribe the observer when the component is unmounted
    return () => unsubscribe();
  }, []);


  useEffect(() => {
    const brokerUrl = "ws://reflow.online:9001/";
    const options = {
      clientId: `mqtt-subscriber-${Math.random().toString(16).substr(2, 8)}`,
      username,
      password,
    };
  
    const client = mqtt.connect(brokerUrl, options);
  
    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe("AX3/01/MALLADI/CSV/1", (error) => {
        if (error) {
          console.error("Error subscribing to topic:", error);
        } else {
          console.log("Subscribed to topic 'AX3/01/MALLADI/CSV/1'");
        }
      });
    });
    client.subscribe("AX3/01/MALLADI/CSV/2");
    client.subscribe("AX3/01/MALLADI/CSV/3");


    client.subscribe("AX3/01/MALLADI/1/CONFIG/MIN");
    client.subscribe("AX3/01/MALLADI/1/CONFIG/MAX");

    client.subscribe("AX3/01/MALLADI/2/CONFIG/MIN");
    client.subscribe("AX3/01/MALLADI/2/CONFIG/MAX");

    client.subscribe("AX3/01/MALLADI/3/CONFIG/MIN");
    client.subscribe("AX3/01/MALLADI/3/CONFIG/MAX");

    client.subscribe("AX3/01/MALLADI/1/CONFIG/CALIBRATION");
    client.subscribe("AX3/01/MALLADI/2/CONFIG/CALIBRATION");
    client.subscribe("AX3/01/MALLADI/3/CONFIG/CALIBRATION");

    client.subscribe("AX3/01/MALLADI/1/CONFIG/FACTOR");
    client.subscribe("AX3/01/MALLADI/2/CONFIG/FACTOR");
    client.subscribe("AX3/01/MALLADI/3/CONFIG/FACTOR");


    //2


  
    client.on("message", (topic, message) => {
      
      if (topic === "AX3/01/MALLADI/CSV/1") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setValue(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/01/MALLADI/CSV/2") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setValue2(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/01/MALLADI/CSV/3") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setValue3(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/01/MALLADI/1/CONFIG/MIN") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setMin1(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/01/MALLADI/1/CONFIG/MAX") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setMax1(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/01/MALLADI/2/CONFIG/MIN") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setMin2(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/01/MALLADI/2/CONFIG/MAX") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setMax2(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/01/MALLADI/3/CONFIG/MIN") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setMin3(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/01/MALLADI/3/CONFIG/MAX") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setMax3(data); // Update the value state with the received message
        console.log(data);
      }

      if (topic === "AX3/01/MALLADI/1/CONFIG/CALIBRATION") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setCal1(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/01/MALLADI/2/CONFIG/CALIBRATION") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setCal2(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/01/MALLADI/3/CONFIG/CALIBRATION") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setCal3(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/01/MALLADI/1/CONFIG/FACTOR") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setFac1(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/01/MALLADI/2/CONFIG/FACTOR") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setFac2(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/01/MALLADI/3/CONFIG/FACTOR") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setFac3(data); // Update the value state with the received message
        console.log(data);
      }
    });
  
    return () => {
      client.end();
      console.log("Disconnected from MQTT broker");
    };
  }, []);

  useEffect(() => {
    const brokerUrl = "ws://reflow.online:9001/";
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

    // Initialize an object to store all topics and messages
    const allaTopics = {};
    


    client.on("message", (receivedTopic, receivedMessage) => {
      try {
        // Try to parse the incoming message as JSON
        const parsedMessage = JSON.parse(receivedMessage.toString());

        // Update the object with the latest message for the specific topic
        allaTopics[receivedTopic] = parsedMessage;
        

        setLoading(false);
        setAllTopics((prevAllTopics) => ({
          ...prevAllTopics,
          [receivedTopic]: parsedMessage,
        }));
      } catch (error) {}
    });
  
    
   

    return () => {
      client.end();
      console.log("Disconnected from MQTT broker");
    };
  }, [topic]);


  


  useEffect(() => {
    const brokerUrl = "ws://reflow.online:9001/";
    const options = {
      clientId: `mqtt-subscriber-${Math.random().toString(16).substr(2, 8)}`,
      username,
      password,
    };
    
  
  

    const client = mqtt.connect(brokerUrl, options);
    
    console.log("omayoma");
    client.on("connect", () => {
      console.log("Connected to MQTT broker");
    
      client.publish("AX3/01/MALLADI/CSV/1",value,{ retain: true });
      client.publish("AX3/01/MALLADI/CSV/2",value2,{ retain: true });
      client.publish("AX3/01/MALLADI/CSV/3",value3,{ retain: true });

      client.publish("AX3/01/MALLADI/1/CONFIG/MIN",Min1,{ retain: true });
      client.publish("AX3/01/MALLADI/1/CONFIG/MAX",Max1,{ retain: true });

      client.publish("AX3/01/MALLADI/2/CONFIG/MIN",Min2,{ retain: true });
      client.publish("AX3/01/MALLADI/2/CONFIG/MAX",Max2,{ retain: true });
      
      client.publish("AX3/01/MALLADI/3/CONFIG/MIN",Min3,{ retain: true });
      client.publish("AX3/01/MALLADI/3/CONFIG/MAX",Max3,{ retain: true });

      client.publish("AX3/01/MALLADI/1/CONFIG/CALIBRATION",cal1,{ retain: true });
      client.publish("AX3/01/MALLADI/2/CONFIG/CALIBRATION",cal2,{ retain: true });
      client.publish("AX3/01/MALLADI/3/CONFIG/CALIBRATION",cal3,{ retain: true });

      client.publish("AX3/01/MALLADI/1/CONFIG/FACTOR",fac1,{ retain: true });
      client.publish("AX3/01/MALLADI/2/CONFIG/FACTOR",fac2,{ retain: true });
      client.publish("AX3/01/MALLADI/3/CONFIG/FACTOR",fac3,{ retain: true });
      
    });

    return () => {
      client.end();
      console.log("Disconnected from MQTT broker");
    };
  }, [value, value2, value3, Min1,Max1,Min2,Max2,Min3,Max3,cal1,cal2,cal3,fac1,fac2,fac3]);






    
  

  useEffect(() => {
    const brokerUrl = "ws://reflow.online:9001/";
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

    // Initialize an object to store all topics and messages
    const allbTopics = {};
    


    client.on("message", (receivedTopic, receivedMessage) => {
      try {
        // Try to parse the incoming message as JSON
        const parsedMessage = JSON.parse(receivedMessage.toString());

        // Update the object with the latest message for the specific topic
        allbTopics[receivedTopic] = parsedMessage;
        

        setLoading(false);
        setAllTopics2((prevAllTopics) => ({
          ...prevAllTopics,
          [receivedTopic]: parsedMessage,
        }));
      } catch (error) {}
    });
  
    
   

    return () => {
      client.end();
      console.log("Disconnected from MQTT broker");
    };
  }, [topic2]);


  


  useEffect(() => {
    const brokerUrl = "ws://reflow.online:9001/";
    const options = {
      clientId: `mqtt-subscriber-${Math.random().toString(16).substr(2, 8)}`,
      username,
      password,
    };
    
  
  

    const client = mqtt.connect(brokerUrl, options);
    
    console.log("omayoma");
    client.on("connect", () => {
      console.log("Connected to MQTT broker");
    
      client.publish("AX3/01/MALLADI/CSV/1",value,{ retain: true });
      client.publish("AX3/01/MALLADI/CSV/2",value2,{ retain: true });
      client.publish("AX3/01/MALLADI/CSV/3",value3,{ retain: true });

      client.publish("AX3/01/MALLADI/1/CONFIG/MIN",Min1,{ retain: true });
      client.publish("AX3/01/MALLADI/1/CONFIG/MAX",Max1,{ retain: true });

      client.publish("AX3/01/MALLADI/2/CONFIG/MIN",Min2,{ retain: true });
      client.publish("AX3/01/MALLADI/2/CONFIG/MAX",Max2,{ retain: true });
      
      client.publish("AX3/01/MALLADI/3/CONFIG/MIN",Min3,{ retain: true });
      client.publish("AX3/01/MALLADI/3/CONFIG/MAX",Max3,{ retain: true });

      client.publish("AX3/01/MALLADI/1/CONFIG/CALIBRATION",cal1,{ retain: true });
      client.publish("AX3/01/MALLADI/2/CONFIG/CALIBRATION",cal2,{ retain: true });
      client.publish("AX3/01/MALLADI/3/CONFIG/CALIBRATION",cal3,{ retain: true });

      client.publish("AX3/01/MALLADI/1/CONFIG/FACTOR",fac1,{ retain: true });
      client.publish("AX3/01/MALLADI/2/CONFIG/FACTOR",fac2,{ retain: true });
      client.publish("AX3/01/MALLADI/3/CONFIG/FACTOR",fac3,{ retain: true });
      
    });

    return () => {
      client.end();
      console.log("Disconnected from MQTT broker");
    };
  }, [value, value2, value3, Min1,Max1,Min2,Max2,Min3,Max3,cal1,cal2,cal3,fac1,fac2,fac3]);



  





  //Seconds

    
  useEffect(() => {
    const brokerUrl = "ws://reflow.online:9001/";
    const options = {
      clientId: `mqtt-subscriber-${Math.random().toString(16).substr(2, 8)}`,
      username,
      password,
    };
  
    const client = mqtt.connect(brokerUrl, options);
  
    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe("AX3/02/MALLADI/CSV/1", (error) => {
        if (error) {
          console.error("Error subscribing to topic:", error);
        } else {
          console.log("Subscribed to topic 'AX3/01/MALLADI/CSV/1'");
        }
      });
    });
    client.subscribe("AX3/02/MALLADI/CSV/2");
    client.subscribe("AX3/02/MALLADI/CSV/3");


    client.subscribe("AX3/02/MALLADI/1/CONFIG/MIN");
    client.subscribe("AX3/02/MALLADI/1/CONFIG/MAX");

    client.subscribe("AX3/02/MALLADI/2/CONFIG/MIN");
    client.subscribe("AX3/02/MALLADI/2/CONFIG/MAX");

    client.subscribe("AX3/02/MALLADI/3/CONFIG/MIN");
    client.subscribe("AX3/02/MALLADI/3/CONFIG/MAX");

    client.subscribe("AX3/02/MALLADI/1/CONFIG/CALIBRATION");
    client.subscribe("AX3/02/MALLADI/2/CONFIG/CALIBRATION");
    client.subscribe("AX3/02/MALLADI/3/CONFIG/CALIBRATION");

    client.subscribe("AX3/02/MALLADI/1/CONFIG/FACTOR");
    client.subscribe("AX3/02/MALLADI/2/CONFIG/FACTOR");
    client.subscribe("AX3/02/MALLADI/3/CONFIG/FACTOR");

    client.subscribe("AX3/02/MALLADI/UPDATE_TIME");


  
    client.on("message", (topic, message) => {
      if (topic === "AX3/02/MALLADI/CSV/1") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setValue11(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/02/MALLADI/CSV/2") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setValue12(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/02/MALLADI/CSV/3") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setValue13(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/02/MALLADI/1/CONFIG/MIN") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setMin11(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/02/MALLADI/1/CONFIG/MAX") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setMax11(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/02/MALLADI/2/CONFIG/MIN") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setMin12(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/02/MALLADI/2/CONFIG/MAX") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setMax12(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/02/MALLADI/3/CONFIG/MIN") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setMin13(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/02/MALLADI/3/CONFIG/MAX") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setMax13(data); // Update the value state with the received message
        console.log(data);
      }

      if (topic === "AX3/02/MALLADI/1/CONFIG/CALIBRATION") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setCal11(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/02/MALLADI/2/CONFIG/CALIBRATION") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setCal12(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/02/MALLADI/3/CONFIG/CALIBRATION") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setCal13(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/02/MALLADI/1/CONFIG/FACTOR") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setFac11(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/02/MALLADI/2/CONFIG/FACTOR") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setFac12(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/02/MALLADI/3/CONFIG/FACTOR") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setFac13(data); // Update the value state with the received message
        console.log(data);
      }
      if (topic === "AX3/02/MALLADI/UPDATE_TIME") {
        const data = message.toString();
        console.log(`Received message on topic '${topic}':`, data);
        setTime(data); // Update the value state with the received message
        console.log(data);
      }
    });
  
    return () => {
      client.end();
      console.log("Disconnected from MQTT broker");
    };
  }, []);

  useEffect(() => {
    const brokerUrl = "ws://reflow.online:9001/";
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

    // Initialize an object to store all topics and messages
    const allaTopics = {};
    


    client.on("message", (receivedTopic, receivedMessage) => {
      try {
        // Try to parse the incoming message as JSON
        const parsedMessage = JSON.parse(receivedMessage.toString());

        // Update the object with the latest message for the specific topic
        allaTopics[receivedTopic] = parsedMessage;
        

        setLoading(false);
        setAllTopics((prevAllTopics) => ({
          ...prevAllTopics,
          [receivedTopic]: parsedMessage,
        }));
      } catch (error) {}
    });
  
    
   

    return () => {
      client.end();
      console.log("Disconnected from MQTT broker");
    };
  }, [topic]);


  


  useEffect(() => {
    const brokerUrl = "ws://reflow.online:9001/";
    const options = {
      clientId: `mqtt-subscriber-${Math.random().toString(16).substr(2, 8)}`,
      username,
      password,
    };
    
  
  

    const client = mqtt.connect(brokerUrl, options);
    
    console.log("omayoma");
    client.on("connect", () => {
      console.log("Connected to MQTT broker");
    
      client.publish("AX3/02/MALLADI/CSV/1",value11,{ retain: true });
      client.publish("AX3/02/MALLADI/CSV/2",value12,{ retain: true });
      client.publish("AX3/02/MALLADI/CSV/3",value13,{ retain: true });

      client.publish("AX3/02/MALLADI/1/CONFIG/MIN",Min11,{ retain: true });
      client.publish("AX3/02/MALLADI/1/CONFIG/MAX",Max11,{ retain: true });

      client.publish("AX3/02/MALLADI/2/CONFIG/MIN",Min12,{ retain: true });
      client.publish("AX3/02/MALLADI/2/CONFIG/MAX",Max12,{ retain: true });
      
      client.publish("AX3/02/MALLADI/3/CONFIG/MIN",Min13,{ retain: true });
      client.publish("AX3/02/MALLADI/3/CONFIG/MAX",Max13,{ retain: true });

      client.publish("AX3/02/MALLADI/1/CONFIG/CALIBRATION",cal11,{ retain: true });
      client.publish("AX3/02/MALLADI/2/CONFIG/CALIBRATION",cal12,{ retain: true });
      client.publish("AX3/02/MALLADI/3/CONFIG/CALIBRATION",cal13,{ retain: true });

      client.publish("AX3/02/MALLADI/1/CONFIG/FACTOR",fac11,{ retain: true });
      client.publish("AX3/02/MALLADI/2/CONFIG/FACTOR",fac12,{ retain: true });
      client.publish("AX3/02/MALLADI/3/CONFIG/FACTOR",fac13,{ retain: true });
      
    });

    return () => {
      client.end();
      console.log("Disconnected from MQTT broker");
    };
  }, [value11, value12, value13, Min11,Max11,Min12,Max12,Min13,Max13,cal11,cal12,cal13,fac11,fac12,fac13]);


  

  
  
  

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
              <div className="dashintro">
                <p style={{ textAlign: "left", width: "100%" }}>
                  Hello ADMIN ,{" "}
                  <strong>{Cookies.get("name")}</strong>{" "}
                </p>
                <Link to="/register">Add User</Link>
              </div>
              <div className="dashintro">
                <p style={{ textAlign: "left", width: "100%" }}>
                  <strong>Updated At :
                    </strong>{time || "Loading..."}
                </p>
                
              </div>

              <table>
                <thead>
                  <tr>
                    <th rowSpan={2}>Serial No</th>
                    <th colSpan={2} >Range</th>
                    <th rowSpan={2} >Calibration</th>
                    <th rowSpan={2}>Factor
  <p style={{ fontSize: 10, color: 'white', margin: 5 }}>Enter (* - + /)</p>
</th>
                    <th rowSpan={2}>Readings</th>
                    <th rowSpan={2}>Calibrated Readings</th>
                    <th rowSpan={2}>Temperature Level</th>
                    <th rowSpan={2}>Status</th>
                    <th rowSpan={2}>Export Data</th>
                  </tr>
                  <tr >
                    <th >Min</th>
                    <th >Max</th>
                  </tr>
                </thead>
                <tbody>

                  <tr>
                  <td><input type="text" value={value || "LOADING.."} onChange={(e) => setValue(e.target.value)} /> </td>
                  <td ><input type="number" min="-Infinity" max="Infinity" value={Min1|| "LOADING.."} onChange={(e) => setMin1(e.target.value)} /></td>
                  <td ><input type="number" min="-Infinity" max="Infinity" value={Max1 || "LOADING.."}onChange={(e) => setMax1(e.target.value)} /></td>
                  <td ><input type="number" min="-Infinity" max="Infinity" value={parseFloat(cal1).toFixed(2) || "" }onChange={(e) => setCal1(e.target.value)} /></td>
                  <td><input type="text" min="-Infinity" max="Infinity" value={fac1 || "" }onChange={(e) => setFac1(e.target.value)}/></td>
                    <td>
                      {parseFloat(allTopics["AX3/01/MALLADI/1/VALUE"]).toPrecision(
                        4
                      ) || "LOADING...."}  &deg;C
                    </td>
                    <td>
                      {parseFloat(
                        allTopics["AX3/01/MALLADI/1/CALIBRATED_VALUE"]
                      ).toPrecision(4) || "LOADING...."}  &deg;C
                    </td>
                    <td>
                      <meter
                        value={parseFloat(allTopics["AX3/01/MALLADI/1/CALIBRATED_VALUE"]) || 0}
                        min={allTopics["AX3/01/MALLADI/1/CONFIG/MIN"]}
                        max={allTopics["AX3/01/MALLADI/1/CONFIG/MAX"]}
                      ></meter>
                    </td>

                    <td
                      rowSpan={3}
                      
                      style={{
                        background:
                          
                         "Online" ? "green" : "rgb(245,106,94)",
                        color: "white",
                      }}
                    >
                      {allTopics["AX3/01/MALLADI/STATsUS"] || "ONLINE"}
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
            {/* <img className="gear" style={{marginTop:"30px"}} onClick={toggleVisibility} src="./images/gear_icon.png" alt="gear" /> */}
            <p style={{fontSize:"12px", marginTop:"8px"}}>SNo: AX301</p>
        </div>
                    </td>
                  </tr>

                  <tr>
                  <td><input type="text" value={value2 || "LOADING.."} onChange={(e) => setValue2(e.target.value)} /> </td>
                  <td ><input type="number" min="-Infinity" max="Infinity" value={Min2|| "LOADING.."} onChange={(e) => setMin2(e.target.value)}/></td>
                  <td ><input type="number" min="-Infinity" max="Infinity" value={Max2|| "LOADING.."} onChange={(e) => setMax2(e.target.value)}/></td>
                  <td ><input type="number" min="-Infinity" max="Infinity" value={parseFloat(cal2).toFixed(2) || "" } onChange={(e) => setCal2(e.target.value)} /></td>
                  <td><input type="text" min="-Infinity" max="Infinity" value={fac2 || "" }onChange={(e) => setFac2(e.target.value)}/></td>
                    <td>
                      {parseFloat(allTopics["AX3/01/MALLADI/2/VALUE"]).toPrecision(
                        4
                      ) || "LOADING...."}  &deg;C
                    </td>
                    <td>
                      {parseFloat(
                        allTopics["AX3/01/MALLADI/2/CALIBRATED_VALUE"]
                      ).toPrecision(4) || "LOADING...."}  &deg;C
                    </td>
                    <td>
                      <meter
                        value={parseFloat(allTopics["AX3/01/MALLADI/2/VALUE"]) || 0}
                        min={allTopics["AX3/01/MALLADI/2/CONFIG/MIN"]}
                        max={allTopics["AX3/01/MALLADI/2/CONFIG/MAX"]}
                      ></meter>
                    </td>
                  </tr>

                  <tr>
                  <td><input type="text" value={value3 || "LOADING.."} onChange={(e) => setValue3(e.target.value)} /> </td>
                  <td ><input type="number" min="-Infinity" max="Infinity" value={Min3|| "LOADING.."} onChange={(e) => setMin3(e.target.value)}/></td>
                  <td ><input type="number" min="-Infinity" max="Infinity" value={Max3|| "LOADING.."} onChange={(e) => setMax3(e.target.value)}/></td>
                  <td ><input type="number" min="-Infinity" max="Infinity" value={parseFloat(cal3).toFixed(2) || "LOADING...." } onChange={(e) => setCal3(e.target.value)}/></td>
                  <td><input type="text" min="-Infinity" max="Infinity" value={fac3 || "" }onChange={(e) => setFac3(e.target.value)}/></td>
                    <td>
                      {parseFloat(allTopics["AX3/01/MALLADI/3/VALUE"]).toPrecision(
                        4
                      )  || "LOADING...."} &deg;C
                    </td>
                    <td>
                      {parseFloat(
                        allTopics["AX3/01/MALLADI/3/CALIBRATED_VALUE"]
                      ).toPrecision(4) || "LOADING...."}  &deg;C
                    </td>
                    <td>
                      <meter
                        value={parseFloat(allTopics["AX3/01/MALLADI/3/VALUE"]) || 0}
                        min={allTopics["AX3/01/MALLADI/3/CONFIG/MIN"]}
                        max={allTopics["AX3/01/MALLADI/3/CONFIG/MAX"]}
                      ></meter>
                    </td>
                  </tr>
                </tbody>
              </table>


                        








                      
              <table style={{marginTop:"90px"}}>
              <thead>
                  <tr>
                    <th rowSpan={2}>Serial No</th>
                    <th colSpan={2} >Range</th>
                    <th rowSpan={2} >Calibration</th>
                    <th rowSpan={2}>Factor
  <p style={{ fontSize: 10, color: 'white', margin: 5 }}>Enter (* - + /)</p>
</th>
                    <th rowSpan={2}>Readings</th>
                    <th rowSpan={2}>Calibrated Readings</th>
                    <th rowSpan={2}>Temperature Level</th>
                    <th rowSpan={2}>Status</th>
                    <th rowSpan={2}>Export Data</th>
                  </tr>
                  <tr >
                    <th >Min</th>
                    <th >Max</th>
                  </tr>
                </thead>
                <tbody>

                  <tr>
                  <td><input type="text" value={value11 || "LOADING.."} onChange={(e) => setValue11(e.target.value)} /> </td>
                  <td ><input type="number" min="-Infinity" max="Infinity" value={Min11|| "LOADING.."} onChange={(e) => setMin11(e.target.value)} /></td>
                  <td ><input type="number" min="-Infinity" max="Infinity" value={Max11 || "LOADING.."}onChange={(e) => setMax11(e.target.value)} /></td>
                  <td ><input type="number" min="-Infinity" max="Infinity" value={parseFloat(cal11).toFixed(2) || "" }onChange={(e) => setCal11(e.target.value)} /></td>
                  <td><input type="text" min="-Infinity" max="Infinity" value={fac11 || "" }onChange={(e) => setFac11(e.target.value)}/></td>
                    <td>
                      {parseFloat(allTopics2["AX3/02/MALLADI/1/VALUE"]).toPrecision(
                        4
                      ) || "LOADING...."}  &deg;C
                    </td>
                    <td>
                      {parseFloat(
                        allTopics2["AX3/02/MALLADI/1/CALIBRATED_VALUE"]
                      ).toPrecision(4) || "LOADING...."}  &deg;C
                    </td>
                    <td>
                      <meter
                        value={parseFloat(allTopics2["AX3/02/MALLADI/1/CALIBRATED_VALUE"]) || 0}
                        min={allTopics2["AX3/02/MALLADI/1/CONFIG/MIN"]}
                        max={allTopics2["AX3/02/MALLADI/1/CONFIG/MAX"]}
                      ></meter>
                    </td>

                    <td
                      rowSpan={3}
                      
                      style={{
                        background:
                          
                         "Online" ? "green" : "rgb(245,106,94)",
                        color: "white",
                      }}
                    >
                      {allTopics["AX3/01/MALLADI/STATsUS"] || "ONLINE"}
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
                {/* <img className="gear" style={{marginTop:"30px"}} onClick={toggleVisibility} src="./images/gear_icon.png" alt="gear" /> */}
                <p style={{fontSize:"12px", marginTop:"8px"}}>SNo: AX302</p>
            </div>

                    </td>
                  </tr>

                  <tr>
                  <td><input type="text" value={value12 || "LOADING.."} onChange={(e) => setValue12(e.target.value)} /> </td>
                  <td ><input type="number" min="-Infinity" max="Infinity" value={Min12|| "LOADING.."} onChange={(e) => setMin12(e.target.value)}/></td>
                  <td ><input type="number" min="-Infinity" max="Infinity" value={Max12|| "LOADING.."} onChange={(e) => setMax12(e.target.value)}/></td>
                  <td ><input type="number" min="-Infinity" max="Infinity" value={parseFloat(cal12).toFixed(2) || "" } onChange={(e) => setCal12(e.target.value)} /></td>
                  <td><input type="text" min="-Infinity" max="Infinity" value={fac12 || "" }onChange={(e) => setFac12(e.target.value)}/></td>
                    <td>
                      {parseFloat(allTopics2["AX3/02/MALLADI/2/VALUE"]).toPrecision(
                        4
                      ) || "LOADING...."}  &deg;C
                    </td>
                    <td>
                      {parseFloat(
                        allTopics2["AX3/02/MALLADI/2/CALIBRATED_VALUE"]
                      ).toPrecision(4) || "LOADING...."}  &deg;C
                    </td>
                    <td>
                      <meter
                        value={parseFloat(allTopics["AX3/01/MALLADI/2/VALUE"]) || 0}
                        min={allTopics2["AX3/02/MALLADI/2/CONFIG/MIN"]}
                        max={allTopics2["AX3/02/MALLADI/2/CONFIG/MAX"]}
                      ></meter>
                    </td>
                  </tr>

                  <tr>
                  <td><input type="text" value={value13 || "LOADING.."} onChange={(e) => setValue13(e.target.value)} /> </td>
                  <td ><input type="number" min="-Infinity" max="Infinity" value={Min13|| "LOADING.."} onChange={(e) => setMin13(e.target.value)}/></td>
                  <td ><input type="number" min="-Infinity" max="Infinity" value={Max13|| "LOADING.."} onChange={(e) => setMax13(e.target.value)}/></td>
                  <td ><input type="number" min="-Infinity" max="Infinity" value={parseFloat(cal13).toFixed(2) || "LOADING...." } onChange={(e) => setCal13(e.target.value)}/></td>
                  <td><input type="text" min="-Infinity" max="Infinity" value={fac13 || "" }onChange={(e) => setFac13(e.target.value)}/></td>
                    <td>
                      {parseFloat(allTopics2["AX3/02/MALLADI/3/VALUE"]).toPrecision(
                        4
                      )  || "LOADING...."} &deg;C
                    </td>
                    <td>
                      {parseFloat(
                        allTopics2["AX3/02/MALLADI/3/CALIBRATED_VALUE"]
                      ).toPrecision(4) || "LOADING...."}  &deg;C
                    </td>
                    <td>
                      <meter
                        value={parseFloat(allTopics["AX3/01/MALLADI/3/VALUE"]) || 0}
                        min={allTopics2["AX3/02/MALLADI/3/CONFIG/MIN"]}
                        max={allTopics2["AX3/02/MALLADI/3/CONFIG/MAX"]}
                      ></meter>
                    </td>
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

export default Admindash;
