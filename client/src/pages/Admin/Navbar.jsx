import React from "react";
import "./../../css/adminNav.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faUser,
  faSignOutAlt,
  faUsers,
  faShirt,
  faBlog,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = ({ setActiveTab, isSuperAdmin }) => {
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/admin-login";
  };

  return (
    <div className="navbar-container">
      <a href="/admin-terminal"></a>
      <br />
      <h3>Seller Dashboard</h3>
      <br />
      <br />

      <div className="nav-items">
        <div className="nav-item" onClick={() => handleTabClick("product")}>
          <FontAwesomeIcon icon={faShirt} className="nav-icon" />
          <p>Products</p>
        </div>

        <div className="nav-item" onClick={() => handleTabClick("blog")}>
          <FontAwesomeIcon icon={faBlog} className="nav-icon" />

          <p>Blogs</p>
        </div>
        <div className="nav-item" onClick={handleSignOut}>
          <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" />
          <p>Sign Out</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
