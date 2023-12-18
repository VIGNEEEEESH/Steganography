import React, { useEffect, useState } from "react";
import { Card } from "antd";
import "./Contacts.css";
import { useNavigate } from "react-router-dom";

const gridStyle = {
  width: "25%",
  textAlign: "center",
};

const Contacts = () => {
  const [userdata, setUserdata] = useState([]);
  const navigate=useNavigate()
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `https://steganography.onrender.com/api/hiddenwhisper/user/get/allusers`
        );
        const jsonData = await response.json();
        setUserdata(jsonData.users);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="Contacts">
      <Card title="Contacts">
        {userdata.map((user, index) => (
          <Card.Grid key={index} style={gridStyle} onClick={()=>navigate(`/sendmessage/${user._id}`)}>
            <div>
              <h3>{user.name}</h3>
              <p>Email: {user.email}</p>
              
            </div>
          </Card.Grid>
        ))}
      </Card>
    </div>
  );
};

export default Contacts;
