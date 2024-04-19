import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Button, Modal, notification, Table } from "antd";
import "../../css/admin.css";

function Blogs() {
  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("/api/blog/getallblogs");
      setBlogs(response.data.blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const deleteProduct = async () => {
    try {
      const response = await axios.patch("/api/blog/deleteblog", {
        _id: selectedBlog._id,
      });
      notification.success({
        message: "Success",
        description: response.data,
      });
      fetchBlogs();
      setIsModalVisible1(false);
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const showDeleteConfirm = (blog) => {
    setSelectedBlog(blog);
    setIsModalVisible1(true);
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Button type="link" onClick={() => showDeleteConfirm(record)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="blogs-comp">
      <div className="ph-header">
        <h3>Blogs</h3>
      </div>
      <div className="bc-table">
        <Table dataSource={blogs} columns={columns} rowKey="_id" />
      </div>
      <Modal
        title="Delete Blog"
        visible={isModalVisible1}
        onOk={deleteProduct}
        onCancel={() => setIsModalVisible1(false)}
      >
        <p>Are you sure you want to delete this blog?</p>
      </Modal>
    </div>
  );
}

export default Blogs;
