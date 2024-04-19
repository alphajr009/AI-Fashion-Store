import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/Home.css";
import axios from "axios";
import Navbar from "../components/Navbar";
import UserFooter from "../components/footer/UserFooter";

function BlogItem() {
  let params = useParams();

  const [blog, setBlog] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = (
          await axios.post("/api/blog/getblogbyid", { blogid: params.blogid })
        ).data;
        setBlog(data.blog[0]);
      } catch (error) {
        console.log("error");
      }
    })();
  }, [params.blogid]);

  return (
    <div className="blogitem">
      <Navbar></Navbar>
      <div className="bi-content">
        <div className="bic-header">
          <h3>{blog.title}</h3>
        </div>
        <div className="bic-images">
          <div className="bic-col">
            <img
              src={`../../../uploads/${blog._id}-0.jpg`}
              alt={blog.title}
              width={300}
            />

            <img
              src={`../../../uploads/${blog._id}-1.jpg`}
              alt={blog.title}
              width={300}
            />
          </div>
          <div className="bic-col">
            <img
              src={`../../../uploads/${blog._id}-2.jpg`}
              alt={blog.title}
              width={300}
            />

            <img
              src={`../../../uploads/${blog._id}-3.jpg`}
              alt={blog.title}
              width={300}
            />
          </div>
        </div>
        <br />
        <br />
        <div className="bic-description">
          <p
            dangerouslySetInnerHTML={{
              __html:
                blog && blog.description
                  ? blog.description.replace(/\n/g, "<br/>")
                  : "",
            }}
          ></p>
        </div>
      </div>

      <UserFooter />
    </div>
  );
}

export default BlogItem;
