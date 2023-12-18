import React, { useEffect } from "react";
import "./Welcome.css";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

const Welcome = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const handleClick = () => {
      navigate("/signup");
    };

    document.querySelector("button").addEventListener("click", handleClick);
  }, []);

  return (
    <div className="Welcome">
      <div className="intro">
        <div className="black"><h1 className="large" >Welcome to the Hidden Whisper</h1></div>
        <div className="white">
          <Button
            style={{
              width: "300px",
              height: "60px",
              position: "absolute",
              top: "350px",
              right: "200px",
            }}
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
