import React, { useState, useEffect } from "react";
import "../css/Home.css";
import "../index.css";
import axios from "axios";
import Navbar from "../components/Navbar";
import UserFooter from "../components/footer/UserFooter";
import { Input, Form, Button, Modal, notification, Select } from "antd";
import ImageUploader from "../components/ImageUploader";
import { Link } from "react-router-dom";

function Blog() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [blogs, setBlogs] = useState([]);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");

  const user = JSON.parse(localStorage.getItem("currentUser"));

  const showModal = () => {
    setIsModalVisible(true);
  };

  const [imageurls, setImageurls] = useState(Array(4).fill(""));

  const onImageUpload = (index, imageFile) => {
    setImageurls((prevImageurls) => {
      const newImageurls = [...prevImageurls];
      newImageurls[index] = imageFile;
      console.log(`Image at index ${index}:`, imageFile);
      return newImageurls;
    });
  };

  async function createblog() {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);

    imageurls.forEach((image, index) => {
      if (image) {
        formData.append("images", image, `${user._id}-${index}.jpg`);
      }
    });

    try {
      const response = await axios.post("/api/blog/addblog", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.status);

      notification.success({
        message: "Success",
        description: "Blog Created Successfully!",
      });

      setTimeout(() => {
        window.location.href = "/blog";
      }, 1000);
    } catch (error) {
      if (error.response) {
        console.log("Error1:");
      } else {
        console.log("Error2:");
      }
    }
  }

  const handleOk = () => {
    setIsModalVisible(false);
    createblog();
  };

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await axios.get("/api/blog/getallblogs");
        setBlogs(response.data.blogs);
      } catch (error) {
        console.log("Error fetching blogs:", error);
      }
    }

    fetchBlogs();
  }, []);

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength);
  };

  return (
    <div className="Blog">
      <Navbar></Navbar>
      <div className="blog-content">
        <div className="bc-header">
          <Button onClick={showModal}> Create Blog</Button>
        </div>
        <br />
        <div className="bc-blogs-all">
          <div className="bc-blogs">
            {blogs.map((blog, index) => (
              <Link to={`/blog/${blog._id}`}>
                <div key={index} className="bc-blog-card">
                  <div className="bbl-header">
                    <h5>{blog.title}</h5>
                  </div>
                  <br />
                  <div className="bbl-content">
                    <div className="bblc-image">
                      <img
                        src={`../../../uploads/${blog._id}-0.jpg`}
                        alt={blog.title}
                        width={300}
                      />
                    </div>
                    <br />
                    <div className="bblc-short">
                      <p>
                        {truncateText(blog.description, 285)}{" "}
                        <b> , See More ...</b>
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Modal
        width={800}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <div className="blog-form">
          <div className="crb-s2-header">
            <h5>Upload Blog images:</h5>
          </div>
          <br />
          <div className="crb-s2-images-upload">
            <div className="scrb-s2-iu-wrapper">
              {Array(4)
                .fill(0)
                .map((_, index) => (
                  <ImageUploader
                    key={index}
                    index={index}
                    onImageUpload={onImageUpload}
                  />
                ))}
            </div>
          </div>
          <br />
          <br />

          <Form>
            <div className="bf-content">
              <div className="aligh-items-cplaces">
                <div className="-container">
                  <Form.Item
                    className="-conatiner-p"
                    label="Title:"
                    name="title"
                    rules={[
                      {
                        required: true,
                        message: "Please input Blog Title!",
                      },
                    ]}
                  >
                    <Input
                      className="createblog-dis-custom-input"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                      maxLength={85}
                    />
                  </Form.Item>
                </div>
              </div>

              <div className="aligh-items-cplaces">
                <div className="-container">
                  <Form.Item
                    className="-conatiner-p"
                    label="Author:"
                    name="author"
                    rules={[
                      {
                        required: true,
                        message: "Please input Blog Author!",
                      },
                    ]}
                  >
                    <Input
                      className="createblog-dis-custom-input"
                      value={author}
                      onChange={(e) => {
                        setAuthor(e.target.value);
                      }}
                      maxLength={85}
                    />
                  </Form.Item>
                </div>
              </div>

              <div className="userp-help-messagebox">
                <div className="userp-help-namebox-container">
                  <Form.Item
                    className="userp-help-namebox-conatiner-p"
                    label="Description :"
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: "Please input your blog description!",
                      },
                    ]}
                  >
                    <Input.TextArea
                      style={{ height: "245px", width: "626px" }}
                      maxLength={3200}
                      className="userp-helpmsg-custom-input"
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </Modal>

      <UserFooter />
    </div>
  );
}

export default Blog;
