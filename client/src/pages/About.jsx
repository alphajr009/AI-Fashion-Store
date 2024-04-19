import React from "react";
import Navbar from "../components/Navbar";
import "../css/About.css";
import aboutImage from "../assets/w.jpg";

function About() {
  return (
    <div className="About">
      <Navbar></Navbar>
      <div className="about">
        <div className="about-container">
          <div className="about-text">
            <h1 className="about-title">Discover Your Unique Palette</h1>
            <p className="about-paragraph">
              Embrace the beauty of your skin tone and unlock the power of color
              coordination. Here's why understanding your skin tone is
              essential:
              <ul className="about-list">
                <li>
                  Enhanced Appearance: Complementing your skin tone with outfit
                  colors brightens your complexion and boosts vibrancy.
                </li>
                <li>
                  Flattering Effect: Choose colors that complement your skin
                  tone to appear healthier and minimize imperfections, enhancing
                  your best features.
                </li>
                <li>
                  Confidence Boost: Matching colors can enhance self-esteem, as
                  feeling good about your appearance positively impacts
                  confidence.
                </li>
                <li>
                  Versatility: Coordinating outfit colors with your skin tone
                  allows for easy mixing and matching, increasing wardrobe
                  versatility.
                </li>
                <li>
                  Time-Saving: Knowing your ideal colors streamlines the
                  dressing process, saving time and reducing decision fatigue.
                </li>
                <li>
                  Professional Appearance: Opting for colors that suit your skin
                  tone in professional settings demonstrates attention to detail
                  and professionalism.
                </li>
                <li>
                  Express Individuality: While considering skin tone,
                  experimenting with shades within your palette allows for
                  unique and personalized style expression.
                </li>
              </ul>
            </p>
          </div>
          <div className="about-image">
            <img src={aboutImage} alt="About" className="about-img" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
