import React, { useState, useContext } from "react";
import * as Components from "../Components";
import JSEncrypt from "jsencrypt";

import { AuthContext } from "../Shared/Context/Auth-context";

import { message } from "antd";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [signIn, toggle] = useState(true);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      const recipientRsa = new JSEncrypt();
      recipientRsa.getKey();

      const publicKey = recipientRsa.getPublicKeyB64();
      const privateKey = recipientRsa.getPrivateKeyB64();

      const requestData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        publicKey,
        privateKey,
      };

      const response = await fetch(
        "https://steganography.onrender.com/api/hiddenwhisper/user/createuser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
          body: JSON.stringify(requestData),
        }
      );
      const responseData = await response.json();
      auth.login(responseData.userId, responseData.token);
      if (!response.ok) {

        if (responseData && responseData.error) {
          message.error(responseData.error);
        } else {
          console.log("An error occurred:", responseData);
        }
      } else {
        message.success("Account successfully created");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const handleSignInChange = (event) => {
    const { name, value } = event.target;
    setSignInData({
      ...signInData,
      [name]: value,
    });
  };

  const handleSignInSubmit = async (event) => {
    event.preventDefault();

    try {
      const requestData = {
        email: signInData.email,
        password: signInData.password,
      };

      const response = await fetch(
        "https://steganography.onrender.com/api/hiddenwhisper/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
          body: JSON.stringify(requestData),
        }
      );
      const responseData = await response.json();
      console.log(responseData)
      auth.login(responseData.userId, responseData.token);
      if (!response.ok) {

        if (responseData && responseData.error) {
          message.error(responseData.error);
        } else {
          console.log("An error occurred:", responseData);
        }
      } else {
        message.success("Sign-in successful");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Components.Container>
      <Components.SignUpContainer signinIn={signIn}>
        <Components.Form>
          <Components.Title>Create Account</Components.Title>
          <Components.Input
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <Components.Input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Components.Input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <Components.Button onClick={submitHandler}>Sign Up</Components.Button>
        </Components.Form>
      </Components.SignUpContainer>

      <Components.SignInContainer signinIn={signIn}>
        <Components.Form>
          <Components.Title>Sign in</Components.Title>
          <Components.Input
            type="email"
            placeholder="Email"
            name="email"
            value={signInData.email}
            onChange={handleSignInChange}
          />
          <Components.Input
            type="password"
            placeholder="Password"
            name="password"
            value={signInData.password}
            onChange={handleSignInChange}
          />
          <Components.Anchor href="#">Forgot your password?</Components.Anchor>
          <Components.Button onClick={handleSignInSubmit}>
            Sign In
          </Components.Button>
        </Components.Form>
      </Components.SignInContainer>

      <Components.OverlayContainer signinIn={signIn}>
        <Components.Overlay signinIn={signIn}>
          <Components.LeftOverlayPanel signinIn={signIn}>
            <Components.Title>Welcome Back!</Components.Title>
            <Components.Paragraph></Components.Paragraph>
            <Components.GhostButton onClick={() => toggle(true)}>
              Sign In
            </Components.GhostButton>
          </Components.LeftOverlayPanel>

          <Components.RightOverlayPanel signinIn={signIn}>
            <Components.Title>Hello, Friend!</Components.Title>
            <Components.Paragraph></Components.Paragraph>
            <Components.GhostButton onClick={() => toggle(false)}>
              Sign Up
            </Components.GhostButton>
          </Components.RightOverlayPanel>
        </Components.Overlay>
      </Components.OverlayContainer>
    </Components.Container>
  );
}

export default Signup;
