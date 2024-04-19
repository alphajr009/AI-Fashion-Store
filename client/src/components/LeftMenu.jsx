import React, { Component } from "react";
import { Menu } from "antd";

class LeftMenu extends Component {
  render() {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    return (
      <Menu mode="horizontal">
        <>
          <Menu.Item key="discover">
            <a href="/">Discover</a>
          </Menu.Item>

          <Menu.Item key="about">
            <a href="/about">About</a>
          </Menu.Item>

          <Menu.Item key="blog">
            <a href="/blog">Blog</a>
          </Menu.Item>
        </>
      </Menu>
    );
  }
}

export default LeftMenu;
