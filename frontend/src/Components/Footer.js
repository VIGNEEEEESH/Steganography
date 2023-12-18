import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faXTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import "./Footer.css";
import Logo from "../images/Logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        {/* <div className="row">
          <div className="col-md-4">
            <div className="col-md-4">
              <div className="footer-logo">
                <img src={Logo} alt="Logo" className="logo" />
              </div>
            </div>
            <div className="social-icons">
              <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </div>
          </div>
        </div> */}
        <div className="row-md-5">
          <div className="heading-row">
          <img src={Logo} alt="Logo" className="logo" />
            <div>
            <a href="#" className="social-icon">
              <center>  <FontAwesomeIcon icon={faFacebook}/></center>
              </a>
              <h1>About Us</h1>
              <h2>About Us</h2>
              <h3>About Us</h3>
              <h4>About Us</h4>
              <h5>About Us</h5>
              <h6>About Us</h6>
            </div>
            <div>
            <a href="#" className="social-icon">
               <center> <FontAwesomeIcon icon={faXTwitter}/></center>
              </a>
              <h1>Help</h1>
              <h2>Help</h2>
              <h3>Help</h3>
              <h4>Help</h4>
              <h5>Help</h5>
              <h6>Help</h6>
            </div>
            <div>
            <a href="#" className="social-icon">
           <center>     <FontAwesomeIcon icon={faInstagram} /></center>
              </a>
              <h1>Why Us?</h1>
              <h2>Why Us?</h2>
              <h3>Why Us?</h3>
              <h4>Why Us?</h4>
              <h5>Why Us?</h5>
              <h6>Why Us?</h6>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
