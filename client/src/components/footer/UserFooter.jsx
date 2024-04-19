import React from "react";
import "./userfooter.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookSquare,
  faInstagram,
  faPinterestSquare,
  faRedditSquare,
  faTwitterSquare,
} from "@fortawesome/free-brands-svg-icons";

function UserFooter() {
  return (
    <div className="footer">
      <div className="footer-bottom">
        <div className="links">
          <div className="textlinks">About us</div>
          <div className="textlinks">Terms and Conditions</div>
          <div className="textlinks">Privacy Policy</div>
          <div className="textlinks">Payment Terms of Use</div>
        </div>
        <div className="socialmedia">
          <FontAwesomeIcon icon={faInstagram} className="sicon" />
          <FontAwesomeIcon icon={faFacebookSquare} className="sicon" />
          <FontAwesomeIcon icon={faTwitterSquare} className="sicon" />
          <FontAwesomeIcon icon={faRedditSquare} className="sicon" />
          <FontAwesomeIcon icon={faPinterestSquare} className="sicon" />
        </div>
      </div>
      <div className="copyright">
        <p className="copywrite-txt">
          Copyright © 20024-2025 AIFashion Inc. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}

export default UserFooter;
