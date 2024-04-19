import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import "../css/Home.css";
import ImageUploader from "../components/ImageUploader";
import { Checkbox, Button, Spin } from "antd";

function FindColor() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const [imageurls, setImageurls] = useState(Array(1).fill(""));

  const [isPrivacyPolicyChecked, setIsPrivacyPolicyChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenID, setTokenID] = useState(null);

  const onImageUpload = (index, imageFile) => {
    setImageurls((prevImageurls) => {
      const newImageurls = [...prevImageurls];
      newImageurls[index] = imageFile;
      console.log(`Image at index ${index}:`, imageFile);
      return newImageurls;
    });
  };

  const handlePrivacyPolicyChange = (e) => {
    setIsPrivacyPolicyChecked(e.target.checked);
  };

  function generateToken() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "";
    for (let i = 0; i < 12; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
  }

  async function uploadimageskin() {
    setIsLoading(true);

    const formData = new FormData();
    const token = generateToken();

    imageurls.forEach((image, index) => {
      if (image) {
        formData.append("images", image, `${token}.jpg`);
      }
    });

    try {
      const response = await axios.post("/api/product/uploadskin", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.status);

      setTimeout(() => {
        window.location.href = `/matching-colors/${token}`;
      }, 7000);
    } catch (error) {
      if (error.response) {
        console.log("Error1:", error.response.data);
      } else {
        console.log("Error2:", error.message);
      }
    }
  }

  return (
    <div className="find-color">
      <Navbar></Navbar>
      <div className="fc-content">
        <div className="fcc">
          <div className="fcc-card">
            <div className="fcc-card-header">
              <h6>Upload image of you Skin</h6>
            </div>
            <div className="fcc-card-c">
              <div className="scrb-s2-iu-wrapper">
                {Array(1)
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
            <p>
              At AI Fashion , we've integrated cutting-edge technology to
              elevate your shopping experience. After uploading a clear photo of
              your skin and submitting it, our advanced model analyzes the image
              to suggest a matching clothing color palette tailored just for
              you. To ensure the best results, please remember to:
              <br />
              <br />
              <li>
                Upload a high-quality photo with clear visibility of your skin
                tones.
              </li>
              <li>Ensure the photo is well-lit to capture accurate colors.</li>
              <li>
                Avoid shadows or harsh lighting that could distort the image.
              </li>{" "}
              <li>
                Pay attention to the background; a neutral backdrop is ideal for
                precise analysis.
              </li>{" "}
              <br />
              <br />
              <div className="signup-agree-label">
                <Checkbox
                  checked={isPrivacyPolicyChecked}
                  onChange={handlePrivacyPolicyChange}
                >
                  By checking this box, I agree to the{" "}
                  <a href="#PrivacyPolicy">Terms and Conditions</a> and consent
                  to the use of my uploaded photo for color analysis and
                  personalized fashion recommendations
                </Checkbox>
              </div>
            </p>
            <Button
              className="login-btn"
              type="primary"
              htmlType="submit"
              disabled={!isPrivacyPolicyChecked || isLoading}
              onClick={uploadimageskin}
            >
              <div>
                {isLoading ? (
                  <>
                    Analyze Color
                    <Spin style={{ marginLeft: "30px", color: "white" }} />
                  </>
                ) : (
                  "Analyze Color"
                )}
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FindColor;
