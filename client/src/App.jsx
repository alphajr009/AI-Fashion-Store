import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import SignUp from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import ForgetPassword from "./pages/ForgetPassword.jsx";
import AdminLogin from "./pages/Admin/AdminLogin.jsx";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import Blog from "./pages/Blog.jsx";
import BlogItem from "./pages/BlogItem.jsx";
import Account from "./pages/Account.jsx";
import ProductItem from "./pages/ProductItem.jsx";
import FindColor from "./pages/FindColor.jsx";
import MatchedColour from "./pages/MatchedColour.jsx";
import Discover from "./pages/Discover.jsx";

function App() {
  const UserRouteGuard = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (user) {
      return children;
    } else {
      return <Navigate to="/login" />;
    }
  };

  const AdminRouteGuard = ({ children }) => {
    const admin = JSON.parse(localStorage.getItem("currentUser"));

    if (admin && admin.isAdmin) {
      return children;
    } else {
      return <Navigate to="/login" />;
    }
  };

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} exact />
          <Route path="/login" element={<Login />} exact />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          <Route
            path="/account"
            element={
              <UserRouteGuard>
                <Account />
              </UserRouteGuard>
            }
          />

          <Route
            path="/find-color"
            element={
              <UserRouteGuard>
                <FindColor />
              </UserRouteGuard>
            }
          />

          <Route
            path="/matching-colors/:tokenID"
            element={
              <UserRouteGuard>
                <MatchedColour />
              </UserRouteGuard>
            }
          />

          <Route
            path="/matching-colors/:tokenID"
            element={
              <UserRouteGuard>
                <MatchedColour />
              </UserRouteGuard>
            }
          />

          <Route
            path="/discover/:color"
            element={
              <UserRouteGuard>
                <Discover />
              </UserRouteGuard>
            }
          />
          <Route
            path="/"
            element={
              <UserRouteGuard>
                <Home />
              </UserRouteGuard>
            }
          />

          <Route
            path="/blog"
            element={
              <UserRouteGuard>
                <Blog />
              </UserRouteGuard>
            }
          />

          <Route
            path="/admin-terminal"
            element={
              <AdminRouteGuard>
                <Dashboard />
              </AdminRouteGuard>
            }
          />

          <Route
            path="/blog/:blogid"
            element={
              <UserRouteGuard>
                <BlogItem />
              </UserRouteGuard>
            }
          />
          <Route
            path="/product/:productid"
            element={
              <UserRouteGuard>
                <ProductItem />
              </UserRouteGuard>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
