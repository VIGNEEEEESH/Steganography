import React, { useContext, useState } from "react";
import "./Navbar.css";
import LogoImage from "../images/Logo.png"; // Replace with the path to your logo image

import { AuthContext } from "../Shared/Context/Auth-context";
import { Dropdown, Menu, Modal } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

const Navbar = () => {
  const auth = useContext(AuthContext);

  const navigate = useNavigate();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const handleLogout = (e) => {
    e.preventDefault();
    setLogoutModalVisible(true);
  };
  const handleLogoutConfirmed = () => {
    setLogoutModalVisible(false);
    auth.logout();
  };
  const handleLogoutCanceled = () => {
    setLogoutModalVisible(false);
  };

  return (
    <div className="navbar">
      <img src={LogoImage} alt="Logo" className="navbar-logo" height="80px" />
      {auth.isLoggedIn && (
        <a className="nav-link nav-link-fade-up" href="/">
          Home
        </a>
      )}
      {!auth.isLoggedIn && (
        <a className="nav-link nav-link-fade-up" href="/signup">
          SignIn/SignUp
        </a>
      )}
      <a className="nav-link nav-link-fade-up" href="#">
        Help
      </a>
      {auth.isLoggedIn && (
        <a
          className="nav-link nav-link-fade-up"
          href="#"
          onClick={handleLogout}
        >
          SignOut
        </a>
      )}

      <Modal
        visible={logoutModalVisible}
        title="Confirmation"
        onCancel={handleLogoutCanceled}
        onOk={handleLogoutConfirmed}
        okText="Logout"
        cancelText="Cancel"
        className="logoutModal"
      >
        <p>Are you sure you want to logout</p>
      </Modal>
    </div>
  );
};

export default Navbar;
