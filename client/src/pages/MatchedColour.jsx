import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../css/Home.css";
import "../index.css";
import Navbar from "../components/Navbar";
import UserFooter from "../components/footer/UserFooter";
import Hero from "../assets/9.png";
import { Button, Select, Pagination } from "antd";

function MatchedColour() {
  let params = useParams();

  const [details, setDetails] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = (
          await axios.post("http://localhost:5005/analyze/", {
            tokenID: params.tokenID,
          })
        ).data;
        setDetails(data);
        setImageSrc(`../../../tokens/${params.tokenID}.jpg`);
      } catch (error) {
        console.log("error");
      }
    })();
  }, [params.tokenID]);

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  return (
    <div className="MatchedColour">
      <Navbar />
      <div className="fc-content">
        <div className="fcc">
          <div className="fcc-card">
            <div className="fcc-card-header">
              <h6>Analyzed Colors</h6>
            </div>
            <div className="mc-body">
              <div className="mc-body-image">
                <img src={imageSrc} alt="" />
              </div>

              <div className="mc-body-content">
                <div className="mcbc-points">
                  <li>Detected Skin Color is {details.Type} </li>
                  <li>
                    Matching Costume Colors are <b>{details.matching_colors}</b>{" "}
                  </li>
                </div>
                <div className="mcbc-colors">
                  <div className="mcbc-col-header">
                    <h5>Discover our costumes with matching colors ,</h5>
                  </div>
                  <div className="mcbc-col-btns">
                    {details.matching_colors &&
                      details.matching_colors[0].split(",").map((color) => (
                        <Link
                          key={color}
                          to={`/discover/${color}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <button
                            className={`color-btn align-mcbs ${
                              selectedColor === color ? "selected" : ""
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorChange(color)}
                          ></button>
                        </Link>
                      ))}
                  </div>

                  <div className="important-note">
                    <b>Important Note:</b>
                    <p>
                      Our AI-generated color matches are based on predictions
                      and may not always match actual colors due to factors like
                      lighting and screen calibration. While we aim for
                      accuracy, differences between predicted and actual colors
                      may occur. Use these suggestions as a starting point to
                      explore fashion options that complement your skin tone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchedColour;
