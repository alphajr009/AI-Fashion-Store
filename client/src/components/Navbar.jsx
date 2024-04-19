import React, { Component } from "react";
import LeftMenu from "./LeftMenu";
import RightMenu from "./RightMenu";
import { Drawer, Button } from "antd";
import Logo from "../assets/logooo.png";

import "../css/navigationBar.css";

class Navbar extends Component {
  state = {
    current: "mail",
    visible: false,
    isMobileView: false,
  };

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize = () => {
    const isMobileView = window.innerWidth < 768;
    this.setState({ isMobileView });
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { isMobileView } = this.state;

    const user = JSON.parse(localStorage.getItem("currentUser"));

    return (
      <nav className="menuBar">
        <>
          <div className="logo">
            <a href="/">
              <img src={Logo} alt="Logo" />
            </a>
          </div>
          <div className="menuCon">
            {!isMobileView && (
              <>
                <div className="leftMenu">
                  <LeftMenu />
                </div>
                <div className="rightMenu">
                  <RightMenu />
                </div>
              </>
            )}
            {isMobileView && (
              <>
                <Button
                  className="barsMenu"
                  type="primary"
                  onClick={this.showDrawer}
                >
                  <span className="barsBtn"></span>
                </Button>
                <Drawer
                  title="Menu"
                  placement="right"
                  closable={false}
                  onClose={this.onClose}
                  visible={this.state.visible}
                >
                  {" "}
                  <LeftMenu />
                  <RightMenu />
                </Drawer>
              </>
            )}
          </div>
        </>
      </nav>
    );
  }
}

export default Navbar;
