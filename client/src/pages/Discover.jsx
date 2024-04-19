import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../css/Home.css";
import "../index.css";
import Navbar from "../components/Navbar";
import UserFooter from "../components/footer/UserFooter";
import { Button, Select, Pagination } from "antd";

function Discover() {
  let params = useParams();
  const { color: initialColor } = params;
  const { Option } = Select;

  const [selectedType, setSelectedType] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [selectedColor, setSelectedColor] = useState(initialColor || "");

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  const handleTypeChange = (value) => {
    setSelectedType(value);
  };

  const handleOccasionChange = (value) => {
    setSelectedOccasion(value);
  };

  const handleAgeChange = (value) => {
    setSelectedAge(value);
  };

  const handleColorChange = (value) => {
    setSelectedColor(value);
  };

  const clearFilters = () => {
    setSelectedType("");
    setSelectedOccasion("");
    setSelectedAge("");
    setSelectedColor("");
  };

  const types = [
    "Dresses",
    "Tops",
    "TShirts",
    "Pants",
    "Skirts",
    "Jeans",
    "Shorts",
    "JumpSuits",
    "Jackets",
  ];

  const colors = [
    "Red",
    "Green",
    "Yellow",
    "Purple",
    "Black",
    "White",
    "Orange",
    "Grey",
    "Blue",
    "Pink",
    "Brown",
  ];

  const occasion = [
    "Casual",
    "Formal",
    "Date Night",
    "Beach",
    "Sport",
    "Vacation",
    "Party",
    "Wedding",
    "Gym",
  ];

  const ageGroups = ["13-19", "20-35", "36-55", "56+"];

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get("/api/product/getallproducts");
        setProducts(response.data.products);
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (selectedType) {
      filtered = filtered.filter((product) => product.type === selectedType);
    }

    if (selectedOccasion) {
      filtered = filtered.filter(
        (product) => product.occasion === selectedOccasion
      );
    }

    if (selectedAge) {
      filtered = filtered.filter((product) => product.age === selectedAge);
    }

    if (selectedColor) {
      filtered = filtered.filter((product) => product.color === selectedColor);
    }

    setFilteredProducts(filtered);
  }, [selectedType, selectedOccasion, selectedAge, selectedColor, products]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const numColumns = currentProducts.length < 3 ? currentProducts.length : 3;
  const columnWidth = `${100 / numColumns}%`;

  return (
    <div className="Home">
      <Navbar></Navbar>

      <div className="hc-f-d">
        <div className="hc-f">
          <div className="hc-f-header">
            <h4>Filters</h4>
            <button className="btn-clear" onClick={clearFilters}>
              clear all
            </button>{" "}
          </div>
          <br />
          <div className="cf-f-type">
            <label>Type</label>
            <br />
            <Select
              className="createblog-category-select"
              placeholder="Category"
              style={{ width: "180px", marginTop: "15px" }}
              value={selectedType}
              onChange={handleTypeChange}
            >
              {types.map((category) => (
                <Option key={category}>{category}</Option>
              ))}
            </Select>
          </div>

          <div className="cf-f-type">
            <label>Age</label>
            <br />
            <Select
              className="createblog-category-select"
              placeholder="Category"
              style={{ width: "180px", marginTop: "15px" }}
              value={selectedAge}
              onChange={handleAgeChange}
            >
              {ageGroups.map((category) => (
                <Option key={category}>{category}</Option>
              ))}
            </Select>
          </div>

          <div className="cf-f-type">
            <label>Occasion</label>
            <br />
            <Select
              className="createblog-category-select"
              placeholder="Category"
              style={{ width: "180px", marginTop: "15px" }}
              value={selectedOccasion}
              onChange={handleOccasionChange}
            >
              {occasion.map((category) => (
                <Option key={category}>{category}</Option>
              ))}
            </Select>
          </div>

          <div className="cf-f-type colours-type">
            <label>Color</label>
            <br />
            <br />
            <div className="color-buttons">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`color-btn ${
                    selectedColor === color ? "selected" : ""
                  }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  onClick={() => handleColorChange(color)}
                ></button>
              ))}
            </div>
          </div>
        </div>
        <div className="hc-d">
          <div
            className="products-grid"
            style={{
              gridTemplateColumns: `repeat(${numColumns}, ${columnWidth})`,
            }}
          >
            {currentProducts.map((product, index) => (
              <div key={index} className="product-card">
                <div className="pc-img">
                  <img
                    src={`../../../uploads/${product._id}-0.jpg`}
                    alt=""
                    onError={(e) => {
                      e.target.onerror = null;
                    }}
                  />
                </div>
                <div className="pc-abt">
                  <p className="h4-p">{product.name}</p>
                  <p>
                    <b>{`Rs.${product.price}`}</b>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Pagination
        className="pagintion-product"
        current={currentPage}
        total={filteredProducts.length}
        pageSize={productsPerPage}
        onChange={paginate}
      />
      <UserFooter />
    </div>
  );
}

export default Discover;
