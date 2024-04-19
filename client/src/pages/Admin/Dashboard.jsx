import React, { useState } from "react";
import "../../css/dashboard.css";
import Navbar from "./Navbar";
import Products from "../../components/admin/Products";
import Blogs from "../../components/admin/Blogs";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("product");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="navbar-tutors-container">
      <Navbar setActiveTab={handleTabChange} />
      <div className="tutors-profile-container">
        {activeTab === "product" && <Products />}
        {activeTab === "blog" && <Blogs />}
        {activeTab === "signout" && <Products />}
      </div>
    </div>
  );
}

export default Dashboard;
